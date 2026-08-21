import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { useArticleStore } from '../store/articleStore';
import ArticleCard from '../components/ArticleCard';
import toast from 'react-hot-toast';

export default function Bookmarks() {
  const { bookmarks, fetchBookmarks, toggleBookmark } = useArticleStore();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleBookmark = async (id) => {
    await toggleBookmark(id);
    toast.success('Bookmark removed');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <Bookmark className="w-8 h-8 text-yellow-400" /> Bookmarks
        </h1>
        <p className="text-gray-400 mb-8">{bookmarks.length} saved articles</p>
      </motion.div>

      {bookmarks.length === 0 ? (
        <div className="glass-card text-center py-16">
          <Bookmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No bookmarks yet. Save articles from your dashboard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((a) => (
            <ArticleCard key={a._id} article={a} onBookmark={handleBookmark} isBookmarked />
          ))}
        </div>
      )}
    </div>
  );
}
