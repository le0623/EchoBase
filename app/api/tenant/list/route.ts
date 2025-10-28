import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user with their tenant memberships
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        tenants: {
          include: {
            tenant: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform the data to include tenant information
    const tenants = user.tenants.map(membership => ({
      id: membership.tenant.id,
      name: membership.tenant.name,
      subdomain: membership.tenant.subdomain,
      isOwner: membership.isOwner,
      role: membership.role
    }));

    return NextResponse.json({
      tenants,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl
      }
    });

  } catch (error) {
    console.error('Tenant list error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
