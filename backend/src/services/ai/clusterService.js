import Article from '../../models/Article.js';
import { cosineSimilarity } from './embeddingService.js';

const CLUSTER_THRESHOLD = 0.75;

export const assignCluster = async (article) => {
  if (!article.embedding?.length) {
    article.clusterId = `cluster-${Date.now()}`;
    await article.save();
    return article.clusterId;
  }

  const recent = await Article.find({
    _id: { $ne: article._id },
    clusterId: { $exists: true },
    publishedAt: { $gte: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
  })
    .select('+embedding clusterId')
    .limit(100)
    .lean();

  let bestCluster = null;
  let bestScore = 0;

  for (const other of recent) {
    if (!other.embedding?.length) continue;
    const sim = cosineSimilarity(article.embedding, other.embedding);
    if (sim >= CLUSTER_THRESHOLD && sim > bestScore) {
      bestScore = sim;
      bestCluster = other.clusterId;
    }
  }

  article.clusterId = bestCluster || `cluster-${Date.now()}`;
  await article.save();
  return article.clusterId;
};

export const getTopicClusters = async () => {
  const clusters = await Article.aggregate([
    { $match: { clusterId: { $exists: true }, isDuplicate: false } },
    {
      $group: {
        _id: '$clusterId',
        count: { $sum: 1 },
        articles: { $push: { title: '$title', _id: '$_id', publishedAt: '$publishedAt' } },
        categories: { $addToSet: '$category' },
      },
    },
    { $match: { count: { $gte: 2 } } },
    { $sort: { count: -1 } },
    { $limit: 20 },
    {
      $project: {
        clusterId: '$_id',
        count: 1,
        categories: 1,
        topArticles: { $slice: ['$articles', 5] },
      },
    },
  ]);

  return clusters.map((c) => ({
    ...c,
    topic: c.topArticles?.[0]?.title?.split(' ').slice(0, 4).join(' ') || 'Topic',
  }));
};
