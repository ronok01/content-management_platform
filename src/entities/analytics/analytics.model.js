import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: {
    type: String,
    enum: ['view', 'like', 'comment', 'share'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Object,
  },
});

analyticsSchema.index({ contentId: 1, action: 1 });
analyticsSchema.index({ userId: 1, action: 1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
