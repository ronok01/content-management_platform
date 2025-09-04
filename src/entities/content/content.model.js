import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    featuredImage: String,

    // Smart Categorization & Tagging
    category: String,
    tags: [String],
    autoTags: [String],

    // Content Optimization (Stored for performance)
    optimization: {
      readabilityScore: Number,
      seoScore: Number,
      wordCount: Number,
      readingTime: Number, // in minutes
    },

    // SEO Metadata
    metadata: {
      seoTitle: { type: String },
      metaDescription: { type: String },
    },

    // Interaction Metrics (Denormalized for fast reads)
    viewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  },
);

// Enhanced text search index
contentSchema.index({
  title: 'text',
  body: 'text',
  tags: 'text',
  autoTags: 'text',
  category: 'text',
});

const Content = mongoose.model('Content', contentSchema);
export default Content;
