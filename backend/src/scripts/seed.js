import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Feed from '../models/Feed.js';
import { DEFAULT_FEEDS } from '../services/rss/feedParser.js';
import { fetchAllFeeds } from '../services/rss/aggregatorService.js';
import dotenv from 'dotenv'

dotenv.config()

const seed = async () => {
  await connectDB();

  const adminExists = await User.findOne({ email: 'admin@newsmind.ai' });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: 'admin@newsmind.ai',
      password: 'admin123',
      role: 'admin',
      isVerified: true,
    });
    console.log('Admin user created: admin@newsmind.ai / admin123');
  }

  for (const feed of DEFAULT_FEEDS) {
    const exists = await Feed.findOne({ url: feed.url });
    if (!exists) {
      await Feed.create(feed);
      console.log(`Feed added: ${feed.title}`);
    }
  }

  console.log('Fetching articles from feeds (this may take a minute)...');
  const results = await fetchAllFeeds();
  console.log('Fetch results:', results);

  await mongoose.disconnect();
  console.log('Seed complete!');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
