/**
 * File loading utilities for document processing
 */
import https from "https";
import http from "http";
import { URL } from "url";

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

    // For PDF files, use loadPDFText
    if (mimeType === 'application/pdf') {
      return await loadPDFText(fileUrl);
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
 * Load PDF text using pdf2json
 * pdf2json is serverless-friendly and doesn't require browser APIs
 */
export async function loadPDFText(fileUrl: string): Promise<string> {
  // Parse the URL to determine protocol and get hostname/path
  const url = new URL(fileUrl);
  const isHttps = url.protocol === 'https:';
  const httpModule = isHttps ? https : http;

  // Dynamically import pdf2json
  const pdf2jsonModule = await import('pdf2json');
  const PDFParser = pdf2jsonModule.default || pdf2jsonModule;

  return new Promise<string>((resolve, reject) => {
    try {
      // Create a new PDFParser instance for this request
      const pdfParser = new (PDFParser as any)(null, true);

      // Set up error handler
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        const errorMsg = errData?.parserError || errData?.message || 'Unknown PDF parsing error';
        reject(new Error(`PDF parsing error: ${errorMsg}`));
      });

      // Set up success handler
      pdfParser.on("pdfParser_dataReady", () => {
        try {
          const parsedText = pdfParser.getRawTextContent() || "";
          if (parsedText === "") {
            reject(new Error("Failed to parse PDF: No text content extracted"));
          } else {
            resolve(parsedText);
          }
        } catch (error) {
          reject(new Error(`Error extracting text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      });

      // Create the HTTP/HTTPS request options
      const options = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: 'GET',
        headers: {
          'User-Agent': 'EchoBase-PDF-Parser',
        },
      };

      // Make the request and pipe the response to the PDF parser
      const req = httpModule.request(options, (res) => {
        // Check if response is successful
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Handle redirects
          return loadPDFText(res.headers.location).then(resolve).catch(reject);
        }

        if (res.statusCode && (res.statusCode < 200 || res.statusCode >= 300)) {
          return reject(new Error(`Failed to fetch PDF: HTTP ${res.statusCode}`));
        }

        // Pipe the response stream to the PDF parser
        res.pipe(pdfParser.createParserStream());
      });

      // Handle request errors
      req.on('error', (error) => {
        reject(new Error(`Failed to fetch PDF: ${error.message}`));
      });

      // End the request
      req.end();
    } catch (error) {
      reject(new Error(`Error loading PDF: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}
