import Article from '../../models/Article.js';
import { generateEmbedding, cosineSimilarity } from './embeddingService.js';
import { ChatGroq } from '@langchain/groq';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

export const semanticSearch = async (query, limit = 20) => {
  const queryEmbedding = await generateEmbedding(query);

  // Try MongoDB Atlas Vector Search first
  try {
    const results = await Article.aggregate([
      {
        $vectorSearch: {
          index: 'article_vector_index',
          path: 'embedding',
          queryVector: queryEmbedding,
          numCandidates: limit * 10,
          limit,
        },
      },
      {
        $project: {
          title: 1,
          link: 1,
          excerpt: 1,
          aiSummary: 1,
          imageUrl: 1,
          category: 1,
          publishedAt: 1,
          feed: 1,
          score: { $meta: 'vectorSearchScore' },
        },
      },
    ]);
    if (results.length) return results;
  } catch {
    /* fall back to in-memory similarity */
  }

  const articles = await Article.find({ embedding: { $exists: true, $ne: [] } })
    .select('+embedding')
    .sort({ publishedAt: -1 })
    .limit(500)
    .lean();

  const scored = articles
    .map((a) => ({
      ...a,
      score: cosineSimilarity(queryEmbedding, a.embedding),
      embedding: undefined,
    }))
    .filter((a) => a.score > 0.3)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored;
};

export const ragChat = async (question, chatHistory = []) => {
  const relevantArticles = await semanticSearch(question, 5);

  const context = relevantArticles
    .map(
      (a, i) =>
        `[${i + 1}] ${a.title}\nSummary: ${a.aiSummary || a.excerpt || 'No summary'}\nLink: ${a.link}`
    )
    .join('\n\n');

  const sources = relevantArticles.map((a) => ({
    articleId: a._id,
    title: a.title,
    link: a.link,
  }));

  if (!process.env.GROQ_API_KEY) {
    return {
      answer: relevantArticles.length
        ? `Based on recent news, here are relevant articles about "${question}":\n\n${relevantArticles.map((a) => `- ${a.title}`).join('\n')}`
        : `I couldn't find relevant articles for "${question}". Try different keywords.`,
      sources,
    };
  }

  const llm = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: 'llama-3.3-70b-versatile',
    temperature: 0.4,
  });

  const historyMessages = chatHistory.slice(-6).flatMap((msg) => [
    msg.role === 'user'
      ? new HumanMessage(msg.content)
      : new SystemMessage(`Previous assistant response: ${msg.content}`),
  ]);

  const response = await llm.invoke([
    new SystemMessage(
      `You are NewsMind AI, an intelligent news assistant. Answer questions based on the provided news context. Cite sources by number [1], [2], etc. If context is insufficient, say so honestly. Be concise and informative.`
    ),
    ...historyMessages,
    new HumanMessage(`Context from news articles:\n${context || 'No relevant articles found.'}\n\nQuestion: ${question}`),
  ]);

  return { answer: response.content, sources };
};

