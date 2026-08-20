import Article from '../../models/Article.js';
import User from '../../models/User.js';
import { cosineSimilarity } from './embeddingService.js';
import { generateEmbedding } from './embeddingService.js';

export const getRecommendations = async (userId, limit = 10) => {
  const user = await User.findById(userId).populate('bookmarks');
  if (!user) return [];

  const readIds = user.readHistory.map((h) => h.article.toString());
  const bookmarkIds = user.bookmarks.map((b) => b._id?.toString() || b.toString());
  const interactedIds = [...new Set([...readIds, ...bookmarkIds])];

  let query = { isDuplicate: false };
  if (interactedIds.length) {
    query._id = { $nin: interactedIds };
  }

  if (user.preferences?.topics?.length) {
    query.category = { $in: user.preferences.topics };
  }

  if (user.preferences?.sources?.length) {
    query.feed = { $in: user.preferences.sources };
  }

  const candidates = await Article.find(query)
    .populate('feed', 'title')
    .sort({ publishedAt: -1, readCount: -1 })
    .limit(limit * 3)
    .lean();

  if (!interactedIds.length) {
    return candidates.slice(0, limit);
  }

  const interactedArticles = await Article.find({ _id: { $in: interactedIds } })
    .select('+embedding')
    .lean();

  const validEmbeddings = interactedArticles.filter((a) => a.embedding?.length);
  if (!validEmbeddings.length) {
    return candidates.slice(0, limit);
  }

  const profileEmbedding = averageEmbedding(validEmbeddings.map((a) => a.embedding));

  const scored = await Promise.all(
    candidates.map(async (article) => {
      let score = article.readCount || 0;
      const full = await Article.findById(article._id).select('+embedding').lean();
      if (full?.embedding?.length) {
        score += cosineSimilarity(profileEmbedding, full.embedding) * 100;
      }
      if (user.preferences?.topics?.includes(article.category)) score += 20;
      return { ...article, score };
    })
  );

  return scored.sort((a, b) => b.score - a.score).slice(0, limit);
};

export const getTrendingTopics = async (limit = 10) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const trending = await Article.aggregate([
    { $match: { publishedAt: { $gte: since }, isDuplicate: false } },
    { $group: { _id: '$category', count: { $sum: 1 }, totalReads: { $sum: '$readCount' } } },
    { $sort: { count: -1, totalReads: -1 } },
    { $limit: limit },
    { $project: { category: '$_id', count: 1, totalReads: 1, _id: 0 } },
  ]);

  return trending;
};

function averageEmbedding(embeddings) {
  if (!embeddings.length) return [];
  const dim = embeddings[0].length;
  const avg = new Array(dim).fill(0);
  for (const emb of embeddings) {
    for (let i = 0; i < dim; i++) avg[i] += emb[i];
  }
  return avg.map((v) => v / embeddings.length);
}

export { generateEmbedding };
