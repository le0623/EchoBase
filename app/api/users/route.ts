import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { UserRole, UserStatus } from '@prisma/client';

// GET /api/users - Get all users in the tenant
export async function GET(request: NextRequest) {
  try {
    const { user, tenant } = await requireTenant();

    // Check if user has permission to view users (admin only for now)
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        tenantId: tenant.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profileImageUrl: true,
        status: true,
        role: true,
        lastActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user (invitation)
export async function POST(request: NextRequest) {
  try {
    const { user, tenant } = await requireTenant();

    // Check if user has permission to invite users
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, role = 'MEMBER' } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['ADMIN', 'MEMBER', 'VIEWER'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Check if there's already a pending invitation
    const existingInvitation = await prisma.userInvitation.findFirst({
      where: {
        email,
        tenantId: tenant.id,
        status: 'PENDING',
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Invitation already sent to this email' },
        { status: 400 }
      );
    }

    // Generate invitation token
    const token = generateInvitationToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    // Create invitation
    const invitation = await prisma.userInvitation.create({
      data: {
        email,
        role: role as UserRole,
        token,
        invitedBy: user.id,
        tenantId: tenant.id,
        expiresAt,
      },
    });

    // Send invitation email (this will be implemented in the invitation endpoint)
    return NextResponse.json({
      message: 'User invitation created successfully',
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error('Error creating user invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create user invitation' },
      { status: 500 }
    );
  }
}

function generateInvitationToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
