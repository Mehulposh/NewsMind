import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: 'text' },
    link: { type: String, required: true, unique: true },
    content: String,
    summary: String,
    aiSummary: String,
    excerpt: String,
    author: String,
    imageUrl: String,
    feed: { type: mongoose.Schema.Types.ObjectId, ref: 'Feed', required: true },
    category: String,
    tags: [String],
    publishedAt: { type: Date, index: true },
    embedding: { type: [Number], select: false },
    clusterId: String,
    isDuplicate: { type: Boolean, default: false },
    duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    readCount: { type: Number, default: 0 },
    sentiment: { type: String, enum: ['positive', 'negative', 'neutral'], default: 'neutral' },
    isTrending: { type: Boolean, default: false },
    voiceSummaryUrl: String,
  },
  { timestamps: true }
);

articleSchema.index({ title: 'text', content: 'text', summary: 'text' });

export default mongoose.model('Article', articleSchema);
