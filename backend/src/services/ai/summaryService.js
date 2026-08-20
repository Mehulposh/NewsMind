import { ChatGroq } from '@langchain/groq';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

let llm = null;

const getLLM = () => {
  if (!llm && process.env.GROQ_API_KEY) {
    llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
    });
  }
  return llm;
};

export const generateSummary = async (title, content) => {
  const model = getLLM();
  if (!model) {
    return content?.slice(0, 200) + '...' || title;
  }

  const text = (content || title).slice(0, 4000);
  const response = await model.invoke([
    new SystemMessage(
      'You are a news summarizer. Provide a concise 2-3 sentence summary capturing the key facts. Be neutral and factual.'
    ),
    new HumanMessage(`Summarize this article:\n\nTitle: ${title}\n\nContent: ${text}`),
  ]);

  return response.content;
};

export const generateNewsletter = async (articles, userPreferences = {}) => {
  const model = getLLM();
  const topics = userPreferences.topics?.join(', ') || 'general news';

  const articleList = articles
    .map((a, i) => `${i + 1}. ${a.title}\n   ${a.aiSummary || a.excerpt || ''}`)
    .join('\n\n');

  if (!model) {
    return {
      subject: `Your NewsMind Digest - ${new Date().toLocaleDateString()}`,
      content: `<h1>Your Daily News Digest</h1>\n<p>Topics: ${topics}</p>\n${articles.map((a) => `<h3>${a.title}</h3><p>${a.aiSummary || a.excerpt}</p>`).join('')}`,
    };
  }

  const response = await model.invoke([
    new SystemMessage(
      'Create an engaging HTML newsletter digest from the provided articles. Include a catchy subject line and well-formatted HTML content with headings and brief summaries. Focus on user interests.'
    ),
    new HumanMessage(
      `Create a newsletter for a reader interested in: ${topics}\n\nArticles:\n${articleList}\n\nReturn JSON with "subject" and "content" (HTML) fields.`
    ),
  ]);

  try {
    const parsed = JSON.parse(response.content.replace(/```json\n?|\n?```/g, ''));
    return parsed;
  } catch {
    return {
      subject: `Your NewsMind Digest - ${new Date().toLocaleDateString()}`,
      content: response.content,
    };
  }
};

export const analyzeSentiment = async (text) => {
  const model = getLLM();
  if (!model) return 'neutral';

  const response = await model.invoke([
    new SystemMessage('Classify sentiment as exactly one of: positive, negative, neutral. Reply with only the word.'),
    new HumanMessage(text.slice(0, 1000)),
  ]);

  const sentiment = response.content.toLowerCase().trim();
  return ['positive', 'negative', 'neutral'].includes(sentiment) ? sentiment : 'neutral';
};
