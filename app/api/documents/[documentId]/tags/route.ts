import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/documents/[documentId]/tags - Get access tags for a document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { user, tenant } = await requireTenant(request);
    const { documentId } = await params;

    // Check if user is admin or owner
    const membership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    if (!membership || (membership.role !== 'ADMIN' && !membership.isOwner)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admins and owners can view document access tags.' },
        { status: 403 }
      );
    }

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        tenantId: tenant.id,
      },
      include: {
        accessTags: true, // Direct access to tags with implicit many-to-many
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const tags = document.accessTags.map(tag => ({
      id: tag.id,
      name: tag.name,
    }));

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching document tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document tags' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[documentId]/tags - Update access tags for a document
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { user, tenant } = await requireTenant(request);
    const { documentId } = await params;

    // Check if user is admin or owner
    const membership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    if (!membership || (membership.role !== 'ADMIN' && !membership.isOwner)) {
      return NextResponse.json(
        { error: 'Insufficient permissions. Only admins and owners can manage document access tags.' },
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

    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        tenantId: tenant.id,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
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
    await prisma.document.update({
      where: { id: documentId },
      data: {
        accessTags: {
          set: tagIds.map(tagId => ({ id: tagId })),
        },
      },
    });

    // Fetch updated tags
    const updatedDocument = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        accessTags: true,
      },
    });

    return NextResponse.json({
      tags: updatedDocument?.accessTags.map(tag => ({
        id: tag.id,
        name: tag.name,
      })) || [],
    });
  } catch (error) {
    console.error('Error updating document tags:', error);
    return NextResponse.json(
      { error: 'Failed to update document tags' },
      { status: 500 }
    );
  }
}

