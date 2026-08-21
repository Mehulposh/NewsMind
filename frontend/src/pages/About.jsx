import { motion } from 'framer-motion';
import { Brain, Target, Users, Rocket } from 'lucide-react';

const values = [
  { icon: Brain, title: 'Intelligence First', desc: 'We believe AI should enhance, not replace, human curiosity and critical thinking.' },
  { icon: Target, title: 'Reduce Overload', desc: 'Our mission is to help people consume news efficiently without missing what matters.' },
  { icon: Users, title: 'User Privacy', desc: 'Your reading habits are yours. We never sell data or compromise on security.' },
  { icon: Rocket, title: 'Continuous Innovation', desc: 'We constantly integrate the latest AI advances to improve your experience.' },
];

const techStack = [
  'React.js', 'Vite', 'Tailwind CSS', 'Zustand', 'Node.js', 'Express.js',
  'MongoDB Atlas', 'Vector Search', 'Groq AI', 'Voyage AI', 'LangChain',
  'Redis', 'Cloudinary', 'JWT', 'OAuth', 'Docker', 'WebSockets',
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">About NewsMind AI</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Transforming traditional news aggregation into an AI-powered knowledge platform.
        </p>
      </motion.div>

      <div className="glass-card max-w-3xl mx-auto mb-16">
        <p className="text-gray-300 leading-relaxed mb-4">
          NewsMind AI was born from a simple observation: traditional RSS readers aggregate news but lack
          intelligent search, personalization, and conversational capabilities. In an era of information overload,
          readers need more than chronological feeds and keyword search.
        </p>
        <p className="text-gray-300 leading-relaxed">
          Our platform combines MERN stack architecture with MongoDB Atlas Vector Search, Voyage AI embeddings,
          Groq-powered language models, and LangChain orchestration to deliver personalized news, AI summaries,
          semantic search, and a RAG-powered conversational assistant — all wrapped in a beautiful glassmorphism interface.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {values.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass-card text-center">
            <Icon className="w-8 h-8 text-primary-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm">{desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold mb-6">Built With</h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {techStack.map((tech) => (
            <span key={tech} className="px-4 py-2 glass rounded-full text-sm text-gray-300">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
