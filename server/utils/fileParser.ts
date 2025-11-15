import fs from 'fs';
import path from 'path';

/**
 * Parse a PDF file and extract text content using pdfjs-dist
 */
export async function parsePDF(filePath: string): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.js');
    const dataBuffer = new Uint8Array(fs.readFileSync(filePath));

    const loadingTask = pdfjsLib.getDocument({ data: dataBuffer });
    const pdfDocument = await loadingTask.promise;

    let fullText = '';

    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Parse file based on file type
 */
export async function parseFile(filePath: string, fileType: string): Promise<string> {
  try {
    // Handle PDF files
    if (fileType === 'application/pdf') {
      return await parsePDF(filePath);
    }

    // Handle text files (CSV, TXT, etc.)
    if (fileType.startsWith('text/') || fileType === 'application/csv') {
      return fs.readFileSync(filePath, 'utf-8');
    }

    // For now, other file types are not supported for text extraction
    // Images would require OCR, which we can add later
    throw new Error(`Unsupported file type for text extraction: ${fileType}`);
  } catch (error: any) {
    console.error('Error parsing file:', error);
    throw new Error(error.message || 'Failed to parse file');
  }
}

/**
 * Validate file exists and is readable
 */
export function validateFile(filePath: string): boolean {
  try {
    return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
  } catch (error) {
    return false;
  }
}
