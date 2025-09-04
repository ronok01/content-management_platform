import Content from './content.model.js';
import Category from '../category/category.model.js';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import natural from 'natural';
import { cloudinaryUpload } from '../../lib/cloudinaryUpload.js';

const { WordTokenizer, PorterStemmer } = natural;
const tokenizer = new WordTokenizer();
const TfIdf = new natural.TfIdf();

/**
 * A reusable function to perform all AI and content analysis.
 * @param {string} textBody - The HTML body of the content.
 * @returns {object} An object containing all analysis results.
 */
const performContentAnalysis = async (textBody) => {
  // 1. Analyze Readability and Word Count
  const dom = new JSDOM(`<body>${textBody}</body>`);
  const reader = new Readability(dom.window.document);
  const article = reader.parse();
  
  const wordCount = article ? article.textContent.split(/\s+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200);
  const textContent = article ? article.textContent : '';

  // 2. Auto-Tagging using TF-IDF
  const tfidf = new natural.TfIdf();
  tfidf.addDocument(textContent);
  const autoTags = tfidf.listTerms(0).slice(0, 5).map(item => item.term);

  // 3. Smart Category Suggestion
  let suggestedCategory = 'Uncategorized';
  const categories = await Category.find({});
  if (categories.length > 0) {
    let maxMatches = 0;
    const contentTokens = tokenizer.tokenize(textContent.toLowerCase());
    
    categories.forEach(cat => {
      let currentMatches = 0;
      cat.keywords.forEach(keyword => {
        if (contentTokens.includes(keyword.toLowerCase())) {
          currentMatches++;
        }
      });
      if (currentMatches > maxMatches) {
        maxMatches = currentMatches;
        suggestedCategory = cat.name;
      }
    });
  }

  return {
    wordCount,
    readingTime,
    autoTags,
    suggestedCategory
  };
};

/**
 * Creates new content with AI analysis and handles optional file upload.
 * @param {object} contentData - The content data from the request body.
 * @param {string} authorId - The ID of the content's author.
 * @param {object} [file] - The optional file object from multer.
 * @returns {object} The newly created content document.
 */
export const createContentService = async (contentData, authorId, file) => {
  const { title, body, tags, status, metadata } = contentData;

  let featuredImageUrl = null;
  if (file) {
    const result = await cloudinaryUpload(
      file.path,
      `content_${authorId}_${Date.now()}`,
      'content_images',
    );
    if (!result || !result.secure_url) {
      throw new Error('Cloudinary upload failed during content creation.');
    }
    featuredImageUrl = result.secure_url;
  }

  // Perform the analysis
  const analysis = await performContentAnalysis(body);

  const newContent = new Content({
    title,
    body,
    author: authorId,
    featuredImage: featuredImageUrl, // Save the Cloudinary URL
    tags: tags || [],
    status,
    metadata,
    autoTags: analysis.autoTags,
    category: analysis.suggestedCategory,
    optimization: {
      wordCount: analysis.wordCount,
      readingTime: analysis.readingTime,
    },
  });

  await newContent.save();
  return newContent;
};

/**
 * Gets all content with filtering, searching, and pagination.
 * @param {object} queryOptions - Options from the request query.
 * @returns {object} An object containing the list of content and pagination info.
 */
export const getAllContentService = async (queryOptions) => {
  const { page = 1, limit = 10, search = '' } = queryOptions;
  const skip = (page - 1) * limit;

  let query = { status: 'published' }; // Default to only published content

  if (search) {
    query.$text = { $search: search };
  }

  const content = await Content.find(query)
    .populate('author', 'name username') // Populate author details
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Content.countDocuments(query);

  const paginationInfo = {
    totalItems: total,
    totalPages: Math.ceil(total / limit),
    currentPage: parseInt(page),
  };

  return { content, paginationInfo };
};

/**
 * Gets a single content document by its ID.
 * @param {string} contentId - The ID of the content.
 * @returns {object} The found content document.
 */
export const getContentByIdService = async (contentId) => {
  const content = await Content.findByIdAndUpdate(
    contentId,
    { $inc: { viewsCount: 1 } }, // Increment view count on each fetch
    { new: true }
  ).populate('author', 'name username');

  if (!content) {
    throw new Error('Content not found');
  }
  return content;
};

/**
 * Updates a content document.
 * @param {string} contentId - The ID of the content to update.
 * @param {object} updateData - The data to update the content with.
 * @param {object} user - The authenticated user performing the action.
 * @returns {object} The updated content document.
 */
export const updateContentService = async (contentId, updateData, user) => {
  const content = await Content.findById(contentId);

  if (!content) {
    throw new Error('Content not found');
  }

  // Check if the user is the author or an admin
  if (content.author.toString() !== user.id && user.role !== 'admin') {
    throw new Error('Authorization failed: You are not the author or an admin.');
  }

  // We can re-run parts of the analysis on update if needed
  const updatedContent = await Content.findByIdAndUpdate(contentId, updateData, { new: true });
  return updatedContent;
};

/**
 * Deletes a content document.
 * @param {string} contentId - The ID of the content to delete.
 * @param {object} user - The authenticated user performing the action.
 */
export const deleteContentService = async (contentId, user) => {
  const content = await Content.findById(contentId);

  if (!content) {
    throw new Error('Content not found');
  }

  // Check if the user is the author or an admin
  if (content.author.toString() !== user.id && user.role !== 'admin') {
    throw new Error('Authorization failed: You are not the author or an admin.');
  }

  const deletedContent = await Content.findByIdAndDelete(contentId);
  // Note: We might also want to delete associated comments, likes etc. here
  // This can be a future enhancement.
};

/**
 * Analyzes a piece of text in real-time.
 * @param {string} textBody - The HTML body from the request.
 * @returns {object} The analysis results.
 */
export const analyzeContentService = async (textBody) => {
  if (!textBody || textBody.trim().length === 0) {
    // Return empty/default stats if there's no content
    return {
      wordCount: 0,
      readingTime: 0,
      autoTags: [],
      suggestedCategory: 'Uncategorized'
    };
  }
  return performContentAnalysis(textBody);
};

/**
 * Finds content related to a given article.
 * @param {string} contentId - The ID of the current content.
 * @returns {array} A list of related content documents.
 */
export const getRelatedContentService = async (contentId) => {
  const currentContent = await Content.findById(contentId);
  if (!currentContent) {
    throw new Error('Content not found');
  }

  const relatedContent = await Content.find({
    _id: { $ne: contentId }, // Exclude the current article
    status: 'published',
    $or: [
      { category: currentContent.category },
      { tags: { $in: currentContent.tags } },
      { autoTags: { $in: currentContent.autoTags } }
    ]
  }).limit(5).populate('author', 'name username');

  return relatedContent;
};
