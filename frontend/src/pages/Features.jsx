import { motion } from 'framer-motion';
import {
  Brain, Search, MessageSquare, TrendingUp, Sparkles, Newspaper,
  Copy, Bookmark, BarChart3, Mic, Moon, Rss, Shield, Zap,
} from 'lucide-react';

const allFeatures = [
  { icon: Rss, title: 'Intelligent RSS Aggregation', desc: 'Automatically collects and processes news from hundreds of RSS feeds with smart categorization.' },
  { icon: Brain, title: 'AI Summaries', desc: 'Groq-powered AI generates concise, factual summaries for every article using LangChain.' },
  { icon: Search, title: 'Semantic Search', desc: 'MongoDB Atlas Vector Search with Voyage AI embeddings finds news by meaning, not keywords.' },
  { icon: MessageSquare, title: 'RAG Chatbot', desc: 'Conversational AI assistant that answers questions using retrieved news context.' },
  { icon: TrendingUp, title: 'Personalized Recommendations', desc: 'ML-based recommendations based on reading history, bookmarks, and topic preferences.' },
  { icon: Newspaper, title: 'AI Newsletters', desc: 'Auto-generated personalized newsletter digests tailored to your interests.' },
  { icon: Copy, title: 'Duplicate Detection', desc: 'Embedding similarity detects duplicate stories across different sources automatically.' },
  { icon: Sparkles, title: 'Topic Clustering', desc: 'Related articles grouped into topic clusters for easier discovery.' },
  { icon: Bookmark, title: 'Bookmarks & History', desc: 'Save articles for later and track your reading history.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Admin analytics with category breakdowns, user stats, and activity monitoring.' },
  { icon: Mic, title: 'Voice Summaries', desc: 'Listen to AI-generated voice summaries of articles on the go.' },
  { icon: Moon, title: 'Dark/Light Themes', desc: 'Beautiful glassmorphism UI with seamless dark and light mode switching.' },
  { icon: Shield, title: 'Secure Authentication', desc: 'JWT authentication with Google OAuth support for secure access.' },
  { icon: Zap, title: 'Real-time Updates', desc: 'WebSocket-powered live feed updates and Redis caching for performance.' },
];

export default function Features() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          <span className="gradient-text">Powerful Features</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          NewsMind AI combines cutting-edge AI with modern web technologies to deliver
          the most intelligent news experience available.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allFeatures.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="glass-card flex gap-4"
          >
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 h-fit">
              <Icon className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
