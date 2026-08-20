import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, updatePreferences, googleCallback } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate, asyncHandler } from '../middleware/validate.js';
import passport from '../config/passport.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  validate,
  asyncHandler(register)
);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], validate, asyncHandler(login));

router.get('/me', protect, asyncHandler(getMe));
router.put('/preferences', protect, asyncHandler(updatePreferences));

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login` }),
  asyncHandler(googleCallback)
);

export default router;
