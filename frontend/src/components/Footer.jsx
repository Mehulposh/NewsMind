import { Link } from 'react-router-dom';
import { Brain, Github, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass border-x-0 border-b-0 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-6 h-6 text-primary-400" />
              <span className="text-lg font-bold gradient-text">NewsMind AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              AI-powered intelligent news aggregation with semantic search and RAG assistant.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200 mb-3">Product</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/features" className="block hover:text-primary-400 transition-colors">Features</Link>
              <Link to="/pricing" className="block hover:text-primary-400 transition-colors">Pricing</Link>
              <Link to="/dashboard" className="block hover:text-primary-400 transition-colors">Dashboard</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200 mb-3">Resources</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/faq" className="block hover:text-primary-400 transition-colors">FAQ</Link>
              <Link to="/about" className="block hover:text-primary-400 transition-colors">About</Link>
              <Link to="/search" className="block hover:text-primary-400 transition-colors">Semantic Search</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-200 mb-3">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"><Github className="w-5 h-5 text-gray-400" /></a>
              <a href="#" className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"><Twitter className="w-5 h-5 text-gray-400" /></a>
              <a href="#" className="p-2 glass rounded-lg hover:bg-white/10 transition-colors"><Mail className="w-5 h-5 text-gray-400" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} NewsMind AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
