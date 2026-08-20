import { Router } from 'express';
import {
  getRecommendationsHandler,
  getTrending,
  getClusters,
  getDuplicates,
  generateNewsletterHandler,
  getNewsletters,
  getAnalytics,
  getAdminUsers,
  deleteFeed,
  updateUserRole,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validate.js';

const router = Router();

router.get('/recommendations', protect, asyncHandler(getRecommendationsHandler));
router.get('/trending-topics', asyncHandler(getTrending));
router.get('/clusters', asyncHandler(getClusters));
router.get('/duplicates', protect, adminOnly, asyncHandler(getDuplicates));
router.post('/newsletter', protect, asyncHandler(generateNewsletterHandler));
router.get('/newsletters', protect, asyncHandler(getNewsletters));

router.get('/analytics', protect, adminOnly, asyncHandler(getAnalytics));
router.get('/users', protect, adminOnly, asyncHandler(getAdminUsers));
router.delete('/feeds/:id', protect, adminOnly, asyncHandler(deleteFeed));
router.patch('/users/:id/role', protect, adminOnly, asyncHandler(updateUserRole));

export default router;
