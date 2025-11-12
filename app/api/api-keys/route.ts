import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateApiKey, hashApiKey, getApiKeyPrefix, calculateExpirationDate } from '@/lib/api-keys';

// GET /api/api-keys - Get all API keys for the tenant
export async function GET(request: NextRequest) {
  try {
    const { user, tenant } = await requireTenant(request);

    // Check if user is admin or owner
    const membership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    if (!membership || (membership.role !== 'ADMIN' && !membership.isOwner)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admins and owners can manage API keys.' },
        { status: 403 }
      );
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        tenantId: tenant.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        usage: {
          orderBy: { date: 'desc' },
          take: 30,
        },
      },
    });

    // Calculate usage stats for each key
    const apiKeysWithStats = apiKeys.map((key) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const todayUsage = key.usage.find(
        (u) => u.date.getTime() === today.getTime()
      );

      const monthlyUsage = key.usage
        .filter((u) => u.date >= firstDayOfMonth)
        .reduce((sum, u) => sum + u.cost, 0);

      return {
        id: key.id,
        name: key.name,
        prefix: key.prefix,
        expirationDate: key.expirationDate,
        isEnabled: key.isEnabled,
        dailyLimit: key.dailyLimit,
        monthlyLimit: key.monthlyLimit,
        lastUsedAt: key.lastUsedAt,
        createdAt: key.createdAt,
        dailyCost: todayUsage?.cost || 0,
        dailyRequests: todayUsage?.requestCount || 0,
        monthlyCost: monthlyUsage,
        isExpired: key.expirationDate ? new Date() > key.expirationDate : false,
      };
    });

    return NextResponse.json({ apiKeys: apiKeysWithStats });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

// POST /api/api-keys - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const { user, tenant } = await requireTenant(request);

    // Check if user is admin or owner
    const membership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    if (!membership || (membership.role !== 'ADMIN' && !membership.isOwner)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admins and owners can manage API keys.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, expirationDuration, dailyLimit, monthlyLimit } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      );
    }

    if (!expirationDuration || !['1month', '3months', '6months', '1year', 'forever'].includes(expirationDuration)) {
      return NextResponse.json(
        { error: 'Invalid expiration duration' },
        { status: 400 }
      );
    }

    // Generate API key
    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);
    const prefix = getApiKeyPrefix(apiKey);
    const expirationDate = calculateExpirationDate(expirationDuration as '1month' | '3months' | '6months' | '1year' | 'forever');

    // Create API key record
    const createdKey = await prisma.apiKey.create({
      data: {
        tenantId: tenant.id,
        name: name.trim(),
        keyHash,
        prefix,
        expirationDate,
        dailyLimit: dailyLimit || 0,
        monthlyLimit: monthlyLimit || 0,
        isEnabled: true,
      },
    });

    // Return the full key only once (for display to user)
    return NextResponse.json({
      apiKey: {
        id: createdKey.id,
        name: createdKey.name,
        key: apiKey, // Only returned on creation
        prefix: createdKey.prefix,
        expirationDate: createdKey.expirationDate,
        isEnabled: createdKey.isEnabled,
        dailyLimit: createdKey.dailyLimit,
        monthlyLimit: createdKey.monthlyLimit,
        createdAt: createdKey.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    );
  }
}

