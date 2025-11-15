import express from 'express';
import {
  getDashboard,
  getAnalysis,
  createOrUpdateAnalysis,
  getAnalysisPeriods,
} from '../controllers/analysisController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/periods', getAnalysisPeriods);
router.get('/', getAnalysis);
router.post('/', createOrUpdateAnalysis);

export default router;
