import { semanticSearch, ragChat } from '../services/ai/ragService.js';
import ChatMessage from '../models/ChatMessage.js';
import { v4 as uuidv4 } from 'uuid';

export const search = async (req, res) => {
  const { q, limit = 20 } = req.query;
  if (!q) return res.status(400).json({ message: 'Query required' });

  const results = await semanticSearch(q, Number(limit));
  res.json({ query: q, results, count: results.length });
};

export const chat = async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message) return res.status(400).json({ message: 'Message required' });

  const sid = sessionId || uuidv4();
  const history = await ChatMessage.find({ sessionId: sid, user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const { answer, sources } = await ragChat(message, history.reverse());

  await ChatMessage.create([
    { user: req.user._id, sessionId: sid, role: 'user', content: message },
    { user: req.user._id, sessionId: sid, role: 'assistant', content: answer, sources },
  ]);

  res.json({ sessionId: sid, answer, sources });
};

export const getChatHistory = async (req, res) => {
  const { sessionId } = req.params;
  const messages = await ChatMessage.find({ sessionId, user: req.user._id }).sort({ createdAt: 1 });
  res.json(messages);
};

export const getSessions = async (req, res) => {
  const sessions = await ChatMessage.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: '$sessionId', lastMessage: { $last: '$content' }, updatedAt: { $last: '$createdAt' } } },
    { $sort: { updatedAt: -1 } },
    { $limit: 20 },
  ]);
  res.json(sessions);
};
