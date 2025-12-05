import { NextRequest, NextResponse } from 'next/server';

// GET /api/sdk/echobase-sdk.js - Serve JavaScript SDK for AI-powered search
export async function GET(request: NextRequest) {
  const sdkCode = `
(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.EchoBase = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  /**
   * EchoBase JavaScript SDK
   * AI-powered search integration for EchoBase
   */
  class EchoBaseSDK {
    constructor(options) {
      if (!options || !options.apiKey) {
        throw new Error('API key is required');
      }
      if (!options.subdomain) {
        throw new Error('Subdomain is required');
      }

      this.apiKey = options.apiKey;
      this.subdomain = options.subdomain;
      this.baseUrl = options.baseUrl || \`https://\${options.subdomain}.echobase.com\`;
      this.conversationHistory = options.conversationHistory || [];
    }

    /**
     * Perform AI-powered search query
     * @param {string} query - The search query
     * @param {Object} options - Additional options
     * @returns {Promise<Object>} Response with answer, query, and timestamp
     */
    async search(query, options = {}) {
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        throw new Error('Query is required and must be a non-empty string');
      }

      const conversationHistory = options.conversationHistory || this.conversationHistory;
      
      try {
        const response = await fetch(\`\${this.baseUrl}/api/query\`, {
          method: 'POST',
          headers: {
            'Authorization': \`Bearer \${this.apiKey}\`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: query.trim(),
            conversationHistory: conversationHistory.map(msg => ({
              role: msg.role === 'USER' || msg.role === 'user' ? 'user' : 'assistant',
              content: msg.content,
            })),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
          throw new Error(errorData.error || \`HTTP \${response.status}: Request failed\`);
        }

        const data = await response.json();

        // Update conversation history
        this.conversationHistory.push(
          { role: 'USER', content: query.trim() },
          { role: 'ASSISTANT', content: data.answer }
        );

        return {
          answer: data.answer,
          query: data.query,
          timestamp: data.timestamp,
        };
      } catch (error) {
        throw new Error(\`EchoBase SDK Error: \${error.message}\`);
      }
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
      this.conversationHistory = [];
    }

    /**
     * Get current conversation history
     * @returns {Array} Conversation history
     */
    getHistory() {
      return [...this.conversationHistory];
    }

    /**
     * Set conversation history
     * @param {Array} history - Conversation history array
     */
    setHistory(history) {
      if (!Array.isArray(history)) {
        throw new Error('History must be an array');
      }
      this.conversationHistory = history;
    }

    /**
     * Add message to conversation history
     * @param {string} role - 'USER' or 'ASSISTANT'
     * @param {string} content - Message content
     */
    addToHistory(role, content) {
      if (role !== 'USER' && role !== 'ASSISTANT') {
        throw new Error('Role must be USER or ASSISTANT');
      }
      this.conversationHistory.push({ role, content });
    }
  }

  return EchoBaseSDK;
}));
`;

  return new NextResponse(sdkCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

