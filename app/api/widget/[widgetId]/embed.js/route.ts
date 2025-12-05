import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/widget/[widgetId]/embed.js - Serve embeddable widget script
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ widgetId: string }> }
) {
  try {
    const { widgetId } = await params;

    // Get widget configuration
    const widget = await prisma.widget.findUnique({
      where: { widgetId },
      include: { tenant: true },
    });

    if (!widget || !widget.enabled) {
      return new NextResponse('// Widget not found or disabled', { status: 404 });
    }

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
    
    // Generate the widget JavaScript code
    const widgetScript = `
(function() {
  'use strict';
  
  // Widget configuration
  const config = {
    widgetId: '${widget.widgetId}',
    apiUrl: '${baseUrl}/api/widget/${widget.widgetId}',
    iframeUrl: '${baseUrl}/api/widget/${widget.widgetId}/iframe',
    primaryColor: '${widget.primaryColor}',
    secondaryColor: '${widget.secondaryColor}',
    position: '${widget.position}',
    title: ${JSON.stringify(widget.title)},
    welcomeMessage: ${JSON.stringify(widget.welcomeMessage)},
    placeholder: ${JSON.stringify(widget.placeholder)},
    showBranding: ${widget.showBranding},
    customCss: ${widget.customCss ? JSON.stringify(widget.customCss) : 'null'},
    useIframe: false // Can be set to true to use iframe mode
  };

  // Remove existing widget if present
  const existingContainer = document.getElementById('echobase-widget-container');
  if (existingContainer) {
    existingContainer.remove();
  }
  
  // Prevent multiple initializations (check after cleanup)
  if (window.EchoBaseWidget && window.EchoBaseWidget.initialized) {
    // Reset if already initialized to allow re-initialization
    window.EchoBaseWidget = { initialized: false };
  }

  // Create widget container
  function createWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'echobase-widget-container';
    widgetContainer.style.cssText = \`
      position: fixed;
      \${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      \${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    \`;

    // Widget button (toggle)
    const widgetButton = document.createElement('div');
    widgetButton.id = 'echobase-widget-button';
    widgetButton.style.cssText = \`
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: \${config.primaryColor};
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: transform 0.2s;
    \`;
    widgetButton.innerHTML = '<svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>';
    widgetButton.onmouseover = () => widgetButton.style.transform = 'scale(1.1)';
    widgetButton.onmouseout = () => widgetButton.style.transform = 'scale(1)';

    // Widget window
    const widgetWindow = document.createElement('div');
    widgetWindow.id = 'echobase-widget-window';
    widgetWindow.style.cssText = \`
      position: absolute;
      \${config.position.includes('right') ? 'right: 0;' : 'left: 0;'}
      \${config.position.includes('bottom') ? 'bottom: 80px;' : 'top: 80px;'}
      width: 380px;
      height: 600px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      display: none;
      flex-direction: column;
      overflow: hidden;
    \`;

    // Header
    const header = document.createElement('div');
    header.style.cssText = \`
      background: \${config.primaryColor};
      color: white;
      padding: 16px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
    \`;
    header.innerHTML = \`
      <span>\${config.title}</span>
      <button id="echobase-widget-close" style="background: none; border: none; color: white; cursor: pointer; font-size: 20px;">&times;</button>
    \`;

    // Messages area
    const messagesArea = document.createElement('div');
    messagesArea.id = 'echobase-widget-messages';
    messagesArea.style.cssText = \`
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f9fafb;
    \`;

    // Welcome message
    const welcomeMsg = document.createElement('div');
    welcomeMsg.style.cssText = \`
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 16px;
    \`;
    welcomeMsg.textContent = config.welcomeMessage;
    messagesArea.appendChild(welcomeMsg);

    // Input area
    const inputArea = document.createElement('div');
    inputArea.style.cssText = \`
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
    \`;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = config.placeholder;
    input.style.cssText = \`
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    \`;
    input.onfocus = () => input.style.borderColor = config.primaryColor;
    input.onblur = () => input.style.borderColor = '#d1d5db';
    input.onkeypress = (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        sendMessage(input.value.trim());
        input.value = '';
      }
    };

    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send';
    sendButton.style.cssText = \`
      padding: 10px 20px;
      background: \${config.primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
    \`;
    sendButton.onclick = () => {
      if (input.value.trim()) {
        sendMessage(input.value.trim());
        input.value = '';
      }
    };

    inputArea.appendChild(input);
    inputArea.appendChild(sendButton);

    widgetWindow.appendChild(header);
    widgetWindow.appendChild(messagesArea);
    widgetWindow.appendChild(inputArea);
    widgetContainer.appendChild(widgetButton);
    widgetContainer.appendChild(widgetWindow);
    document.body.appendChild(widgetContainer);

    // Toggle widget
    let isOpen = false;
    widgetButton.onclick = () => {
      isOpen = !isOpen;
      widgetWindow.style.display = isOpen ? 'flex' : 'none';
    };

    document.getElementById('echobase-widget-close').onclick = () => {
      isOpen = false;
      widgetWindow.style.display = 'none';
    };

    // Send message function
    async function sendMessage(message) {
      // Add user message
      const userMsg = document.createElement('div');
      userMsg.style.cssText = \`
        margin-bottom: 12px;
        text-align: right;
      \`;
      userMsg.innerHTML = \`
        <div style="display: inline-block; background: \${config.primaryColor}; color: white; padding: 8px 12px; border-radius: 12px; max-width: 80%; font-size: 14px;">
          \${escapeHtml(message)}
        </div>
      \`;
      messagesArea.appendChild(userMsg);
      messagesArea.scrollTop = messagesArea.scrollHeight;

      // Show loading
      const loadingMsg = document.createElement('div');
      loadingMsg.id = 'echobase-loading';
      loadingMsg.style.cssText = \`
        margin-bottom: 12px;
        text-align: left;
      \`;
      loadingMsg.innerHTML = \`
        <div style="display: inline-block; background: #e5e7eb; color: #374151; padding: 8px 12px; border-radius: 12px; font-size: 14px;">
          Thinking...
        </div>
      \`;
      messagesArea.appendChild(loadingMsg);
      messagesArea.scrollTop = messagesArea.scrollHeight;

      try {
        // Create conversation if needed
        let conversationId = window.echobaseConversationId;
        if (!conversationId) {
          const convResponse = await fetch(config.apiUrl + '/conversation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Widget Chat' })
          });

          if (!convResponse.ok) {
            const errorData = await convResponse.json().catch(() => ({ error: 'Failed to create conversation' }));
            throw new Error(errorData.error || 'Failed to create conversation');
          }

          const convData = await convResponse.json();
          if (!convData.conversation || !convData.conversation.id) {
            throw new Error('Invalid conversation response');
          }
          conversationId = convData.conversation.id;
          window.echobaseConversationId = conversationId;
        }

        // Send message
        const response = await fetch(config.apiUrl + '/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            content: message
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Failed to send message' }));
          throw new Error(errorData.error || \`HTTP \${response.status}: Failed to send message\`);
        }

        const data = await response.json();
        
        if (!data.assistantMessage || !data.assistantMessage.content) {
          throw new Error('Invalid response format');
        }

        loadingMsg.remove();

        // Add assistant response
        const assistantMsg = document.createElement('div');
        assistantMsg.style.cssText = \`
          margin-bottom: 12px;
          text-align: left;
        \`;
        assistantMsg.innerHTML = \`
          <div style="display: inline-block; background: #f3f4f6; color: #374151; padding: 8px 12px; border-radius: 12px; max-width: 80%; font-size: 14px; line-height: 1.5;">
            \${escapeHtml(data.assistantMessage.content)}
          </div>
        \`;
        messagesArea.appendChild(assistantMsg);
        messagesArea.scrollTop = messagesArea.scrollHeight;
      } catch (error) {
        loadingMsg.remove();
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText = \`
          margin-bottom: 12px;
          text-align: left;
          color: #ef4444;
          font-size: 14px;
        \`;
        // Show more detailed error message for debugging
        const errorText = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.';
        errorMsg.textContent = errorText;
        messagesArea.appendChild(errorMsg);
        console.error('Widget error:', error);
      }
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    // Apply custom CSS if provided
    if (config.customCss) {
      const style = document.createElement('style');
      style.textContent = config.customCss;
      document.head.appendChild(style);
    }

    // Show branding if enabled
    if (config.showBranding) {
      const branding = document.createElement('div');
      branding.style.cssText = \`
        text-align: center;
        padding: 8px;
        font-size: 10px;
        color: #9ca3af;
        border-top: 1px solid #e5e7eb;
      \`;
      branding.textContent = 'Powered by EchoBase';
      widgetWindow.appendChild(branding);
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }

  window.EchoBaseWidget = { initialized: true };
})();
`;

    return new NextResponse(widgetScript, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error serving widget script:', error);
    return new NextResponse('// Error loading widget', { status: 500 });
  }
}

