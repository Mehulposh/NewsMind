import Article from '../models/Article.js';
import Feed from '../models/Feed.js';
import { cacheGet, cacheSet } from '../config/redis.js';

export const getArticles = async (req, res) => {
  const { page = 1, limit = 20, category, feed, search, sort = '-publishedAt' } = req.query;
  const query = { isDuplicate: false };

  if (category) query.category = category;
  if (feed) query.feed = feed;
  if (search) query.$text = { $search: search };

  const cacheKey = `articles:${JSON.stringify(req.query)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) return res.json(cached);

  const articles = await Article.find(query)
    .populate('feed', 'title imageUrl')
    .sort(sort)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Article.countDocuments(query);
  const result = { articles, total, page: Number(page), pages: Math.ceil(total / limit) };

  await cacheSet(cacheKey, result, 120);
  res.json(result);
};

export const getArticle = async (req, res) => {
  const article = await Article.findById(req.params.id).populate('feed', 'title siteUrl imageUrl');
  if (!article) return res.status(404).json({ message: 'Article not found' });

  article.readCount += 1;
  await article.save();

  if (req.user) {
    const User = (await import('../models/User.js')).default;
    await User.findByIdAndUpdate(req.user._id, {
      $push: { readHistory: { article: article._id, readAt: new Date() } },
    });
  }

  res.json(article);
};

export const getTrending = async (req, res) => {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const articles = await Article.find({
    publishedAt: { $gte: since },
    isDuplicate: false,
  })
    .populate('feed', 'title')
    .sort({ readCount: -1, publishedAt: -1 })
    .limit(20);

  res.json(articles);
};

export const summarizeArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) return res.status(404).json({ message: 'Article not found' });

  if (article.aiSummary) return res.json({ summary: article.aiSummary });

  const { generateSummary } = await import('../services/ai/summaryService.js');
  const summary = await generateSummary(article.title, article.content || article.excerpt);
  article.aiSummary = summary;
  await article.save();

  res.json({ summary });
};

export const toggleBookmark = async (req, res) => {
  const User = (await import('../models/User.js')).default;
  const user = await User.findById(req.user._id);
  const articleId = req.params.id;
  const index = user.bookmarks.indexOf(articleId);

  if (index > -1) {
    user.bookmarks.splice(index, 1);
  } else {
    user.bookmarks.push(articleId);
  }
  await user.save();
  res.json({ bookmarked: index === -1, bookmarks: user.bookmarks });
};

export const getBookmarks = async (req, res) => {
  const User = (await import('../models/User.js')).default;
  const user = await User.findById(req.user._id).populate({
    path: 'bookmarks',
    populate: { path: 'feed', select: 'title' },
  });
  res.json(user.bookmarks);
};

export const getFeeds = async (req, res) => {
  const feeds = await Feed.find({ isActive: true }).sort({ title: 1 });
  res.json(feeds);
};

export const addFeed = async (req, res) => {
  const { addFeed: addFeedService } = await import('../services/rss/aggregatorService.js');
  const feed = await addFeedService({ ...req.body, userId: req.user._id });
  res.status(201).json(feed);
};

export const refreshFeeds = async (req, res) => {
  const { fetchAllFeeds } = await import('../services/rss/aggregatorService.js');
  const results = await fetchAllFeeds();
  res.json({ message: 'Feeds refreshed', results });
};
