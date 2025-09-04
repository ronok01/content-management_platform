import { generateResponse } from '../../lib/responseFormate.js';
import {
  createContentService,
  getAllContentService,
  getContentByIdService,
  updateContentService,
  deleteContentService,
  analyzeContentService,
  getRelatedContentService,
} from './content.service.js';

export const createContent = async (req, res) => {
  try {
    const authorId = req.user.id;
    const contentData = req.body;
    const imageFile = req.files?.featuredImage?.[0]; // Get the file from multer

    if (!contentData.title || !contentData.body) {
      return generateResponse(res, 400, false, 'Title and body are required.');
    }

    // Pass the file to the service
    const newContent = await createContentService(contentData, authorId, imageFile);

    generateResponse(res, 201, true, 'Content created successfully', newContent);
  } catch (error) {
    console.error(error); // It's good practice to log the actual error
    generateResponse(res, 500, false, 'Failed to create content', null);
  }
};

export const getAllContent = async (req, res) => {
  try {
    const { content, paginationInfo } = await getAllContentService(req.query);
    generateResponse(res, 200, true, 'Content fetched successfully', {
      content,
      paginationInfo,
    });
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, 'Failed to fetch content', null);
  }
};

export const getContentById = async (req, res) => {
  try {
    const content = await getContentByIdService(req.params.id);
    generateResponse(res, 200, true, 'Content fetched successfully', content);
  } catch (error) {
    console.error(error);
    const statusCode = error.message === 'Content not found' ? 404 : 500;
    generateResponse(res, statusCode, false, error.message, null);
  }
};

export const updateContent = async (req, res) => {
  try {
    // Pass the entire user object to the service for authorization checks
    const updatedContent = await updateContentService(req.params.id, req.body, req.user);
    generateResponse(res, 200, true, 'Content updated successfully', updatedContent);
  } catch (error) {
    console.error(error);
    const statusCode = error.message.includes('Authorization failed') 
      ? 403 
      : error.message === 'Content not found' ? 404 : 500;
    generateResponse(res, statusCode, false, error.message, null);
  }
};

export const deleteContent = async (req, res) => {
  try {
    // Pass the entire user object to the service for authorization checks
    await deleteContentService(req.params.id, req.user);
    generateResponse(res, 200, true, 'Content deleted successfully', null);
  } catch (error) {
    console.error(error);
    const statusCode = error.message.includes('Authorization failed') 
      ? 403 
      : error.message === 'Content not found' ? 404 : 500;
    generateResponse(res, statusCode, false, error.message, null);
  }
};

export const analyzeContent = async (req, res) => {
  try {
    const { body } = req.body;
    const analysisResults = await analyzeContentService(body);
    generateResponse(res, 200, true, 'Content analyzed successfully', analysisResults);
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, 'Failed to analyze content', null);
  }
};

export const getRelatedContent = async (req, res) => {
  try {
    const relatedContent = await getRelatedContentService(req.params.id);
    generateResponse(res, 200, true, 'Related content fetched successfully', relatedContent);
  } catch (error) {
    console.error(error);
    const statusCode = error.message === 'Content not found' ? 404 : 500;
    generateResponse(res, statusCode, false, error.message, null);
  }
};
