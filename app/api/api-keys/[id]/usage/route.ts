import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getApiKeyUsageStats } from '@/lib/api-keys';

// GET /api/api-keys/[id]/usage - Get usage statistics for an API key
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, tenant } = await requireTenant(request);
    const { id } = await params;

    // Check if user is admin or owner
    const membership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    if (!membership || (membership.role !== 'ADMIN' && !membership.isOwner)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admins and owners can view API key usage.' },
        { status: 403 }
      );
    }

    // Verify API key belongs to tenant
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    const stats = await getApiKeyUsageStats(id);

    if (!stats) {
      return NextResponse.json(
        { error: 'Failed to fetch usage statistics' },
        { status: 500 }
      );
    }

    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching API key usage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage statistics' },
      { status: 500 }
    );
  }
}

