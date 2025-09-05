import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      default: null, // null for top-level comments
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only need createdAt for comments
  },
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
