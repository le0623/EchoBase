import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

// GET /api/user/tenants - Get all tenants for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

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

    // Format tenants with user's role in each tenant
    const formattedTenants = user.tenants.map((member) => ({
      id: member.tenant.id,
      name: member.tenant.name,
      subdomain: member.tenant.subdomain,
      role: member.role,
      isOwner: member.isOwner,
      joinedAt: member.joinedAt,
    }));

    return NextResponse.json({ tenants: formattedTenants });
  } catch (error) {
    console.error('Error fetching user tenants:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tenants' },
      { status: 500 }
    );
  }
}

