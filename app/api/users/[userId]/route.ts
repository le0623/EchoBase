import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, UserStatus } from '@prisma/client';

// GET /api/users/[userId] - Get a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { user, tenant } = await requireTenant();

    // Check if user has permission to view users
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const targetUser = await prisma.user.findFirst({
      where: {
        id: params.userId,
        tenantId: tenant.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImageUrl: true,
        status: true,
        role: true,
        lastActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: targetUser });
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
  { params }: { params: { userId: string } }
) {
  try {
    const { user, tenant } = await requireTenant();

    // Check if user has permission to update users
    if (user.role !== 'ADMIN') {
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
        id: params.userId,
        tenantId: tenant.id,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent users from updating themselves to inactive
    if (user.id === params.userId && status === 'INACTIVE') {
      return NextResponse.json(
        { error: 'Cannot deactivate your own account' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.userId },
      data: {
        ...(name && { name }),
        ...(role && { role: role as UserRole }),
        ...(status && { status: status as UserStatus }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImageUrl: true,
        status: true,
        role: true,
        lastActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
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
  { params }: { params: { userId: string } }
) {
  try {
    const { user, tenant } = await requireTenant();

    // Check if user has permission to delete users
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Prevent users from deleting themselves
    if (user.id === params.userId) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 400 }
      );
    }

    // Check if user exists and belongs to tenant
    const targetUser = await prisma.user.findFirst({
      where: {
        id: params.userId,
        tenantId: tenant.id,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id: params.userId },
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
