import express from 'express';
import { uploadFiles, getUploads, deleteUpload, upload } from '../controllers/uploadController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/', upload.array('files', 10), uploadFiles);
router.get('/', getUploads);
router.delete('/:id', deleteUpload);

export default router;
