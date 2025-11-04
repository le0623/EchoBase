import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { uploadToS3, validateFileType, getFileSizeLimit } from '@/lib/s3';

export async function POST(request: NextRequest) {
  try {
    const { user, tenant } = await requireTenant(request);

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    // Check if user has permission to upload documents
    if (!userMembership || (userMembership.role !== 'ADMIN' && userMembership.role !== 'MEMBER')) {
      return NextResponse.json(
        { error: 'Insufficient permissions to upload documents' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Document name is required' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!validateFileType(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed. Please upload PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT, CSV, or image files.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > getFileSizeLimit()) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const uploadResult = await uploadToS3({
      file: fileBuffer,
      fileName: file.name,
      mimeType: file.type,
      tenantId: tenant.id,
      userId: user.id,
    });

    // Parse tags
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

    // Save document to database
    const document = await prisma.document.create({
      data: {
        name: name.trim(),
        originalName: file.name,
        description: description?.trim() || null,
        tags: tagsArray,
        fileUrl: uploadResult.url,
        fileKey: uploadResult.key,
        fileSize: uploadResult.size,
        mimeType: uploadResult.mimeType,
        submittedBy: user.id,
        tenantId: tenant.id,
      },
      include: {
        submittedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        name: document.name,
        originalName: document.originalName,
        description: document.description,
        tags: document.tags,
        fileUrl: document.fileUrl,
        fileSize: document.fileSize,
        mimeType: document.mimeType,
        status: document.status,
        submittedBy: document.submittedByUser,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json(
      { error: 'Failed to upload document' },
      { status: 500 }
    );
  }
}
