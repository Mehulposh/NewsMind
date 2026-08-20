import { Router } from 'express';
import { search, chat, getChatHistory, getSessions } from '../controllers/searchController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../middleware/validate.js';

const router = Router();

router.get('/', asyncHandler(search));
router.post('/chat', protect, asyncHandler(chat));
router.get('/chat/sessions', protect, asyncHandler(getSessions));
router.get('/chat/:sessionId', protect, asyncHandler(getChatHistory));

export default router;
