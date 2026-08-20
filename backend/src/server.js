import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import cron from 'node-cron';
import app from './app.js';
import { connectDB } from './config/db.js';
import { fetchAllFeeds } from './services/rss/aggregatorService.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173' },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('join-feed', (feedId) => socket.join(`feed-${feedId}`));
    socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
  });

  app.set('io', io);

  const schedule = process.env.RSS_CRON_SCHEDULE || '*/30 * * * *';
  cron.schedule(schedule, async () => {
    console.log('Running scheduled RSS fetch...');
    try {
      const results = await fetchAllFeeds();
      io.emit('feeds-updated', results);
    } catch (err) {
      console.error('Scheduled fetch failed:', err.message);
    }
  });

  server.listen(PORT, () => {
    console.log(`NewsMind AI server running on port ${PORT}`);
  });
};

start().catch(console.error);
