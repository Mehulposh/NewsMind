import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, minlength: 6, select: false },
    googleId: { type: String, sparse: true },
    avatar: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    preferences: {
      topics: [{ type: String }],
      sources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feed' }],
      theme: { type: String, enum: ['light', 'dark'], default: 'dark' },
      newsletterEnabled: { type: Boolean, default: true },
    },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    readHistory: [
      {
        article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
        readAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
