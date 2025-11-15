import { Request, Response } from 'express';
import ExtractedData from '../models/ExtractedData.js';
import Upload from '../models/Upload.js';

// @desc    Get extracted data for a specific upload
// @route   GET /api/extractions/:uploadId
// @access  Private
export const getExtractionByUploadId = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { uploadId } = req.params;

    // Verify upload belongs to user
    const upload = await Upload.findOne({ _id: uploadId, userId });
    if (!upload) {
      res.status(404).json({ message: 'Upload not found' });
      return;
    }

    // Get extracted data
    const extractedData = await ExtractedData.findOne({ uploadId });

    if (!extractedData) {
      res.status(404).json({
        message: 'No extracted data found. The file may still be processing.',
        uploadStatus: upload.status
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        uploadId: extractedData.uploadId,
        monthlyData: extractedData.monthlyData,
        annualData: extractedData.annualData,
        analysisReport: extractedData.analysisReport,
        extractedAt: extractedData.extractedAt,
      },
    });
  } catch (error: any) {
    console.error('Get extraction error:', error);
    res.status(500).json({
      message: 'Error fetching extracted data',
      error: error.message,
    });
  }
};

// @desc    Get all extractions for the current user
// @route   GET /api/extractions
// @access  Private
export const getUserExtractions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const limit = parseInt(req.query.limit as string) || 10;

    const extractions = await ExtractedData.find({ userId })
      .sort({ extractedAt: -1 })
      .limit(limit)
      .populate('uploadId', 'fileName fileType uploadedAt');

    res.status(200).json({
      success: true,
      extractions: extractions.map((extraction) => ({
        id: extraction._id,
        uploadId: extraction.uploadId,
        monthlyRecordCount: extraction.monthlyData.length,
        annualRecordCount: extraction.annualData.length,
        years: [...new Set(extraction.annualData.map(d => d.year))],
        extractedAt: extraction.extractedAt,
      })),
    });
  } catch (error: any) {
    console.error('Get extractions error:', error);
    res.status(500).json({
      message: 'Error fetching extractions',
      error: error.message,
    });
  }
};

// @desc    Export extracted data as CSV
// @route   GET /api/extractions/:uploadId/export/:type
// @access  Private
export const exportExtractionData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const { uploadId, type } = req.params; // type: 'monthly' or 'annual'

    // Verify upload belongs to user
    const upload = await Upload.findOne({ _id: uploadId, userId });
    if (!upload) {
      res.status(404).json({ message: 'Upload not found' });
      return;
    }

    // Get extracted data
    const extractedData = await ExtractedData.findOne({ uploadId });
    if (!extractedData) {
      res.status(404).json({ message: 'No extracted data found' });
      return;
    }

    let csvContent = '';
    let filename = '';

    if (type === 'monthly') {
      csvContent = 'year,month,month_label,co2_kg,plastic_lbs,water_gal,energy_kwh\n';
      extractedData.monthlyData.forEach((row) => {
        csvContent += `${row.year},${row.month},${row.month_label},${row.co2_kg},${row.plastic_lbs},${row.water_gal},${row.energy_kwh}\n`;
      });
      filename = `sustainability-monthly-${uploadId}.csv`;
    } else if (type === 'annual') {
      csvContent = 'year,co2_kg,plastic_lbs,water_gal,energy_kwh\n';
      extractedData.annualData.forEach((row) => {
        csvContent += `${row.year},${row.co2_kg},${row.plastic_lbs},${row.water_gal},${row.energy_kwh}\n`;
      });
      filename = `sustainability-annual-${uploadId}.csv`;
    } else {
      res.status(400).json({ message: 'Invalid export type. Use "monthly" or "annual"' });
      return;
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send(csvContent);
  } catch (error: any) {
    console.error('Export extraction error:', error);
    res.status(500).json({
      message: 'Error exporting data',
      error: error.message,
    });
  }
};
