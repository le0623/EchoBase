import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// POST /api/invitations/accept - Accept invitation and create user account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, name, password } = body;

    if (!token || !name || !password) {
      return NextResponse.json(
        { error: 'Token, name, and password are required' },
        { status: 400 }
      );
    }

    // Find invitation by token
    const invitation = await prisma.userInvitation.findUnique({
      where: { token },
      include: {
        tenant: true,
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 400 }
      );
    }

    // Check if invitation is still pending
    if (invitation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Invitation has already been used or expired' },
        { status: 400 }
      );
    }

    // Check if invitation is expired
    if (invitation.expiresAt < new Date()) {
      await prisma.userInvitation.update({
        where: { id: invitation.id },
        data: { status: 'EXPIRED' },
      });

      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: invitation.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User account already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user account
    const newUser = await prisma.user.create({
      data: {
        email: invitation.email,
        name,
        password: hashedPassword,
        status: 'ACTIVE',
        invitationId: invitation.id,
        emailVerified: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
      },
    });

    // Create tenant membership
    await prisma.tenantMember.create({
      data: {
        userId: newUser.id,
        tenantId: invitation.tenantId,
        role: invitation.role,
        isOwner: false,
      },
    });

    // Update invitation status
    await prisma.userInvitation.update({
      where: { id: invitation.id },
      data: { status: 'ACCEPTED' },
    });

    return NextResponse.json({
      message: 'Account created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
