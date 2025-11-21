import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/widget/[widgetId]/conversation - Create a conversation for widget
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ widgetId: string }> }
) {
  try {
    const { widgetId } = await params;
    const body = await request.json();
    const { title } = body;

    // Get widget and tenant
    const widget = await prisma.widget.findUnique({
      where: { widgetId },
      include: { tenant: true },
    });

    if (!widget || !widget.enabled) {
      return NextResponse.json(
        { error: 'Widget not found or disabled' },
        { status: 404 }
      );
    }

    // Get or create a system user for widget conversations
    let systemUser = await prisma.user.findUnique({
      where: { email: `widget-${widget.tenantId}@system.local` },
    });

    if (!systemUser) {
      // Create system user for widget
      systemUser = await prisma.user.create({
        data: {
          email: `widget-${widget.tenantId}@system.local`,
          name: 'Widget User',
          status: 'ACTIVE',
        },
      });
    }

    // Create a conversation
    const conversation = await prisma.conversation.create({
      data: {
        title: title || 'Widget Chat',
        userId: systemUser.id,
        tenantId: widget.tenantId,
      },
    });

    return NextResponse.json(
      { conversation },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  } catch (error) {
    console.error('Error creating widget conversation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create conversation' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

