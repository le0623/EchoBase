import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/documents/[documentId]/reject - Reject a document
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    const { user, tenant } = await requireTenant();

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can reject documents' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { reason } = body;

    if (!reason || reason.trim() === '') {
      return NextResponse.json(
        { error: 'Rejection reason is required' },
        { status: 400 }
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

    // Reject document
    const rejectedDocument = await prisma.document.update({
      where: { id: documentId },
      data: {
        status: 'REJECTED',
        rejectedBy: user.id,
        rejectionReason: reason.trim(),
        rejectedAt: new Date(),
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
      message: 'Document rejected successfully',
      document: {
        id: rejectedDocument.id,
        name: rejectedDocument.name,
        status: rejectedDocument.status,
        rejectedBy: rejectedDocument.rejectedByUser,
        rejectionReason: rejectedDocument.rejectionReason,
        rejectedAt: rejectedDocument.rejectedAt,
      },
    });
  } catch (error) {
    console.error('Error rejecting document:', error);
    return NextResponse.json(
      { error: 'Failed to reject document' },
      { status: 500 }
    );
  }
}
