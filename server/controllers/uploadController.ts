import { Request, Response } from 'express';
import Upload from '../models/Upload.js';
import ExtractedData from '../models/ExtractedData.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { parseFile } from '../utils/fileParser.js';
import { extractSustainabilityData, generateAnalysisReport } from '../services/haikuAnalysisService.js';
import mongoose from 'mongoose';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-powerpoint',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and PowerPoint files are allowed.'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * Process uploaded file with Claude Haiku for data extraction
 */
async function processFileWithHaiku(
  uploadId: string,
  filePath: string,
  fileType: string,
  userId: string
): Promise<void> {
  try {
    // Parse the file to extract text
    const documentText = await parseFile(filePath, fileType);

    // Extract sustainability data using Claude Haiku
    const extractionResult = await extractSustainabilityData(documentText);

    // Generate analysis report
    const analysisReport = await generateAnalysisReport(
      extractionResult.monthlyData,
      extractionResult.annualData
    );

    // Save extracted data to database
    await ExtractedData.create({
      uploadId: new mongoose.Types.ObjectId(uploadId),
      userId: new mongoose.Types.ObjectId(userId),
      monthlyData: extractionResult.monthlyData,
      annualData: extractionResult.annualData,
      analysisReport,
      rawResponse: extractionResult.rawResponse,
    });

    // Update upload status to processed
    await Upload.findByIdAndUpdate(uploadId, {
      status: 'processed',
      processedAt: new Date(),
    });

    console.log(`Successfully processed upload ${uploadId}`);
  } catch (error: any) {
    console.error(`Error processing upload ${uploadId}:`, error);

    // Update upload status to error
    await Upload.findByIdAndUpdate(uploadId, {
      status: 'error',
      errorMessage: error.message || 'Failed to process file',
    });
  }
}

// @desc    Upload file(s)
// @route   POST /api/uploads
// @access  Private
export const uploadFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[];
    const userId = (req as any).user.id;

    if (!files || files.length === 0) {
      res.status(400).json({ message: 'No files uploaded' });
      return;
    }

    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uploadDoc = await Upload.create({
          userId,
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          filePath: file.path,
          status: 'processing',
        });

        // Process file with Haiku in the background
        processFileWithHaiku(uploadDoc._id.toString(), file.path, file.mimetype, userId);

        return {
          id: uploadDoc._id,
          fileName: uploadDoc.fileName,
          fileType: uploadDoc.fileType,
          fileSize: uploadDoc.fileSize,
          status: uploadDoc.status,
          uploadedAt: uploadDoc.uploadedAt,
        };
      })
    );

    res.status(201).json({
      success: true,
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Error uploading files',
      error: error.message,
    });
  }
};

// @desc    Get user's upload history
// @route   GET /api/uploads
// @access  Private
export const getUploads = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const uploads = await Upload.find({ userId })
      .sort({ uploadedAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      uploads: uploads.map((upload) => ({
        id: upload._id,
        fileName: upload.fileName,
        fileType: upload.fileType,
        fileSize: upload.fileSize,
        status: upload.status,
        uploadedAt: upload.uploadedAt,
        processedAt: upload.processedAt,
        errorMessage: upload.errorMessage,
      })),
    });
  } catch (error: any) {
    console.error('Get uploads error:', error);
    res.status(500).json({
      message: 'Error fetching uploads',
      error: error.message,
    });
  }
};

// @desc    Delete an upload
// @route   DELETE /api/uploads/:id
// @access  Private
export const deleteUpload = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const uploadId = req.params.id;

    const upload = await Upload.findOne({ _id: uploadId, userId });

    if (!upload) {
      res.status(404).json({ message: 'Upload not found' });
      return;
    }

    // Delete file from filesystem
    if (fs.existsSync(upload.filePath)) {
      fs.unlinkSync(upload.filePath);
    }

    await Upload.findByIdAndDelete(uploadId);

    res.status(200).json({
      success: true,
      message: 'Upload deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete upload error:', error);
    res.status(500).json({
      message: 'Error deleting upload',
      error: error.message,
    });
  }
};
