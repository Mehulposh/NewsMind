import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Sparkles, Loader2 } from 'lucide-react';
import { searchAPI } from '../services/api';
import ArticleCard from '../components/ArticleCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await searchAPI.search(query);
      setResults(data.results);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <Sparkles className="w-10 h-10 text-accent-400 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Semantic Search</h1>
        <p className="text-gray-400">Search news by meaning, powered by vector embeddings</p>
      </motion.div>

      <form onSubmit={handleSearch} className="relative mb-10">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input-glass pl-12 pr-32 py-4 text-lg"
          placeholder="Ask anything... e.g. 'latest AI breakthroughs'"
        />
        <button type="submit" disabled={loading} className="absolute right-2 top-1/2 -translate-y-1/2 btn-primary text-sm py-2.5">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </button>
      </form>

      {loading && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-400 mx-auto" />
          <p className="text-gray-400 mt-3">Searching with vector embeddings...</p>
        </div>
      )}

      {!loading && searched && (
        <div>
          <p className="text-sm text-gray-400 mb-6">{results.length} results for "{query}"</p>
          <div className="space-y-4">
            {results.map((article) => (
              <div key={article._id} className="relative">
                <ArticleCard article={article} />
                {article.score && (
                  <span className="absolute top-4 right-4 px-2 py-1 text-xs bg-accent-500/20 text-accent-400 rounded-lg">
                    {(article.score * 100).toFixed(0)}% match
                  </span>
                )}
              </div>
            ))}
          </div>
          {results.length === 0 && (
            <div className="glass-card text-center py-12">
              <p className="text-gray-400">No results found. Try different keywords or phrases.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
