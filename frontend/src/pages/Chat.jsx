import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Loader2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { searchAPI } from '../services/api';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await searchAPI.chat(userMsg, sessionId);
      if (!sessionId) setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer, sources: data.sources }]);
    } catch {
      toast.error('Failed to get response');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  const suggestions = [
    'What are the latest tech news?',
    'Summarize today\'s top headlines',
    'Any news about artificial intelligence?',
    'What\'s happening in global politics?',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col" style={{ minHeight: '75vh' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-1 flex items-center justify-center gap-2">
          <Bot className="w-8 h-8 text-primary-400" /> NewsMind AI Chat
        </h1>
        <p className="text-gray-400 text-sm">RAG-powered assistant with live news context</p>
      </motion.div>

      <div className="flex-1 glass-card flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '60vh' }}>
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-6">Ask me anything about current news</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => setInput(s)} className="px-3 py-1.5 glass rounded-full text-xs text-gray-400 hover:text-white transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="p-2 rounded-lg bg-primary-500/20 h-fit"><Bot className="w-4 h-4 text-primary-400" /></div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user' ? 'bg-primary-500/30 text-white' : 'bg-white/5 text-gray-300'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.sources?.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                    <p className="text-xs text-gray-500">Sources:</p>
                    {msg.sources.map((s, j) => (
                      <a key={j} href={s.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent-400 hover:underline">
                        <ExternalLink className="w-3 h-3" /> {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="p-2 rounded-lg bg-accent-500/20 h-fit"><User className="w-4 h-4 text-accent-400" /></div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="p-2 rounded-lg bg-primary-500/20"><Bot className="w-4 h-4 text-primary-400" /></div>
              <div className="bg-white/5 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t border-white/10 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-glass flex-1"
            placeholder="Ask about current news..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4">
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
