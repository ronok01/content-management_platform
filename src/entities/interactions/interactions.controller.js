import { generateResponse } from '../../lib/responseFormate.js';
import {
  toggleLikeService,
  toggleFollowService,
  addCommentService,
  getCommentsService,
  updateCommentService,
  deleteCommentService,
} from './interactions.service.js';

export const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId } = req.params;
    const result = await toggleLikeService(userId, contentId);
    const message = result.liked ? 'Content liked successfully' : 'Content unliked successfully';
    generateResponse(res, 200, true, message, result);
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, 'Failed to toggle like on content', null);
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;
    const result = await toggleFollowService(followerId, followingId);
    const message = result.following ? 'User followed successfully' : 'User unfollowed successfully';
    generateResponse(res, 200, true, message, result);
  } catch (error) {
    console.error(error);
    const statusCode = error.message === 'Users cannot follow themselves.' ? 400 : 500;
    generateResponse(res, statusCode, false, error.message, null);
  }
};

export const getComments = async (req, res) => {
  try {
    const { contentId } = req.params;
    const comments = await getCommentsService(contentId);
    generateResponse(res, 200, true, 'Comments fetched successfully', comments);
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, 'Failed to fetch comments', null);
  }
};

export const addComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contentId } = req.params;
    const { text, parentId } = req.body;
    if (!text) {
        return generateResponse(res, 400, false, 'Comment text is required.');
    }
    const newComment = await addCommentService(userId, contentId, text, parentId);
    generateResponse(res, 201, true, 'Comment added successfully', newComment);
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, 'Failed to add comment', null);
  }
};

export const updateComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;
    const { text } = req.body;
    if (!text) {
        return generateResponse(res, 400, false, 'Comment text is required.');
    }
    const updatedComment = await updateCommentService(userId, commentId, text);
    generateResponse(res, 200, true, 'Comment updated successfully', updatedComment);
  } catch (error) {
    console.error(error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    generateResponse(res, statusCode, false, error.message, null);
  }
};

export const deleteComment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { commentId } = req.params;
    await deleteCommentService(userId, commentId);
    generateResponse(res, 200, true, 'Comment deleted successfully', null);
  } catch (error) {
    console.error(error);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    generateResponse(res, statusCode, false, error.message, null);
  }
};
