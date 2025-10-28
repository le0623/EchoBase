import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { sendInvitationEmail } from '@/lib/email';
import { protocol, rootDomain } from '@/lib/utils';

// POST /api/users/invite - Send invitation email
export async function POST(request: NextRequest) {
  try {
    const { user, tenant } = await requireTenant();

    // Get user's role in this tenant
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    // Check if user has permission to invite users
    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { invitationId } = body;

    if (!invitationId) {
      return NextResponse.json(
        { error: 'Invitation ID is required' },
        { status: 400 }
      );
    }

    // Get invitation details
    const invitation = await prisma.userInvitation.findFirst({
      where: {
        id: invitationId,
        tenantId: tenant.id,
        status: 'PENDING',
      },
      include: {
        tenant: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invitation not found or already processed' },
        { status: 404 }
      );
    }

    // Check if invitation is expired
    if (invitation.expiresAt < new Date()) {
      await prisma.userInvitation.update({
        where: { id: invitationId },
        data: { status: 'EXPIRED' },
      });

      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    // Get inviter details
    const inviter = await prisma.user.findUnique({
      where: { id: invitation.invitedBy },
      select: { name: true, email: true },
    });

    // Generate invitation URL
    const baseUrl = `${protocol}://${rootDomain}`;
    const invitationUrl = `${baseUrl}/accept-invitation?token=${invitation.token}`;

    // Send invitation email
    const emailSent = await sendInvitationEmail({
      to: invitation.email,
      tenantName: invitation.tenant.name,
      inviterName: inviter?.name || inviter?.email || 'Someone',
      role: invitation.role,
      invitationUrl,
    });

    if (!emailSent) {
      return NextResponse.json(
        { error: 'Failed to send invitation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Invitation email sent successfully',
    });
  } catch (error) {
    console.error('Error sending invitation email:', error);
    return NextResponse.json(
      { error: 'Failed to send invitation email' },
      { status: 500 }
    );
  }
}
