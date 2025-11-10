/**
 * File loading utilities for document processing
 */
import { PDFParse } from 'pdf-parse';

/**
 * Extract text content from a file URL
 * Supports PDF, TXT, and other text-based formats
 */
export async function loadFileText(fileUrl: string, mimeType: string): Promise<string> {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // For text files, return as-is
    if (mimeType.startsWith('text/') || mimeType === 'application/json') {
      return await response.text();
    }

    // For PDF files, we'll need to parse them
    // For now, we'll use a simple approach - in production, use pdf-parse
    if (mimeType === 'application/pdf') {
      // Note: This is a simplified version. For production, install pdf-parse:
      // npm install pdf-parse
      // import pdf from 'pdf-parse';
      const arrayBuffer = await response.arrayBuffer();
      // For now, return a placeholder - you should use pdf-parse here
      throw new Error('PDF parsing requires pdf-parse package. Please install: npm install pdf-parse');
    }

    // For other file types, try to extract text
    // This is a fallback - you may want to add more specific parsers
    const arrayBuffer = await response.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(arrayBuffer);
    return text;
  } catch (error) {
    console.error('Error loading file text:', error);
    throw error;
  }
}

/**
 * Load PDF text using pdf-parse (if available)
 */
export async function loadPDFText(fileUrl: string): Promise<string> {
  try {
    // Dynamic import to avoid requiring pdf-parse if not installed
    const parser = new PDFParse({ url: fileUrl });
    const result = await parser.getText();
    await parser.destroy();

    return result.text;
  } catch (error) {
    console.error('Error loading PDF:', error);
    throw error;
  }
}
