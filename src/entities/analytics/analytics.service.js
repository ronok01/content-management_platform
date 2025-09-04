import Content from '../content/content.model.js';

/**
 * Gets performance analytics for a single piece of content.
 * @param {string} contentId - The ID of the content to analyze.
 * @returns {object} An object containing the content's performance metrics.
 */
export const getContentAnalyticsService = async (contentId) => {
  const content = await Content.findById(contentId).select('viewsCount likesCount commentsCount title');
  if (!content) {
    throw new Error('Content not found');
  }
  return content;
};

/**
 * Gets trending content based on a scoring algorithm.
 * @returns {array} A list of the top 5 trending content documents.
 */
export const getTrendingService = async () => {
  // A simple trending algorithm: sort by views, then likes.
  // This could be made more complex (e.g., factoring in recent activity).
  const trendingContent = await Content.find({ status: 'published' })
    .sort({ viewsCount: -1, likesCount: -1 })
    .limit(5)
    .populate('author', 'name username')
    .select('title author viewsCount likesCount commentsCount');
    
  return trendingContent;
};
