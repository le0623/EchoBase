import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/[userId] - Get a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { user, tenant } = await requireTenant(request);

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    // Check if user has permission to view users
    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const targetUser = await prisma.user.findFirst({
      where: {
        id: userId,
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
          },
        },
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      user: {
        ...targetUser,
        role: targetUser.tenants[0]?.role,
        isOwner: targetUser.tenants[0]?.isOwner,
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[userId] - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { user, tenant } = await requireTenant(request);

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    // Check if user has permission to update users
    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, role, status } = body;

    // Validate role if provided
    if (role && !['ADMIN', 'MEMBER', 'VIEWER'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !['ACTIVE', 'INACTIVE', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check if user exists and belongs to tenant
    const targetUser = await prisma.user.findFirst({
      where: {
        id: userId,
        tenants: {
          some: {
            tenantId: tenant.id,
          },
        },
      },
      include: {
        tenants: {
          where: {
            tenantId: tenant.id,
          },
        },
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent users from updating themselves to inactive
    if (user.id === userId && status === 'INACTIVE') {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(status && { status: status }),
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
          },
        },
      },
    });

    // Update role if provided
    if (role) {
      await prisma.tenantMember.updateMany({
        where: {
          userId: userId,
          tenantId: tenant.id,
        },
        data: {
          role: role,
        },
      });
    }

    return NextResponse.json({ 
      user: {
        ...updatedUser,
        role: updatedUser.tenants[0]?.role,
        isOwner: updatedUser.tenants[0]?.isOwner,
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[userId] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const { user, tenant } = await requireTenant(request);

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    // Check if user has permission to delete users
    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Prevent users from deleting themselves
    if (user.id === userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Check if user exists and belongs to tenant
    const targetUser = await prisma.user.findFirst({
      where: {
        id: userId,
        tenants: {
          some: {
            tenantId: tenant.id,
          },
        },
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove user from tenant (but don't delete the user completely as they might belong to other tenants)
    await prisma.tenantMember.deleteMany({
      where: {
        userId: userId,
        tenantId: tenant.id,
      },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
