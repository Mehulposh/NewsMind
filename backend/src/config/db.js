import mongoose from 'mongoose';

const MONGODB_URI="mongodb://localhost:27017/newsmind"
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};
