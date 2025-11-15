import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

/**
 * Parse a PDF file and extract text content
 */
export async function parsePDF(filePath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
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
