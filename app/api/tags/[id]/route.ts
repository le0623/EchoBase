import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/tags/[id] - Update a tag
export async function PUT(
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
        { error: 'Insufficient permissions. Only admins and owners can manage tags.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    // Verify tag belongs to tenant
    const tag = await prisma.tag.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    // Check if new name conflicts with existing tag
    const existingTag = await prisma.tag.findUnique({
      where: {
        tenantId_name: {
          tenantId: tenant.id,
          name: name.trim(),
        },
      },
    });

    if (existingTag && existingTag.id !== id) {
      return NextResponse.json(
        { error: 'Tag with this name already exists' },
        { status: 400 }
      );
    }

    const updatedTag = await prisma.tag.update({
      where: { id },
      data: {
        name: name.trim(),
      },
    });

    return NextResponse.json({ tag: updatedTag });
  } catch (error) {
    console.error('Error updating tag:', error);
    return NextResponse.json(
      { error: 'Failed to update tag' },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/[id] - Delete a tag
export async function DELETE(
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
        { error: 'Insufficient permissions. Only admins and owners can manage tags.' },
        { status: 403 }
      );
    }

    // Verify tag belongs to tenant
    const tag = await prisma.tag.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    });

    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }

    await prisma.tag.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json(
      { error: 'Failed to delete tag' },
      { status: 500 }
    );
  }
}

