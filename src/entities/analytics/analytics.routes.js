import express from 'express';
import {
  getContentAnalytics,
  getTrending,
} from './analytics.controller.js';

const router = express.Router();

router.get('/content/:contentId', getContentAnalytics);
router.get('/trending', getTrending);

export default router;
