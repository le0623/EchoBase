import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PATCH /api/users/invitations/[invitationId] - Update invitation status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ invitationId: string }> }
) {
  try {
    const { invitationId } = await params;
    const { user, tenant } = await requireTenant(request);

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    // Check if user has permission to manage invitations
    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { status } = body;

    // Validate status
    if (!status || !['PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check if invitation exists and belongs to tenant
    const invitation = await prisma.userInvitation.findFirst({
      where: {
        id: invitationId,
        tenantId: tenant.id,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    // Update invitation status
    const updatedInvitation = await prisma.userInvitation.update({
      where: { id: invitationId },
      data: { status },
    });

    return NextResponse.json({
      message: 'Invitation updated successfully',
      invitation: {
        id: updatedInvitation.id,
        email: updatedInvitation.email,
        role: updatedInvitation.role,
        status: updatedInvitation.status,
      },
    });
  } catch (error) {
    console.error('Error updating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to update invitation' },
      { status: 500 }
    );
  }
}
