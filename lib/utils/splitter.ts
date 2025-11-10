/**
 * Text splitting utilities for document chunking
 */

export interface Chunk {
  text: string;
  index: number;
  metadata?: Record<string, any>;
}

/**
 * Split text into chunks with overlap for better context retention
 * @param text - The text to split
 * @param chunkSize - Maximum size of each chunk (in characters)
 * @param overlap - Number of characters to overlap between chunks
 * @returns Array of text chunks
 */
export function splitText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
): Chunk[] {
  const chunks: Chunk[] = [];
  
  // Clean the text
  const cleanedText = text.replace(/\s+/g, ' ').trim();
  
  if (cleanedText.length <= chunkSize) {
    return [{ text: cleanedText, index: 0 }];
  }

  let startIndex = 0;
  let chunkIndex = 0;

  while (startIndex < cleanedText.length) {
    let endIndex = startIndex + chunkSize;

    // Try to break at sentence boundaries for better chunk quality
    if (endIndex < cleanedText.length) {
      // Look for sentence endings within the last 20% of the chunk
      const searchStart = Math.max(startIndex, endIndex - chunkSize * 0.2);
      const searchEnd = Math.min(endIndex + 100, cleanedText.length);
      const searchText = cleanedText.slice(searchStart, searchEnd);
      
      // Find the last sentence ending (., !, ?)
      const sentenceMatch = searchText.match(/[.!?]\s+/g);
      if (sentenceMatch && sentenceMatch.length > 0) {
        const lastMatch = sentenceMatch[sentenceMatch.length - 1];
        const sentenceEnd = searchText.lastIndexOf(lastMatch);
        if (sentenceEnd !== -1) {
          endIndex = searchStart + sentenceEnd + lastMatch.length;
        }
      }
    }

    const chunkText = cleanedText.slice(startIndex, endIndex).trim();
    
    if (chunkText.length > 0) {
      chunks.push({
        text: chunkText,
        index: chunkIndex,
        metadata: {
          startChar: startIndex,
          endChar: endIndex,
        },
      });
      chunkIndex++;
    }

    // Move start index forward, accounting for overlap
    startIndex = endIndex - overlap;
    
    // Prevent infinite loop
    if (startIndex >= endIndex) {
      startIndex = endIndex;
    }
  }

  return chunks;
}

/**
 * Split text by paragraphs first, then by size if needed
 */
export function splitTextByParagraphs(
  text: string,
  maxChunkSize: number = 1000,
  overlap: number = 200
): Chunk[] {
  // Split by double newlines (paragraphs)
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const chunks: Chunk[] = [];
  let chunkIndex = 0;
  let currentChunk = '';

  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    
    // If adding this paragraph would exceed max size, save current chunk
    if (currentChunk && (currentChunk.length + trimmedParagraph.length + 2) > maxChunkSize) {
      chunks.push({
        text: currentChunk.trim(),
        index: chunkIndex++,
      });
      currentChunk = trimmedParagraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + trimmedParagraph;
    }
  }

  // Add the last chunk
  if (currentChunk.trim()) {
    chunks.push({
      text: currentChunk.trim(),
      index: chunkIndex,
    });
  }

  // If chunks are still too large, split them further
  const finalChunks: Chunk[] = [];
  for (const chunk of chunks) {
    if (chunk.text.length > maxChunkSize) {
      const subChunks = splitText(chunk.text, maxChunkSize, overlap);
      subChunks.forEach(subChunk => {
        finalChunks.push({
          ...subChunk,
          index: finalChunks.length,
          metadata: {
            ...chunk.metadata,
            ...subChunk.metadata,
          },
        });
      });
    } else {
      finalChunks.push(chunk);
    }
  }

  return finalChunks;
}

