import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, RefreshCw, Sparkles, TrendingUp, Newspaper } from 'lucide-react';
import toast from 'react-hot-toast';
import { useArticleStore } from '../store/articleStore';
import { useAuthStore } from '../store/authStore';
import { featuresAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';

const categories = ['all', 'technology', 'business', 'science', 'health', 'politics', 'sports', 'entertainment', 'world'];

export default function Dashboard() {
  const { articles, loading, pagination, fetchArticles, toggleBookmark, bookmarks } = useArticleStore();
  const { user } = useAuthStore();
  const [category, setCategory] = useState('all');
  const [recommendations, setRecommendations] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const params = { page, limit: 12 };
    if (category !== 'all') params.category = category;
    fetchArticles(params);
  }, [category, page, fetchArticles]);

  useEffect(() => {
    featuresAPI.getRecommendations().then(({ data }) => setRecommendations(data)).catch(() => {});
    featuresAPI.getClusters().then(({ data }) => setClusters(data)).catch(() => {});
  }, []);

  const bookmarkIds = bookmarks.map((b) => b._id);

  const handleBookmark = async (id) => {
    try {
      await toggleBookmark(id);
      toast.success('Bookmark updated');
    } catch {
      toast.error('Login required');
    }
  };

  const handleNewsletter = async () => {
    try {
      await featuresAPI.generateNewsletter();
      toast.success('Newsletter generated!');
    } catch {
      toast.error('Failed to generate newsletter');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Welcome, {user?.name}</h1>
        <p className="text-gray-400">Your personalized news dashboard</p>
      </motion.div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/search" className="btn-secondary text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> Semantic Search
        </Link>
        <Link to="/chat" className="btn-secondary text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> AI Chat
        </Link>
        <button onClick={handleNewsletter} className="btn-secondary text-sm flex items-center gap-2">
          <Newspaper className="w-4 h-4" /> Generate Newsletter
        </button>
        <Link to="/bookmarks" className="btn-secondary text-sm">Bookmarks</Link>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent-400" /> Recommended for You
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.slice(0, 4).map((a) => (
              <ArticleCard key={a._id} article={a} onBookmark={handleBookmark} isBookmarked={bookmarkIds.includes(a._id)} />
            ))}
          </div>
        </section>
      )}

      {/* Topic Clusters */}
      {clusters.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Topic Clusters</h2>
          <div className="flex flex-wrap gap-3">
            {clusters.slice(0, 8).map((c) => (
              <div key={c.clusterId} className="glass-card !p-4 !inline-block">
                <span className="font-medium text-sm">{c.topic}</span>
                <span className="ml-2 text-xs text-gray-500">{c.count} articles</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm capitalize whitespace-nowrap transition-colors ${
              category === cat ? 'bg-primary-500 text-white' : 'glass hover:bg-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass-card animate-pulse h-64" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a._id} article={a} onBookmark={handleBookmark} isBookmarked={bookmarkIds.includes(a._id)} />
          ))}
        </div>
      )}

      {articles.length === 0 && !loading && (
        <div className="glass-card text-center py-12">
          <RefreshCw className="w-8 h-8 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No articles yet. Run the seed script to populate feeds.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary text-sm">Previous</button>
          <span className="px-4 py-2 text-sm text-gray-400">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-secondary text-sm">Next</button>
        </div>
      )}
    </div>
  );
}
