import crypto from 'crypto';
import { prisma } from './prisma';

/**
 * Generate a new API key
 * Format: eb_{random_string}
 */
export function generateApiKey(): string {
  const randomBytes = crypto.randomBytes(32);
  const key = `eb_${randomBytes.toString('base64url')}`;
  return key;
}

/**
 * Hash an API key for storage
 */
export function hashApiKey(key: string): string {
  return crypto.createHash('sha256').update(key).digest('hex');
}

/**
 * Get the prefix (first 8 characters) of an API key for display
 */
export function getApiKeyPrefix(key: string): string {
  return key.substring(0, 11); // "eb_" + 8 chars = 11 chars
}

/**
 * Verify an API key against a hash
 */
export function verifyApiKey(key: string, hash: string): boolean {
  const keyHash = hashApiKey(key);
  
  // Ensure both buffers are the same length for timing-safe comparison
  if (keyHash.length !== hash.length) {
    return false;
  }
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(keyHash),
      Buffer.from(hash)
    );
  } catch (error) {
    return false;
  }
}

/**
 * Calculate expiration date based on duration
 */
export function calculateExpirationDate(duration: '1month' | '3months' | '6months' | '1year' | 'forever'): Date | null {
  const now = new Date();
  
  switch (duration) {
    case '1month': {
      const date = new Date(now);
      date.setMonth(date.getMonth() + 1);
      return date;
    }
    case '3months': {
      const date = new Date(now);
      date.setMonth(date.getMonth() + 3);
      return date;
    }
    case '6months': {
      const date = new Date(now);
      date.setMonth(date.getMonth() + 6);
      return date;
    }
    case '1year': {
      const date = new Date(now);
      date.setFullYear(date.getFullYear() + 1);
      return date;
    }
    case 'forever':
      return null;
    default:
      return null;
  }
}

/**
 * Check if an API key is expired
 */
export function isApiKeyExpired(expirationDate: Date | null): boolean {
  if (!expirationDate) return false; // Never expires
  return new Date() > expirationDate;
}

/**
 * Track API key usage
 */
export async function trackApiKeyUsage(
  apiKeyId: string,
  cost: number
): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Update or create daily usage record
  await prisma.apiKeyUsage.upsert({
    where: {
      apiKeyId_date: {
        apiKeyId,
        date: today,
      },
    },
    update: {
      cost: { increment: cost },
      requestCount: { increment: 1 },
    },
    create: {
      apiKeyId,
      date: today,
      cost,
      requestCount: 1,
    },
  });

  // Update last used timestamp
  await prisma.apiKey.update({
    where: { id: apiKeyId },
    data: { lastUsedAt: new Date() },
  });
}

/**
 * Check if API key has exceeded daily limit
 */
export async function checkDailyLimit(apiKeyId: string): Promise<boolean> {
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: apiKeyId },
  });

  if (!apiKey || apiKey.dailyLimit === 0) return true; // No limit set

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayUsage = await prisma.apiKeyUsage.findUnique({
    where: {
      apiKeyId_date: {
        apiKeyId,
        date: today,
      },
    },
  });

  const currentCost = todayUsage?.cost || 0;
  return currentCost < apiKey.dailyLimit;
}

/**
 * Check if API key has exceeded monthly limit
 */
export async function checkMonthlyLimit(apiKeyId: string): Promise<boolean> {
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: apiKeyId },
  });

  if (!apiKey || apiKey.monthlyLimit === 0) return true; // No limit set

  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const monthlyUsage = await prisma.apiKeyUsage.aggregate({
    where: {
      apiKeyId,
      date: { gte: firstDayOfMonth },
    },
    _sum: {
      cost: true,
    },
  });

  const currentCost = monthlyUsage._sum.cost || 0;
  return currentCost < apiKey.monthlyLimit;
}

/**
 * Get API key usage statistics
 */
export async function getApiKeyUsageStats(apiKeyId: string) {
  const apiKey = await prisma.apiKey.findUnique({
    where: { id: apiKeyId },
    include: {
      usage: {
        orderBy: { date: 'desc' },
        take: 30, // Last 30 days
      },
    },
  });

  if (!apiKey) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const todayUsage = apiKey.usage.find(
    (u) => u.date.getTime() === today.getTime()
  );

  const monthlyUsage = apiKey.usage
    .filter((u) => u.date >= firstDayOfMonth)
    .reduce((sum, u) => sum + u.cost, 0);

  return {
    dailyCost: todayUsage?.cost || 0,
    dailyRequests: todayUsage?.requestCount || 0,
    monthlyCost: monthlyUsage,
    dailyLimit: apiKey.dailyLimit,
    monthlyLimit: apiKey.monthlyLimit,
  };
}

