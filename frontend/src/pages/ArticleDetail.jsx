import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Sparkles, Bookmark, Clock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { articlesAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { formatDistanceToNow, formatDate } from '../utils/date';

export default function ArticleDetail() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [article, setArticle] = useState(null);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    articlesAPI.getById(id).then(({ data }) => {
      setArticle(data);
      if (data.aiSummary) setSummary(data.aiSummary);
    }).catch(() => toast.error('Article not found'));
  }, [id]);

  const handleSummarize = async () => {
    setLoadingSummary(true);
    try {
      const { data } = await articlesAPI.summarize(id);
      setSummary(data.summary);
    } catch {
      toast.error('Failed to generate summary');
    }
    setLoadingSummary(false);
  };

  const handleBookmark = async () => {
    if (!user) { toast.error('Login required'); return; }
    try {
      const { data } = await articlesAPI.toggleBookmark(id);
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? 'Bookmarked!' : 'Removed bookmark');
    } catch {
      toast.error('Failed to bookmark');
    }
  };

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-400 mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        {article.imageUrl && (
          <img src={article.imageUrl} alt="" className="w-full h-64 object-cover rounded-xl mb-6" onError={(e) => { e.target.style.display = 'none'; }} />
        )}

        <div className="flex items-center gap-3 mb-4 text-sm text-gray-400">
          {article.category && <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-lg capitalize">{article.category}</span>}
          {article.feed?.title && <span>{article.feed.title}</span>}
          {article.publishedAt && (
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDistanceToNow(article.publishedAt)}</span>
          )}
        </div>

        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>

        {article.author && <p className="text-gray-400 text-sm mb-4">By {article.author}</p>}

        <div className="flex gap-3 mb-6">
          <button onClick={handleSummarize} disabled={loadingSummary} className="btn-secondary text-sm flex items-center gap-2">
            {loadingSummary ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {summary ? 'Regenerate Summary' : 'AI Summary'}
          </button>
          <button onClick={handleBookmark} className={`btn-secondary text-sm flex items-center gap-2 ${bookmarked ? 'text-yellow-400' : ''}`}>
            <Bookmark className="w-4 h-4" fill={bookmarked ? 'currentColor' : 'none'} /> Bookmark
          </button>
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm flex items-center gap-2">
            <ExternalLink className="w-4 h-4" /> Original
          </a>
        </div>

        {summary && (
          <div className="p-4 rounded-xl bg-accent-500/10 border border-accent-500/20 mb-6">
            <h3 className="text-sm font-semibold text-accent-400 mb-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> AI Summary
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">{summary}</p>
          </div>
        )}

        <div className="prose prose-invert max-w-none text-gray-300 text-sm leading-relaxed">
          {article.content ? (
            <div dangerouslySetInnerHTML={{ __html: article.content.slice(0, 5000) }} />
          ) : (
            <p>{article.excerpt || 'No content available.'}</p>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-6">Published {formatDate(article.publishedAt)}</p>
      </motion.article>
    </div>
  );
}
