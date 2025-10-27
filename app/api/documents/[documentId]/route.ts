import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteFromS3 } from '@/lib/s3';

// GET /api/documents/[documentId] - Get a specific document
export async function GET(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const { user, tenant } = await requireTenant();

    const document = await prisma.document.findFirst({
      where: {
        id: params.documentId,
        tenantId: tenant.id,
      },
      include: {
        submittedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
        approvedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rejectedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      document: {
        id: document.id,
        name: document.name,
        originalName: document.originalName,
        description: document.description,
        tags: document.tags,
        fileUrl: document.fileUrl,
        fileKey: document.fileKey,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        version: document.version,
        status: document.status,
        submittedBy: document.submittedByUser,
        approvedBy: document.approvedByUser,
        rejectedBy: document.rejectedByUser,
        rejectionReason: document.rejectionReason,
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
        approvedAt: document.approvedAt,
        rejectedAt: document.rejectedAt,
      },
    });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[documentId] - Update document metadata
export async function PUT(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const { user, tenant } = await requireTenant();

    const body = await request.json();
    const { name, description, tags } = body;

    // Check if user has permission to update document
    const document = await prisma.document.findFirst({
      where: {
        id: params.documentId,
        tenantId: tenant.id,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Only document submitter or admin can update document metadata
    if (document.submittedBy !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions to update document' },
        { status: 403 }
      );
    }

    // Parse tags
    const tagsArray = tags ? tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : document.tags;

    // Update document
    const updatedDocument = await prisma.document.update({
      where: { id: params.documentId },
      data: {
        ...(name && { name: name.trim() }),
        ...(description !== undefined && { description: description?.trim() || null }),
        tags: tagsArray,
      },
      include: {
        submittedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImageUrl: true,
          },
        },
        approvedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        rejectedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Document updated successfully',
      document: {
        id: updatedDocument.id,
        name: updatedDocument.name,
        originalName: updatedDocument.originalName,
        description: updatedDocument.description,
        tags: updatedDocument.tags,
        fileUrl: updatedDocument.fileUrl,
        fileKey: updatedDocument.fileKey,
        fileSize: updatedDocument.fileSize,
        mimeType: updatedDocument.mimeType,
        version: updatedDocument.version,
        status: updatedDocument.status,
        submittedBy: updatedDocument.submittedByUser,
        approvedBy: updatedDocument.approvedByUser,
        rejectedBy: updatedDocument.rejectedByUser,
        rejectionReason: updatedDocument.rejectionReason,
        createdAt: updatedDocument.createdAt,
        updatedAt: updatedDocument.updatedAt,
        approvedAt: updatedDocument.approvedAt,
        rejectedAt: updatedDocument.rejectedAt,
      },
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[documentId] - Delete document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { documentId: string } }
) {
  try {
    const { user, tenant } = await requireTenant();

    // Check if user has permission to delete document
    const document = await prisma.document.findFirst({
      where: {
        id: params.documentId,
        tenantId: tenant.id,
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // Only document submitter or admin can delete document
    if (document.submittedBy !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions to delete document' },
        { status: 403 }
      );
    }

    // Delete from S3
    await deleteFromS3(document.fileKey);

    // Delete from database
    await prisma.document.delete({
      where: { id: params.documentId },
    });

    return NextResponse.json({
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
