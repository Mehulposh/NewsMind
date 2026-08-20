import Feed from '../../models/Feed.js';
import Article from '../../models/Article.js';
import { parseFeed } from './feedParser.js';
import { generateEmbedding } from '../ai/embeddingService.js';
import { generateSummary } from '../ai/summaryService.js';
import { detectDuplicates } from '../ai/duplicateService.js';
import { assignCluster } from '../ai/clusterService.js';

export const fetchAndStoreFeed = async (feedId) => {
  const feed = await Feed.findById(feedId);
  if (!feed || !feed.isActive) return { added: 0 };

  let parsed;
  try {
    parsed = await parseFeed(feed.url);
  } catch (err) {
    console.error(`Failed to parse feed ${feed.url}:`, err.message);
    return { added: 0, error: err.message };
  }

  let added = 0;
  for (const item of parsed.items) {
    if (!item.link) continue;

    const exists = await Article.findOne({ link: item.link });
    if (exists) continue;

    const textForEmbedding = `${item.title}. ${item.excerpt || item.content?.slice(0, 500) || ''}`;

    let embedding = [];
    let aiSummary = '';
    try {
      [embedding, aiSummary] = await Promise.all([
        generateEmbedding(textForEmbedding),
        generateSummary(item.title, item.content || item.excerpt),
      ]);
    } catch {
      /* AI services optional when keys missing */
    }

    const article = await Article.create({
      title: item.title,
      link: item.link,
      content: item.content?.slice(0, 10000),
      excerpt: item.excerpt,
      aiSummary,
      author: item.author,
      imageUrl: item.imageUrl,
      feed: feed._id,
      category: feed.category,
      publishedAt: item.publishedAt,
      embedding,
    });

    await detectDuplicates(article);
    await assignCluster(article);
    added++;
  }

  feed.lastFetched = new Date();
  feed.articleCount = await Article.countDocuments({ feed: feed._id });
  await feed.save();

  return { added, feed: feed.title };
};

export const fetchAllFeeds = async () => {
  const feeds = await Feed.find({ isActive: true });
  const results = [];
  for (const feed of feeds) {
    const result = await fetchAndStoreFeed(feed._id);
    results.push({ feed: feed.title, ...result });
  }
  return results;
};

export const addFeed = async ({ url, category, userId }) => {
  const existing = await Feed.findOne({ url });
  if (existing) return existing;

  const parsed = await parseFeed(url);
  const feed = await Feed.create({
    title: parsed.title,
    url,
    description: parsed.description,
    siteUrl: parsed.siteUrl,
    imageUrl: parsed.imageUrl,
    category: category || 'general',
    addedBy: userId,
  });

  await fetchAndStoreFeed(feed._id);
  return feed;
};
