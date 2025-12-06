/**
 * EnduroShield Hub JavaScript SDK
 * AI-powered search integration for EnduroShield Hub
 */

export interface EnduroShieldHubOptions {
  apiKey: string;
  subdomain: string;
  baseUrl?: string;
  conversationHistory?: Array<{ role: 'USER' | 'ASSISTANT'; content: string }>;
}

export interface SearchOptions {
  conversationHistory?: Array<{ role: 'USER' | 'ASSISTANT'; content: string }>;
}

export interface SearchResponse {
  answer: string;
  query: string;
  timestamp: string;
}

export interface ConversationMessage {
  role: 'USER' | 'ASSISTANT';
  content: string;
}

/**
 * EnduroShield Hub SDK Class
 */
export class EnduroShieldHubSDK {
  private apiKey: string;
  private subdomain: string;
  private baseUrl: string;
  private conversationHistory: ConversationMessage[];

  constructor(options: EnduroShieldHubOptions) {
    if (!options || !options.apiKey) {
      throw new Error('API key is required');
    }
    if (!options.subdomain) {
      throw new Error('Subdomain is required');
    }

    this.apiKey = options.apiKey;
    this.subdomain = options.subdomain;
    this.baseUrl = options.baseUrl || `https://${options.subdomain}.enduroshieldhub.com`;
    this.conversationHistory = options.conversationHistory || [];
  }

  /**
   * Perform AI-powered search query
   * @param query - The search query
   * @param options - Additional options
   * @returns Response with answer, query, and timestamp
   */
  async search(query: string, options: SearchOptions = {}): Promise<SearchResponse> {
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      throw new Error('Query is required and must be a non-empty string');
    }

    const conversationHistory = options.conversationHistory || this.conversationHistory;

    try {
      const response = await fetch(`${this.baseUrl}/api/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role === 'USER' ? 'user' : 'assistant',
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || `HTTP ${response.status}: Request failed`);
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
      throw new Error(`EnduroShield Hub SDK Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get current conversation history
   * @returns Conversation history
   */
  getHistory(): ConversationMessage[] {
    return [...this.conversationHistory];
  }

  /**
   * Set conversation history
   * @param history - Conversation history array
   */
  setHistory(history: ConversationMessage[]): void {
    if (!Array.isArray(history)) {
      throw new Error('History must be an array');
    }
    this.conversationHistory = history;
  }

  /**
   * Add message to conversation history
   * @param role - 'USER' or 'ASSISTANT'
   * @param content - Message content
   */
  addToHistory(role: 'USER' | 'ASSISTANT', content: string): void {
    if (role !== 'USER' && role !== 'ASSISTANT') {
      throw new Error('Role must be USER or ASSISTANT');
    }
    this.conversationHistory.push({ role, content });
  }
}

// Default export
export default EnduroShieldHubSDK;

// Named exports
export { EnduroShieldHubSDK as EnduroShieldHub };

