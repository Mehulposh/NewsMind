import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Brain, Sparkles, TrendingUp, MessageSquare, Newspaper, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { useEffect } from 'react';
import { useArticleStore } from '../store/articleStore';
import ArticleCard from '../components/ArticleCard';

const features = [
  { icon: Brain, title: 'AI Summaries', desc: 'Instant AI-generated summaries for every article' },
  { icon: Search, title: 'Semantic Search', desc: 'Find news by meaning, not just keywords' },
  { icon: MessageSquare, title: 'RAG Chatbot', desc: 'Ask questions about current events' },
  { icon: TrendingUp, title: 'Smart Recommendations', desc: 'Personalized news based on your interests' },
  { icon: Sparkles, title: 'Topic Clustering', desc: 'Related stories grouped automatically' },
  { icon: Newspaper, title: 'AI Newsletters', desc: 'Custom digest delivered to you' },
];

export default function Home() {
  const { trending, fetchTrending } = useArticleStore();

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/40 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 py-24 sm:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-accent-400 mb-6">
              <Zap className="w-4 h-4" /> Powered by Groq AI & Vector Search
            </div>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
              <span className="gradient-text">Intelligent News</span>
              <br />
              <span className="text-gray-100">for the Modern Reader</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              NewsMind AI combines RSS aggregation with semantic search, RAG-powered chat,
              and AI summaries to cut through information overload.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-3 flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/search" className="btn-secondary text-lg px-8 py-3 flex items-center justify-center gap-2">
                <Search className="w-5 h-5" /> Try Semantic Search
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16"
          >
            {[
              { icon: Globe, label: 'Global Feeds' },
              { icon: Shield, label: 'Secure & Private' },
              { icon: Sparkles, label: 'AI-Powered' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="glass-card text-center py-4">
                <Icon className="w-6 h-6 text-primary-400 mx-auto mb-2" />
                <span className="text-xs text-gray-400">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why NewsMind AI?</h2>
          <p className="text-gray-400 max-w-xl mx-auto">Everything you need to stay informed without the overwhelm.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card"
            >
              <div className="p-3 rounded-xl bg-primary-500/20 w-fit mb-4">
                <Icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-accent-400" /> Trending Now
            </h2>
            <Link to="/dashboard" className="text-primary-400 hover:text-primary-300 flex items-center gap-1 text-sm">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trending.slice(0, 6).map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="glass-card">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your news experience?</h2>
          <p className="text-gray-400 mb-8">Join NewsMind AI and discover news the intelligent way.</p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
            Start Reading Smarter <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
