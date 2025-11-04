import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/documents/[documentId]/approve - Approve a document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    const { user, tenant } = await requireTenant(request);

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can approve documents' },
        { status: 403 }
      );
    }

    // Check if document exists and belongs to tenant
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

    // Check if document is already processed
    if (document.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Document has already been processed' },
        { status: 400 }
      );
    }

    // Approve document
    const approvedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'APPROVED',
        approvedBy: user.id,
        approvedAt: new Date(),
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
      },
    });

    return NextResponse.json({
      message: 'Document approved successfully',
      document: {
        id: approvedDocument.id,
        name: approvedDocument.name,
        status: approvedDocument.status,
        approvedBy: approvedDocument.approvedByUser,
        approvedAt: approvedDocument.approvedAt,
      },
    });
  } catch (error) {
    console.error('Error approving document:', error);
    return NextResponse.json(
      { error: 'Failed to approve document' },
      { status: 500 }
    );
  }
}
