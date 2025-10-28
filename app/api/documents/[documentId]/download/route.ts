import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSignedDownloadUrl } from '@/lib/s3';

// GET /api/documents/[documentId]/download - Get download URL for a document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params;
    const { user, tenant } = await requireTenant();

    // Get document
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

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    // Check permissions - users can download their own documents or admins can download any document
    if (document.submittedBy !== user.id && (!userMembership || userMembership.role !== 'ADMIN')) {
      return NextResponse.json(
        { error: 'Insufficient permissions to download this document' },
        { status: 403 }
      );
    }

    // Generate signed download URL (valid for 1 hour)
    const downloadUrl = await getSignedDownloadUrl(document.fileKey, 3600);

    return NextResponse.json({
      downloadUrl,
      fileName: document.originalName,
      fileSize: document.fileSize,
      mimeType: document.mimeType,
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate download URL' },
      { status: 500 }
    );
  }
}
