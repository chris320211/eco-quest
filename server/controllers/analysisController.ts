import { Request, Response } from 'express';
import Analysis from '../models/Analysis.js';

// @desc    Get user's dashboard data
// @route   GET /api/dashboard
// @access  Private
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    // Get latest analysis
    const latestAnalysis = await Analysis.findOne({ userId })
      .sort({ createdAt: -1 });

    // Get analysis history (last 5)
    const analysisHistory = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('period dataCoverage summary createdAt');

    res.status(200).json({
      success: true,
      data: {
        dataCoverage: latestAnalysis?.dataCoverage || 0,
        lastAnalysisDate: latestAnalysis?.createdAt || null,
        framework: latestAnalysis?.framework || 'GHG Basic Protocol / VSME Environmental',
        totalAnalyses: await Analysis.countDocuments({ userId }),
        analysisHistory: analysisHistory.map((analysis) => ({
          id: analysis._id,
          period: analysis.period,
          date: analysis.createdAt,
          coverage: analysis.dataCoverage,
          summary: analysis.summary,
        })),
      },
    });
  } catch (error: any) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      message: 'Error fetching dashboard data',
      error: error.message,
    });
  }
};

// @desc    Get analysis by period or latest
// @route   GET /api/analysis
// @access  Private
export const getAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const period = req.query.period as string;

    let analysis;
    if (period) {
      analysis = await Analysis.findOne({ userId, period });
    } else {
      analysis = await Analysis.findOne({ userId }).sort({ createdAt: -1 });
    }

    if (!analysis) {
      res.status(404).json({
        success: false,
        message: 'No analysis found. Please upload documents and run your first analysis.',
      });
      return;
    }

    res.status(200).json({
      success: true,
      analysis: {
        id: analysis._id,
        period: analysis.period,
        dataCoverage: analysis.dataCoverage,
        totalEmissions: analysis.totalEmissions,
        emissionsUnit: analysis.emissionsUnit,
        framework: analysis.framework,
        summary: analysis.summary,
        emissionsBreakdown: analysis.emissionsBreakdown,
        emissionsByCategory: analysis.emissionsByCategory,
        missingFields: analysis.missingFields,
        insights: analysis.insights,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      message: 'Error fetching analysis',
      error: error.message,
    });
  }
};

// @desc    Create or update analysis
// @route   POST /api/analysis
// @access  Private
export const createOrUpdateAnalysis = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const {
      period,
      dataCoverage,
      totalEmissions,
      emissionsUnit,
      framework,
      summary,
      emissionsBreakdown,
      emissionsByCategory,
      missingFields,
      insights,
    } = req.body;

    if (!period || dataCoverage === undefined) {
      res.status(400).json({ message: 'Period and dataCoverage are required' });
      return;
    }

    // Check if analysis exists for this period
    const existingAnalysis = await Analysis.findOne({ userId, period });

    let analysis;
    if (existingAnalysis) {
      // Update existing analysis
      analysis = await Analysis.findByIdAndUpdate(
        existingAnalysis._id,
        {
          dataCoverage,
          totalEmissions,
          emissionsUnit,
          framework,
          summary,
          emissionsBreakdown,
          emissionsByCategory,
          missingFields,
          insights,
        },
        { new: true }
      );
    } else {
      // Create new analysis
      analysis = await Analysis.create({
        userId,
        period,
        dataCoverage,
        totalEmissions,
        emissionsUnit,
        framework,
        summary,
        emissionsBreakdown,
        emissionsByCategory,
        missingFields,
        insights,
      });
    }

    res.status(existingAnalysis ? 200 : 201).json({
      success: true,
      message: existingAnalysis ? 'Analysis updated successfully' : 'Analysis created successfully',
      analysis: {
        id: analysis._id,
        period: analysis.period,
        dataCoverage: analysis.dataCoverage,
        totalEmissions: analysis.totalEmissions,
        createdAt: analysis.createdAt,
        updatedAt: analysis.updatedAt,
      },
    });
  } catch (error: any) {
    console.error('Create/Update analysis error:', error);
    res.status(500).json({
      message: 'Error creating/updating analysis',
      error: error.message,
    });
  }
};

// @desc    Get all analysis periods for user
// @route   GET /api/analysis/periods
// @access  Private
export const getAnalysisPeriods = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;

    const analyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .select('period createdAt');

    res.status(200).json({
      success: true,
      periods: analyses.map((a) => ({
        period: a.period,
        createdAt: a.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Get periods error:', error);
    res.status(500).json({
      message: 'Error fetching analysis periods',
      error: error.message,
    });
  }
};
