import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name } = await request.json();

    // Validate input
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Organization name is required' },
        { status: 400 }
      );
    }

    if (name.length < 3) {
      return NextResponse.json(
        { error: 'Organization name must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: 'Organization name must be less than 50 characters' },
        { status: 400 }
      );
    }

    // Check for valid characters
    if (!/^[a-zA-Z0-9-]+$/.test(name)) {
      return NextResponse.json(
        { error: 'Organization name can only contain letters, numbers, and hyphens' },
        { status: 400 }
      );
    }

    // Check if tenant name already exists
    const existingTenant = await prisma.tenant.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        }
      }
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'Organization name is already taken. Please choose a different name.' },
        { status: 400 }
      );
    }

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        tenants: {
          where: { isOwner: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user already owns an organization
    const ownedTenants = user.tenants.filter(tenant => tenant.isOwner);
    if (ownedTenants.length > 0) {
      return NextResponse.json(
        { error: 'You can only create one organization. You already own an organization.' },
        { status: 400 }
      );
    }

    // Create the tenant and add user as owner in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the tenant
      const tenant = await tx.tenant.create({
        data: {
          name: name.trim(),
          subdomain: name.toLowerCase().replace(/[^a-z0-9-]/g, ''),
        }
      });

      // Add user as owner of the tenant
      await tx.tenantMember.create({
        data: {
          userId: user.id,
          tenantId: tenant.id,
          role: 'ADMIN',
          isOwner: true,
        }
      });

      return tenant;
    });

    return NextResponse.json(
      { 
        message: 'Organization created successfully', 
        tenant: {
          id: result.id,
          name: result.name,
          subdomain: result.subdomain
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Tenant creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
