import Article from '../../models/Article.js';
import { cosineSimilarity } from './embeddingService.js';

const DUPLICATE_THRESHOLD = 0.85;

export const detectDuplicates = async (article) => {
  if (!article.embedding?.length) return null;

  const candidates = await Article.find({
    _id: { $ne: article._id },
    publishedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    isDuplicate: false,
  })
    .select('+embedding')
    .sort({ publishedAt: -1 })
    .limit(50)
    .lean();

  for (const candidate of candidates) {
    if (!candidate.embedding?.length) continue;
    const sim = cosineSimilarity(article.embedding, candidate.embedding);
    if (sim >= DUPLICATE_THRESHOLD) {
      await Article.findByIdAndUpdate(article._id, {
        isDuplicate: true,
        duplicateOf: candidate._id,
      });
      return candidate._id;
    }
  }
  return null;
};

export const getDuplicateGroups = async () => {
  const duplicates = await Article.find({ isDuplicate: true })
    .populate('duplicateOf', 'title link')
    .populate('feed', 'title')
    .sort({ publishedAt: -1 })
    .limit(50);
  return duplicates;
};
