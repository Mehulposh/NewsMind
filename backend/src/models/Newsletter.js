import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    content: { type: String, required: true },
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    status: { type: String, enum: ['draft', 'sent'], default: 'draft' },
    sentAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Newsletter', newsletterSchema);
