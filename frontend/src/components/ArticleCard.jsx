import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Bookmark, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from '../utils/date';

export default function ArticleCard({ article, onBookmark, isBookmarked }) {
  return (
    <article className="glass-card group animate-slide-up">
      {article.imageUrl && (
        <div className="relative h-48 -mx-6 -mt-6 mb-4 rounded-t-2xl overflow-hidden">
          <img
            src={article.imageUrl}
            alt=""
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {article.category && (
            <span className="absolute top-3 left-3 px-2 py-1 text-xs font-medium bg-primary-500/80 text-white rounded-lg capitalize">
              {article.category}
            </span>
          )}
        </div>
      )}

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-100 group-hover:text-primary-300 transition-colors line-clamp-2">
          <Link to={`/article/${article._id}`}>{article.title}</Link>
        </h3>

        {(article.aiSummary || article.excerpt) && (
          <p className="text-sm text-gray-400 line-clamp-3">
            {article.aiSummary || article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {article.feed?.title && <span>{article.feed.title}</span>}
            {article.publishedAt && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(article.publishedAt)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {article.aiSummary && (
              <Sparkles className="w-4 h-4 text-accent-400" title="AI Summary available" />
            )}
            {onBookmark && (
              <button
                onClick={() => onBookmark(article._id)}
                className={`p-1.5 rounded-lg transition-colors ${
                  isBookmarked ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-500 hover:text-yellow-400 hover:bg-white/5'
                }`}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
            )}
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-gray-500 hover:text-primary-400 hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
