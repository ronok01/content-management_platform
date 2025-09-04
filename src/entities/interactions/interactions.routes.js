import express from 'express';
import { verifyToken } from '../../core/middlewares/authMiddleware.js';
import {
  toggleLike,
  toggleFollow,
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from './interactions.controller.js';

const router = express.Router();

// Like routes
router.post('/like/:contentId', verifyToken, toggleLike);

// Follow routes
router.post('/follow/:userId', verifyToken, toggleFollow);

// Comment routes
router
  .route('/comments/:contentId')
  .get(getComments) // Can be public
  .post(verifyToken, addComment);

router
  .route('/comments/:commentId')
  .put(verifyToken, updateComment)
  .delete(verifyToken, deleteComment);

export default router;



