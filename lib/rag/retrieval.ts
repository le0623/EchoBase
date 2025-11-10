import { prisma } from '../prisma';
import { generateEmbedding } from './embeddings';

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

/**
 * Retrieve relevant document chunks for a query using vector similarity
 */
export async function retrieveRelevantChunks(
  query: string,
  tenantId: string,
  topK: number = 5
): Promise<Array<{ content: string; documentId: string; documentName: string; chunkIndex: number; similarity: number }>> {
  try {
    // Generate embedding for the query
    const queryEmbedding = await generateEmbedding(query);

    // Get all document chunks for approved documents in this tenant
    const chunks = await prisma.documentChunk.findMany({
      where: {
        document: {
          tenantId,
          status: 'APPROVED',
        },
      },
      include: {
        document: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (chunks.length === 0) {
      return [];
    }

    // Calculate similarity scores for all chunks
    const chunksWithSimilarity = chunks.map(chunk => {
      const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
      return {
        content: chunk.content,
        documentId: chunk.documentId,
        documentName: chunk.document.name,
        chunkIndex: chunk.chunkIndex,
        similarity,
      };
    });

    // Sort by similarity (descending) and take top K
    const topChunks = chunksWithSimilarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);

    return topChunks.map(({ similarity, ...rest }) => ({ ...rest, similarity }));
  } catch (error) {
    console.error('Error retrieving relevant chunks:', error);
    throw error;
  }
}

/**
 * Build context string from retrieved chunks
 */
export function buildContextFromChunks(
  chunks: Array<{ content: string; documentId: string; documentName: string; chunkIndex: number }>
): string {
  return chunks
    .map((chunk, idx) => `[Chunk ${idx + 1}]\n${chunk.content}`)
    .join('\n\n---\n\n');
}

