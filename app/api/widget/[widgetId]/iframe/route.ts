import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/widget/[widgetId]/iframe - Serve widget as iframe-compatible HTML page
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
      return new NextResponse('Widget not found or disabled', { status: 404 });
    }

    // Get base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;

    // Generate iframe-compatible HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${widget.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      height: 100vh;
      overflow: hidden;
      background: #f9fafb;
    }
    #enduroshieldhub-widget-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    #enduroshieldhub-widget-header {
      background: ${widget.primaryColor};
      color: white;
      padding: 16px;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    #enduroshieldhub-widget-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      background: #f9fafb;
    }
    .message {
      margin-bottom: 12px;
    }
    .message.user {
      text-align: right;
    }
    .message.assistant {
      text-align: left;
    }
    .message-content {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 12px;
      max-width: 80%;
      font-size: 14px;
      line-height: 1.5;
    }
    .message.user .message-content {
      background: ${widget.primaryColor};
      color: white;
    }
    .message.assistant .message-content {
      background: #f3f4f6;
      color: #374151;
    }
    #enduroshieldhub-widget-input-area {
      padding: 16px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      gap: 8px;
      background: white;
      flex-shrink: 0;
    }
    #enduroshieldhub-widget-input {
      flex: 1;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
    }
    #enduroshieldhub-widget-input:focus {
      border-color: ${widget.primaryColor};
    }
    #enduroshieldhub-widget-send {
      padding: 10px 20px;
      background: ${widget.primaryColor};
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
    }
    #enduroshieldhub-widget-send:hover {
      opacity: 0.9;
    }
    #enduroshieldhub-widget-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .welcome-message {
      color: #6b7280;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .loading-message {
      color: #9ca3af;
      font-style: italic;
    }
    .error-message {
      color: #ef4444;
      font-size: 14px;
    }
    ${widget.customCss || ''}
  </style>
</head>
<body>
  <div id="enduroshieldhub-widget-container">
    <div id="enduroshieldhub-widget-header">
      <span>${widget.title}</span>
    </div>
    <div id="enduroshieldhub-widget-messages">
      <div class="welcome-message">${widget.welcomeMessage}</div>
    </div>
    <div id="enduroshieldhub-widget-input-area">
      <input 
        type="text" 
        id="enduroshieldhub-widget-input" 
        placeholder="${widget.placeholder}"
      />
      <button id="enduroshieldhub-widget-send">Send</button>
    </div>
  </div>

  <script>
    (function() {
      'use strict';
      
      const config = {
        widgetId: '${widget.widgetId}',
        apiUrl: '${baseUrl}/api/widget/${widget.widgetId}',
      };

      const messagesArea = document.getElementById('enduroshieldhub-widget-messages');
      const input = document.getElementById('enduroshieldhub-widget-input');
      const sendButton = document.getElementById('enduroshieldhub-widget-send');
      let conversationId = null;

      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }

      function addMessage(role, content, isError = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + role;
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content' + (isError ? ' error-message' : '');
        contentDiv.innerHTML = escapeHtml(content);
        messageDiv.appendChild(contentDiv);
        messagesArea.appendChild(messageDiv);
        messagesArea.scrollTop = messagesArea.scrollHeight;
        return messageDiv;
      }

      async function sendMessage() {
        const message = input.value.trim();
        if (!message) return;

        input.value = '';
        sendButton.disabled = true;

        // Add user message
        addMessage('user', message);

        // Show loading
        const loadingMsg = addMessage('assistant', 'Thinking...', false);
        loadingMsg.querySelector('.message-content').classList.add('loading-message');

        try {
          // Create conversation if needed
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

          // Remove loading message
          loadingMsg.remove();

          // Add assistant response
          addMessage('assistant', data.assistantMessage.content);
        } catch (error) {
          loadingMsg.remove();
          const errorText = error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.';
          addMessage('assistant', errorText, true);
          console.error('Widget error:', error);
        } finally {
          sendButton.disabled = false;
        }
      }

      sendButton.addEventListener('click', sendMessage);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });

      // Post message to parent window when widget is ready (for iframe communication)
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'enduroshieldhub-widget-ready', widgetId: config.widgetId }, '*');
      }
    })();
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Security-Policy': "frame-ancestors *;",
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error serving widget iframe:', error);
    return new NextResponse('Error loading widget', { status: 500 });
  }
}

