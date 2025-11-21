import { NextRequest, NextResponse } from 'next/server';
import { requireTenant } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';

// GET /api/widget - Get widget configuration
export async function GET(request: NextRequest) {
  try {
    const { tenant } = await requireTenant(request);

    // Get user's role
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        tenantId: tenant.id,
      },
    });

    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can access widget configuration' },
        { status: 403 }
      );
    }

    // Get or create widget
    let widget = await prisma.widget.findUnique({
      where: { tenantId: tenant.id },
    });

    if (!widget) {
      // Create default widget
      const widgetId = `widget_${randomBytes(8).toString('hex')}`;
      widget = await prisma.widget.create({
        data: {
          tenantId: tenant.id,
          widgetId,
          enabled: true,
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
          position: 'bottom-right',
          title: 'AI Assistant',
          welcomeMessage: 'Hello! How can I help you today?',
          placeholder: 'Type your message...',
          showBranding: true,
        },
      });
    }

    return NextResponse.json({ widget });
  } catch (error) {
    console.error('Error fetching widget:', error);
    return NextResponse.json(
      { error: 'Failed to fetch widget configuration' },
      { status: 500 }
    );
  }
}

// POST /api/widget - Create or update widget configuration
export async function POST(request: NextRequest) {
  try {
    const { tenant, user } = await requireTenant(request);

    // Get user's role
    const userMembership = await prisma.tenantMember.findFirst({
      where: {
        userId: user.id,
        tenantId: tenant.id,
      },
    });

    if (!userMembership || userMembership.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only administrators can update widget configuration' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      enabled,
      widgetId,
      primaryColor,
      secondaryColor,
      position,
      title,
      welcomeMessage,
      placeholder,
      showBranding,
      customCss,
    } = body;

    if (!widgetId) {
      return NextResponse.json(
        { error: 'Widget ID is required' },
        { status: 400 }
      );
    }

    // Validate position
    const validPositions = ['bottom-right', 'bottom-left', 'top-right', 'top-left'];
    if (position && !validPositions.includes(position)) {
      return NextResponse.json(
        { error: 'Invalid position value' },
        { status: 400 }
      );
    }

    // Check if widget exists
    const existingWidget = await prisma.widget.findUnique({
      where: { tenantId: tenant.id },
    });

    let widget;

    if (existingWidget) {
      // Update existing widget
      widget = await prisma.widget.update({
        where: { tenantId: tenant.id },
        data: {
          enabled: enabled ?? existingWidget.enabled,
          widgetId: widgetId || existingWidget.widgetId,
          primaryColor: primaryColor || existingWidget.primaryColor,
          secondaryColor: secondaryColor || existingWidget.secondaryColor,
          position: position || existingWidget.position,
          title: title || existingWidget.title,
          welcomeMessage: welcomeMessage || existingWidget.welcomeMessage,
          placeholder: placeholder || existingWidget.placeholder,
          showBranding: showBranding ?? existingWidget.showBranding,
          customCss: customCss !== undefined ? customCss : existingWidget.customCss,
        },
      });
    } else {
      // Create new widget
      widget = await prisma.widget.create({
        data: {
          tenantId: tenant.id,
          enabled: enabled ?? true,
          widgetId,
          primaryColor: primaryColor || '#3B82F6',
          secondaryColor: secondaryColor || '#1E40AF',
          position: position || 'bottom-right',
          title: title || 'AI Assistant',
          welcomeMessage: welcomeMessage || 'Hello! How can I help you today?',
          placeholder: placeholder || 'Type your message...',
          showBranding: showBranding ?? true,
          customCss: customCss || null,
        },
      });
    }

    return NextResponse.json({ widget });
  } catch (error) {
    console.error('Error saving widget:', error);
    return NextResponse.json(
      { error: 'Failed to save widget configuration' },
      { status: 500 }
    );
  }
}

