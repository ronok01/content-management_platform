import { generateResponse } from '../../lib/responseFormate.js';
import {
  getContentAnalyticsService,
  getTrendingService,
} from './analytics.service.js';

export const getContentAnalytics = async (req, res) => {
  try {
    const { contentId } = req.params;
    const analytics = await getContentAnalyticsService(contentId);
    generateResponse(res, 200, true, 'Content analytics fetched successfully', analytics);
  } catch (error) {
    console.error(error);
    const statusCode = error.message === 'Content not found' ? 404 : 500;
    generateResponse(res, statusCode, false, error.message, null);
  }
};

export const getTrending = async (req, res) => {
  try {
    const trendingContent = await getTrendingService();
    generateResponse(res, 200, true, 'Trending content fetched successfully', trendingContent);
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, 'Failed to fetch trending content', null);
  }
};
