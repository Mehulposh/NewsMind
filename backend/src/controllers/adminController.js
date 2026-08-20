import { getRecommendations, getTrendingTopics } from '../services/ai/recommendationService.js';
import { getTopicClusters } from '../services/ai/clusterService.js';
import { getDuplicateGroups } from '../services/ai/duplicateService.js';
import { generateNewsletter } from '../services/ai/summaryService.js';
import Newsletter from '../models/Newsletter.js';
import Article from '../models/Article.js';
import User from '../models/User.js';
import Feed from '../models/Feed.js';

export const getRecommendationsHandler = async (req, res) => {
  const recs = await getRecommendations(req.user._id, Number(req.query.limit) || 10);
  res.json(recs);
};

export const getTrending = async (_req, res) => {
  const topics = await getTrendingTopics();
  res.json(topics);
};

export const getClusters = async (_req, res) => {
  const clusters = await getTopicClusters();
  res.json(clusters);
};

export const getDuplicates = async (_req, res) => {
  const duplicates = await getDuplicateGroups();
  res.json(duplicates);
};

export const generateNewsletterHandler = async (req, res) => {
  const user = await User.findById(req.user._id);
  const articles = await getRecommendations(req.user._id, 8);

  const { subject, content } = await generateNewsletter(articles, user.preferences);

  const newsletter = await Newsletter.create({
    user: req.user._id,
    subject,
    content,
    articles: articles.map((a) => a._id),
  });

  res.status(201).json(newsletter);
};

export const getNewsletters = async (req, res) => {
  const newsletters = await Newsletter.find({ user: req.user._id })
    .populate('articles', 'title link aiSummary')
    .sort({ createdAt: -1 });
  res.json(newsletters);
};

export const getAnalytics = async (_req, res) => {
  const [totalArticles, totalFeeds, totalUsers, categoryBreakdown, recentActivity] = await Promise.all([
    Article.countDocuments(),
    Feed.countDocuments({ isActive: true }),
    User.countDocuments(),
    Article.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Article.find().sort({ createdAt: -1 }).limit(5).select('title createdAt'),
  ]);

  res.json({
    totalArticles,
    totalFeeds,
    totalUsers,
    categoryBreakdown,
    recentActivity,
    duplicatesDetected: await Article.countDocuments({ isDuplicate: true }),
  });
};

export const getAdminUsers = async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 }).limit(100);
  res.json(users);
};

export const deleteFeed = async (req, res) => {
  await Feed.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ message: 'Feed deactivated' });
};

export const updateUserRole = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }).select('-password');
  res.json(user);
};
