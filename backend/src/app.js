import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import passport from './config/passport.js';
import authRoutes from './routes/authRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { errorHandler } from './middleware/validate.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(passport.initialize());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use('/api/', limiter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'NewsMind AI', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', adminRoutes);

app.use(errorHandler);

export default app;
