import OpenAI from 'openai';
import { retrieveRelevantChunks, buildContextFromChunks } from './retrieval';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate an answer using RAG (Retrieval-Augmented Generation)
 * @param userId Optional: if provided, filters chunks by user's access tags
 */
export async function generateRAGAnswer(
  query: string,
  tenantId: string,
  conversationHistory: Array<{ role: 'USER' | 'ASSISTANT'; content: string }> = [],
  userId?: string
): Promise<string> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    // Retrieve relevant chunks (filtered by user tags if userId provided)
    const relevantChunks = await retrieveRelevantChunks(query, tenantId, 5, userId);

    if (relevantChunks.length === 0) {
      return 'I could not find any relevant information in the knowledge base to answer your question. Please make sure documents have been uploaded and approved.';
    }

    // Build context from chunks
    const context = buildContextFromChunks(relevantChunks);

    // Build conversation history for context
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are a helpful AI assistant that answers questions based on the provided document context.
        
IMPORTANT RULES:
- Answer questions ONLY using the information provided in the context below
- If the answer cannot be found in the context, clearly state that you don't have that information
- Be concise and accurate
- Cite which document/chunk the information comes from when relevant
- If asked about something not in the context, politely say you don't have that information

Context from knowledge base:
${context}`,
      },
      // Add conversation history (last 10 messages to avoid token limits)
      ...conversationHistory.slice(-10).map((msg) => ({
        role: (msg.role === 'USER' ? 'user' : 'assistant') as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user',
        content: query,
      },
    ];

    // Generate answer using GPT
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error generating RAG answer:', error);
    throw error;
  }
}


