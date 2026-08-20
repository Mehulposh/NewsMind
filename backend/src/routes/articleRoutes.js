import { Router } from 'express';
import {
  getArticles,
  getArticle,
  getTrending,
  summarizeArticle,
  toggleBookmark,
  getBookmarks,
  getFeeds,
  addFeed,
  refreshFeeds,
} from '../controllers/articleController.js';
import { protect, optionalAuth, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validate.js';

const router = Router();

router.get('/', optionalAuth, asyncHandler(getArticles));
router.get('/trending', asyncHandler(getTrending));
router.get('/bookmarks', protect, asyncHandler(getBookmarks));
router.get('/feeds', asyncHandler(getFeeds));
router.post('/feeds', protect, asyncHandler(addFeed));
router.post('/feeds/refresh', protect, adminOnly, asyncHandler(refreshFeeds));
router.get('/:id', optionalAuth, asyncHandler(getArticle));
router.get('/:id/summary', asyncHandler(summarizeArticle));
router.post('/:id/bookmark', protect, asyncHandler(toggleBookmark));

export default router;
