/* eslint-disable @typescript-eslint/no-unsafe-call */
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { openai } from '@ai-sdk/openai';
import fs from 'fs';
import path from 'path';
import { tmpdir } from 'os';
import { v4 as uuidv4 } from 'uuid';
import { mkdir } from 'fs/promises';
import { generateText } from 'ai';

/**
 * Downloads a file from a URL and saves it to a temporary location
 */
export async function downloadFile(fileUrl: string): Promise<string> {
  try {
    console.log(`Downloading file from: ${fileUrl}`);
    
    // Detect blob URLs, which cannot be processed server-side
    if (fileUrl.startsWith('blob:')) {
      throw new Error('Blob URLs cannot be processed server-side. Upload to cloud storage first.');
    }
    
    // Create a temporary directory for storing downloaded files
    const tempDirPath = path.join(tmpdir(), `resume-downloads-${uuidv4()}`);
    await mkdir(tempDirPath, { recursive: true });
    console.log(`Created temporary directory: ${tempDirPath}`);
    
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Extract proper file extension from URL or content type
    let ext = 'pdf'; // Default to pdf
    
    // Try to get extension from Content-Type header
    const contentType = response.headers.get('content-type');
    if (contentType) {
      if (contentType.includes('pdf')) {
        ext = 'pdf';
      } else if (contentType.includes('word') || contentType.includes('docx')) {
        ext = 'docx';
      } else if (contentType.includes('msword')) {
        ext = 'doc';
      }
    } else {
      // Fall back to URL parsing if no content-type
      const urlExt = fileUrl.split('/').pop()?.split('?')[0]?.split('.').pop()?.toLowerCase();
      if (urlExt && ['pdf', 'docx', 'doc'].includes(urlExt)) {
        ext = urlExt;
      }
    }
    
    // Create a unique filename with proper extension
    const tempFilePath = path.join(tempDirPath, `resume-${uuidv4()}.${ext}`);
    
    // Write the file with detailed error handling
    try {
      fs.writeFileSync(tempFilePath, buffer);
      console.log(`File written to: ${tempFilePath}`);
    } catch (err) {
      console.error('Error writing file:', err);
      if (err instanceof Error) {
        throw new Error(`Failed to write temporary file: ${err.message}`);
      } else {
        throw new Error('Failed to write temporary file: Unknown error');
      }
    }
    
    return tempFilePath;
  } catch (error) {
    console.error('Error downloading file:', error);
    throw error;
  }
}

/**
 * Extracts text from a resume file
 */
export async function extractTextFromResume(fileUrl: string): Promise<string> {
  try {
    // Handle blob URLs
    if (fileUrl.startsWith('blob:')) {
      console.log('Detected blob URL in resume. These cannot be accessed server-side.');
      return "Resume was uploaded as a blob URL which cannot be processed server-side. To analyze your resume, please upload it using the file uploader which stores files on the server.";
    }
    
    // For uploadthing URLs, make sure they're properly formatted
    if (fileUrl.includes('utfs.io')) {
      console.log('Detected UploadThing URL. Making sure it uses https://');
      // Ensure the URL starts with https://
      if (!fileUrl.startsWith('http')) {
        fileUrl = `https://${fileUrl}`;
      }
    }
    
    // Download the file
    const filePath = await downloadFile(fileUrl);
    
    try {
      let text = '';
      
      // Extract text based on file type
      const ext = path.extname(filePath).toLowerCase().replace('.', '');
      if (ext === 'pdf') {
        // Load PDF and extract text
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();
        text = docs.map(doc => doc.pageContent).join('\n');
      } else if (ext === 'docx') {
        // Load DOCX and extract text
        const loader = new DocxLoader(filePath);
        const docs = await loader.load();
        text = docs.map(doc => doc.pageContent).join('\n');
      } else if (ext === 'doc') {
        // For DOC files, we'd need a different approach
        return "DOC format is not fully supported. Please convert your resume to PDF or DOCX for better results.";
      }
      
      // If no text was extracted, return a helpful message
      if (!text || text.trim().length === 0) {
        return "We couldn't extract any text from your resume. Please make sure your resume file is not image-based or scanned, and try uploading a text-based PDF or DOCX file.";
      }
      
      // Clean and structure the text using OpenAI
      return await structureResumeText(text);
    } finally {
      // Clean up the temporary file
      try {
        fs.unlinkSync(filePath);
        // Try to remove the parent directory as well
        const dirPath = path.dirname(filePath);
        if (fs.existsSync(dirPath)) {
          fs.rmdirSync(dirPath, { recursive: true });
        }
      } catch (error) {
        console.error('Error cleaning up temporary files:', error);
      }
    }
  } catch (error) {
    console.error('Error extracting text from resume:', error);
    return `Failed to extract text from resume: ${error instanceof Error ? error.message : 'Unknown error'}. Please try uploading your resume in PDF or DOCX format.`;
  }
}

