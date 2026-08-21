import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, FileText, Rss, Copy, RefreshCw } from 'lucide-react';
import { featuresAPI } from '../services/api';
import toast from 'react-hot-toast';

export default function Admin() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      featuresAPI.getAnalytics(),
      featuresAPI.getUsers(),
      featuresAPI.getDuplicates(),
    ])
      .then(([analyticsRes, usersRes, dupRes]) => {
        setAnalytics(analyticsRes.data);
        setUsers(usersRes.data);
        setDuplicates(dupRes.data || []);
      })
      .catch(() => toast.error('Failed to load admin data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  const stats = [
    { icon: FileText, label: 'Total Articles', value: analytics?.totalArticles || 0, color: 'text-primary-400' },
    { icon: Rss, label: 'Active Feeds', value: analytics?.totalFeeds || 0, color: 'text-accent-400' },
    { icon: Users, label: 'Total Users', value: analytics?.totalUsers || 0, color: 'text-green-400' },
    { icon: Copy, label: 'Duplicates Detected', value: analytics?.duplicatesDetected || 0, color: 'text-yellow-400' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
          <BarChart3 className="w-8 h-8 text-primary-400" /> Admin Dashboard
        </h1>
        <p className="text-gray-400 mb-8">Platform analytics and management</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="glass-card">
            <Icon className={`w-6 h-6 ${color} mb-2`} />
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            <p className="text-sm text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="glass-card">
          <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
          <div className="space-y-3">
            {analytics?.categoryBreakdown?.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between">
                <span className="capitalize text-sm text-gray-300">{cat._id || 'Unknown'}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                      style={{ width: `${Math.min(100, (cat.count / (analytics.totalArticles || 1)) * 100 * 5)}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8 text-right">{cat.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Users */}
        <div className="glass-card">
          <h2 className="text-lg font-semibold mb-4">Recent Users</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {users.slice(0, 10).map((u) => (
              <div key={u._id} className="flex items-center justify-between py-2 border-b border-white/5">
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-gray-400'}`}>
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Recent Activity
          </h2>
          <div className="space-y-2">
            {analytics?.recentActivity?.map((a) => (
              <div key={a._id} className="text-sm py-2 border-b border-white/5">
                <p className="text-gray-300 line-clamp-1">{a.title}</p>
                <p className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Duplicates */}
        <div className="glass-card">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Copy className="w-4 h-4" /> Duplicate Detection
          </h2>
          {duplicates.length === 0 ? (
            <p className="text-gray-400 text-sm">No duplicates detected yet.</p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {duplicates.slice(0, 10).map((d) => (
                <div key={d._id} className="text-sm py-2 border-b border-white/5">
                  <p className="text-gray-300 line-clamp-1">{d.title}</p>
                  <p className="text-xs text-gray-500">Duplicate of: {d.duplicateOf?.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
