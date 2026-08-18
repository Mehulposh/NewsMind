import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    sources: [
      {
        articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
        title: String,
        link: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('ChatMessage', chatMessageSchema);