/**
 * Uses OpenAI to clean and structure raw resume text
 */
async function structureResumeText(rawText: string): Promise<string> {
  const prompt = `I have extracted text from a resume, but it's not well structured. 
Please help organize this content into a clean, well-formatted text that preserves all the important information.

Raw extracted text:
${rawText}

Please return a cleaned version that organizes sections like personal information, education, experience, skills, etc.`;

  try {
    // Use generateText instead of model.complete
    const result = await generateText({
      model: openai('gpt-4o'),
      prompt,
    });

    return result.text;
  } catch (error) {
    console.error('Error structuring resume text with OpenAI:', error);
    // Return the raw text as a fallback
    return rawText;
  }
}

export async function analyzeResume(fileUrl: string): Promise<string> {
  console.log(`Starting resume analysis of: ${fileUrl}`);
  
  try {
    // Skip analyzing blob URLs
    if (fileUrl.startsWith('blob:')) {
      return "Unable to analyze resume from blob URL. Please upload the resume using the file uploader which stores files on the server.";
    }
    
    // For uploadthing URLs, make sure they're properly formatted
    if (fileUrl.includes('utfs.io')) {
      console.log('Detected UploadThing URL. Making sure it uses https://');
      // Ensure the URL starts with https://
      if (!fileUrl.startsWith('http')) {
        fileUrl = `https://${fileUrl}`;
      }
    }
    
    // Download the file
    const filePath = await downloadFile(fileUrl);
    
    try {
      let text = '';
      
      // Extract text based on file type
      const ext = path.extname(filePath).toLowerCase().replace('.', '');
      if (ext === 'pdf') {
        // Load PDF and extract text
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();
        text = docs.map(doc => doc.pageContent).join('\n');
      } else if (ext === 'docx') {
        // Load DOCX and extract text
        const loader = new DocxLoader(filePath);
        const docs = await loader.load();
        text = docs.map(doc => doc.pageContent).join('\n');
      } else if (ext === 'doc') {
        // For DOC files, we'd need a different approach
        return "DOC format is not fully supported. Please convert to PDF or DOCX for better results.";
      }
      
      // If no text was extracted, return a helpful message
      if (!text || text.trim().length === 0) {
        return "We couldn't extract any text from your resume. Please make sure your resume file is not image-based or scanned, and try uploading a text-based PDF or DOCX file.";
      }
      
      // Clean and structure the text using OpenAI
      return await structureResumeText(text);
    } finally {
      // Clean up the temporary file
      try {
        fs.unlinkSync(filePath);
        // Try to remove the parent directory as well
        const dirPath = path.dirname(filePath);
        if (fs.existsSync(dirPath)) {
          fs.rmdirSync(dirPath, { recursive: true });
        }
      } catch (error) {
        console.error('Error cleaning up temporary files:', error);
      }
    }
  } catch (error) {
    console.error('Error analyzing resume:', error);
    return `Failed to analyze resume: ${error instanceof Error ? error.message : 'Unknown error'}. Please try uploading your resume in PDF or DOCX format.`;
  }
} 