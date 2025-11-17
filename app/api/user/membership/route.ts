import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/user/membership - Get current user's membership info for the current tenant
export async function GET(request: NextRequest) {
  try {
    const { user, tenant } = await requireTenant(request);

    // Get user's membership in this tenant
    const membership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
      select: {
        role: true,
        isOwner: true,
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'User is not a member of this tenant' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      role: membership.role,
      isOwner: membership.isOwner,
      isAdmin: membership.role === 'ADMIN' || membership.isOwner,
    });
  } catch (error) {
    console.error('Error fetching user membership:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user membership' },
      { status: 500 }
    );
  }
}

