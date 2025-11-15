import express from 'express';
import {
  getExtractionByUploadId,
  getUserExtractions,
  exportExtractionData,
} from '../controllers/extractionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all extractions for user
router.get('/', getUserExtractions);

// Get extraction for specific upload
router.get('/:uploadId', getExtractionByUploadId);

// Export extraction data as CSV
router.get('/:uploadId/export/:type', exportExtractionData);

export default router;
