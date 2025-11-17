import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users - Get all users in the tenant
export async function GET(request: NextRequest) {
  try {
    const { user, tenant } = await requireTenant(request);

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    // Check if user has permission to view users (admin only for now)
    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        tenants: {
          some: {
            tenantId: tenant.id,
          },
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImageUrl: true,
        status: true,
        lastActive: true,
        createdAt: true,
        updatedAt: true,
        tenants: {
          where: {
            tenantId: tenant.id,
          },
          select: {
            role: true,
            isOwner: true,
            tags: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ 
      users: users.map(user => ({
        ...user,
        role: user.tenants[0]?.role,
        isOwner: user.tenants[0]?.isOwner,
        tags: user.tenants[0]?.tags || [],
      }))
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (invitation)
export async function POST(request: NextRequest) {
  try {
    const { user, tenant } = await requireTenant(request);

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    // Check if user has permission to invite users
    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, role, tagIds = [] } = body; // role is optional (only ADMIN), tagIds are the custom roles

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate role (only ADMIN is allowed, or null/undefined for regular users)
    if (role && role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Invalid role. Only ADMIN is allowed for system administration.' },
        { status: 400 }
      );
    }

    // Validate tagIds if provided
    if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
      // Verify all tags belong to this tenant
      const tags = await prisma.tag.findMany({
        where: {
          id: { in: tagIds },
          tenantId: tenant.id,
        },
      });

      if (tags.length !== tagIds.length) {
        return NextResponse.json(
          { error: 'One or more tags not found or do not belong to this tenant' },
          { status: 400 }
        );
      }
    }

    // Check if user already belongs to this tenant
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        tenants: {
          where: {
            tenantId: tenant.id,
          },
        },
      },
    });

    if (existingUser && existingUser.tenants.length > 0) {
      return NextResponse.json(
        { error: 'User is already a member of this organization' },
        { status: 400 }
      );
    }

    // Check if there's already a pending invitation for this email and tenant
    const existingInvitation = await prisma.userInvitation.findFirst({
      where: {
        email,
        tenantId: tenant.id,
        status: 'PENDING',
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Invitation already sent to this email for this organization' },
        { status: 400 }
      );
    }

    // Generate invitation token
    const token = generateInvitationToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Create invitation
    const invitation = await prisma.userInvitation.create({
      data: {
        email,
        role: role || null, // Only ADMIN or null
        tagIds: tagIds || [], // Custom roles via tags
        token,
        invitedBy: user.id,
        tenantId: tenant.id,
        expiresAt,
      },
    });

    // Send invitation email (this will be implemented in the invitation endpoint)
    return NextResponse.json({
      message: 'User invitation created successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        tagIds: invitation.tagIds,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error creating user invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create user invitation' },
      { status: 500 }
    );
  }
}

function generateInvitationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
