import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    desc: 'Perfect for casual readers',
    features: ['RSS feed aggregation', 'Basic keyword search', '5 AI summaries/day', 'Bookmark articles', 'Dark/light themes'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: '/month',
    desc: 'For power users who want more',
    features: ['Everything in Free', 'Unlimited semantic search', 'RAG chatbot access', 'AI newsletters', 'Personalized recommendations', 'Custom RSS feeds', 'Topic clustering'],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$29',
    period: '/month',
    desc: 'For teams and organizations',
    features: ['Everything in Pro', 'Admin dashboard', 'Analytics & insights', 'API access', 'Priority support', 'Custom integrations', 'Team management'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">Simple Pricing</h1>
        <p className="text-gray-400 text-lg">Choose the plan that fits your news consumption needs.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`glass-card relative ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
          >
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-xs font-bold rounded-full">
                MOST POPULAR
              </span>
            )}
            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">{plan.price}</span>
              <span className="text-gray-400">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-accent-400 mt-0.5 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              to="/register"
              className={`block text-center w-full py-3 rounded-xl font-medium transition-all ${
                plan.popular ? 'btn-primary' : 'btn-secondary'
              }`}
            >
              {plan.cta}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
