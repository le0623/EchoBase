import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateExpirationDate } from '@/lib/api-keys';

// PUT /api/api-keys/[id] - Update an API key
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
        { error: 'Insufficient permissions. Only admins and owners can manage API keys.' },
        { status: 403 }
      );
    }

    // Verify API key belongs to tenant
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, expirationDuration, isEnabled, dailyLimit, monthlyLimit } = body;

    const updateData: any = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json(
          { error: 'API key name cannot be empty' },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (expirationDuration !== undefined) {
      if (!['1month', '3months', '6months', '1year', 'forever'].includes(expirationDuration)) {
        return NextResponse.json(
          { error: 'Invalid expiration duration' },
          { status: 400 }
        );
      }
      updateData.expirationDate = calculateExpirationDate(expirationDuration as '1month' | '3months' | '6months' | '1year' | 'forever');
    }

    if (isEnabled !== undefined) {
      updateData.isEnabled = Boolean(isEnabled);
    }

    if (dailyLimit !== undefined) {
      updateData.dailyLimit = parseFloat(dailyLimit) || 0;
    }

    if (monthlyLimit !== undefined) {
      updateData.monthlyLimit = parseFloat(monthlyLimit) || 0;
    }

    const updatedKey = await prisma.apiKey.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      apiKey: {
        id: updatedKey.id,
        name: updatedKey.name,
        prefix: updatedKey.prefix,
        expirationDate: updatedKey.expirationDate,
        isEnabled: updatedKey.isEnabled,
        dailyLimit: updatedKey.dailyLimit,
        monthlyLimit: updatedKey.monthlyLimit,
        lastUsedAt: updatedKey.lastUsedAt,
        createdAt: updatedKey.createdAt,
      },
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}

// DELETE /api/api-keys/[id] - Delete an API key
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
        { error: 'Insufficient permissions. Only admins and owners can manage API keys.' },
        { status: 403 }
      );
    }

    // Verify API key belongs to tenant
    const apiKey = await prisma.apiKey.findFirst({
      where: {
        id,
        tenantId: tenant.id,
      },
    });

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not found' },
        { status: 404 }
      );
    }

    await prisma.apiKey.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
}

