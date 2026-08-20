import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const token = generateToken(user._id);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, preferences: user.preferences },
  });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('bookmarks', 'title link imageUrl');
  res.json(user);
};

export const updatePreferences = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { preferences: { ...req.user.preferences, ...req.body } },
    { new: true }
  );
  res.json(user.preferences);
};

export const googleCallback = async (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
};
