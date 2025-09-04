import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

// To ensure a user can only like a post once
likeSchema.index({ userId: 1, contentId: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;
