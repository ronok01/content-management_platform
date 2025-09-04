import express from 'express';
import {
  verifyToken,
  checkRole,
} from '../../core/middlewares/authMiddleware.js';
import { multerUpload } from '../../core/middlewares/multer.js';
import {
  createContent,
  getAllContent,
  getContentById,
  updateContent,
  deleteContent,
  analyzeContent,
  getRelatedContent,
} from './content.controller.js';

const router = express.Router();

// Core Content Routes
router
  .route('/')
  .get(getAllContent)
  .post(
    verifyToken,
    checkRole(['creator', 'admin']),
    multerUpload([{ name: 'featuredImage', maxCount: 1 }]), // Multer middleware now here
    createContent,
  );

router
  .route('/:id')
  .get(getContentById)
  .put(verifyToken, updateContent)
  .delete(verifyToken, deleteContent);

// Smart Feature Routes
router.post(
  '/analyze',
  verifyToken,
  checkRole(['creator', 'admin']),
  analyzeContent,
);
router.get('/:id/related', getRelatedContent);

export default router;
