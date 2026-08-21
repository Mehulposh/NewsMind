import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  { q: 'What is NewsMind AI?', a: 'NewsMind AI is an intelligent news aggregation platform that combines RSS feeds with AI-powered features like semantic search, RAG chatbot, AI summaries, and personalized recommendations.' },
  { q: 'How does semantic search work?', a: 'We use Voyage AI embeddings to convert articles into vector representations stored in MongoDB Atlas Vector Search. When you search, your query is embedded and matched against articles by semantic similarity, not just keywords.' },
  { q: 'What AI models power NewsMind?', a: 'NewsMind uses Groq (Llama 3.3 70B) for text generation and summarization, Voyage AI for embeddings, and LangChain for orchestrating the RAG pipeline.' },
  { q: 'Is my data secure?', a: 'Yes. We use JWT authentication, encrypted connections, and never share your reading data. OAuth login via Google is also supported.' },
  { q: 'How do AI newsletters work?', a: 'Based on your reading history and topic preferences, our AI curates relevant articles and generates a personalized HTML newsletter digest you can view anytime.' },
  { q: 'Can I add my own RSS feeds?', a: 'Absolutely! Registered users can add custom RSS feeds which are automatically processed with AI summaries and embeddings.' },
  { q: 'What is duplicate detection?', a: 'Using embedding cosine similarity, we detect when multiple sources publish the same story and mark duplicates so you see unique content.' },
  { q: 'Is there a free plan?', a: 'Yes! Our free plan includes RSS aggregation, basic search, and limited AI features. Pro and Enterprise plans unlock full semantic search, unlimited chat, and newsletters.' },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 gradient-text">Frequently Asked Questions</h1>
        <p className="text-gray-400">Everything you need to know about NewsMind AI.</p>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card !p-0 overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <span className="font-medium pr-4">{faq.q}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${open === i ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
