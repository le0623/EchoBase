import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getDocumentAccessWhereClause } from '@/lib/tags';

// GET /api/documents - Get all documents for the tenant
export async function GET(request: NextRequest) {
  try {
    const { user, tenant } = await requireTenant(request);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Get base where clause with tag-based access control
    const accessWhere = await getDocumentAccessWhereClause(user.id, tenant.id);

    // Build where clause combining access control with filters
    const whereConditions: any[] = [accessWhere];

    if (status && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      whereConditions.push({ status });
    }

    if (search) {
      // Add search filters
      whereConditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { submittedByUser: { name: { contains: search, mode: 'insensitive' } } },
          { submittedByUser: { email: { contains: search, mode: 'insensitive' } } },
        ],
      });
    }

    // Combine all conditions with AND (if multiple conditions)
    const where = whereConditions.length === 1 ? whereConditions[0] : { AND: whereConditions };

    // Get documents with pagination
    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
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
          accessTags: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.document.count({ where }),
    ]);

    // Format response
    const formattedDocuments = documents.map(doc => ({
      id: doc.id,
      name: doc.name,
      originalName: doc.originalName,
      description: doc.description,
      accessTags: doc.accessTags.map(tag => ({
        id: tag.id,
        name: tag.name,
      })),
      fileUrl: doc.fileUrl,
      fileKey: doc.fileKey,
      fileSize: doc.fileSize,
      mimeType: doc.mimeType,
      version: doc.version,
      status: doc.status,
      submittedBy: doc.submittedByUser,
      approvedBy: doc.approvedByUser,
      rejectedBy: doc.rejectedByUser,
      rejectionReason: doc.rejectionReason,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      approvedAt: doc.approvedAt,
      rejectedAt: doc.rejectedAt,
    }));

    return NextResponse.json({
      documents: formattedDocuments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}
