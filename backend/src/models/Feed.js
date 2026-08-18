import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true, unique: true },
    description: String,
    siteUrl: String,
    imageUrl: String,
    category: {
      type: String,
      enum: ['technology', 'business', 'science', 'health', 'politics', 'sports', 'entertainment', 'world', 'general'],
      default: 'general',
    },
    language: { type: String, default: 'en' },
    isActive: { type: Boolean, default: true },
    lastFetched: Date,
    articleCount: { type: Number, default: 0 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model('Feed', feedSchema);
