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

    // Check if user has permission to upload documents (Only Admin can upload)
    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions to upload documents. Only admins can upload.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const accessTagIds = formData.get('accessTagIds') as string; // Access control tags (comma-separated IDs)

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

    // Parse access tag IDs
    const accessTagIdsArray = accessTagIds 
      ? accessTagIds.split(',').map(id => id.trim()).filter(id => id.length > 0)
      : [];

    // Validate access tags if provided
    if (accessTagIdsArray.length > 0) {
      const validTags = await prisma.tag.findMany({
        where: {
          id: { in: accessTagIdsArray },
          tenantId: tenant.id,
        },
      });

      if (validTags.length !== accessTagIdsArray.length) {
        return NextResponse.json(
          { error: 'One or more access tags not found or do not belong to this tenant' },
          { status: 400 }
        );
      }
    }

    // Save document to database
    const document = await prisma.document.create({
      data: {
        name: name.trim(),
        originalName: file.name,
        description: description?.trim() || null,
        fileUrl: uploadResult.url,
        fileKey: uploadResult.key,
        fileSize: uploadResult.size,
        mimeType: uploadResult.mimeType,
        submittedBy: user.id,
        tenantId: tenant.id,
        accessTags: {
          connect: accessTagIdsArray.map(tagId => ({ id: tagId })),
        },
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
