import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/users/[userId]/tags - Get tags for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { user, tenant } = await requireTenant(request);
    const { userId } = await params;

    // Check if user is admin or owner, or viewing their own tags
    const membership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    const isAdminOrOwner = membership && (membership.role === 'ADMIN' || membership.isOwner);
    const isOwnProfile = user.id === userId;

    if (!isAdminOrOwner && !isOwnProfile) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get user's tenant member record
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId,
        tenantId: tenant.id,
      },
      include: {
        tags: true, // Direct access to tags with implicit many-to-many
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: 'User not found in this tenant' },
        { status: 404 }
      );
    }

    const tags = userMembership.tags.map(tag => ({
      id: tag.id,
      name: tag.name,
    }));

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching user tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user tags' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[userId]/tags - Update tags for a user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { user, tenant } = await requireTenant(request);
    const { userId } = await params;

    // Check if user is admin or owner
    const membership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    if (!membership || (membership.role !== 'ADMIN' && !membership.isOwner)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admins and owners can manage user tags.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { tagIds } = body;

    if (!Array.isArray(tagIds)) {
      return NextResponse.json(
        { error: 'tagIds must be an array' },
        { status: 400 }
      );
    }

    // Get user's tenant member record
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId,
        tenantId: tenant.id,
      },
    });

    if (!userMembership) {
      return NextResponse.json(
        { error: 'User not found in this tenant' },
        { status: 404 }
      );
    }

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

    // Update tags using implicit many-to-many (connect/disconnect)
    await prisma.tenantMember.update({
      where: { id: userMembership.id },
      data: {
        tags: {
          set: tagIds.map(tagId => ({ id: tagId })),
        },
      },
    });

    // Fetch updated tags
    const updatedMembership = await prisma.tenantMember.findUnique({
      where: { id: userMembership.id },
      include: {
        tags: true,
      },
    });

    return NextResponse.json({
      tags: updatedMembership?.tags.map(tag => ({
        id: tag.id,
        name: tag.name,
      })) || [],
    });
  } catch (error) {
    console.error('Error updating user tags:', error);
    return NextResponse.json(
      { error: 'Failed to update user tags' },
      { status: 500 }
    );
  }
}

