import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updatePreferences: (data) => api.put('/auth/preferences', data),
};

// Articles
export const articlesAPI = {
  getAll: (params) => api.get('/articles', { params }),
  getById: (id) => api.get(`/articles/${id}`),
  getTrending: () => api.get('/articles/trending'),
  summarize: (id) => api.get(`/articles/${id}/summary`),
  toggleBookmark: (id) => api.post(`/articles/${id}/bookmark`),
  getBookmarks: () => api.get('/articles/bookmarks'),
  getFeeds: () => api.get('/articles/feeds'),
  addFeed: (data) => api.post('/articles/feeds', data),
};

// Search & Chat
export const searchAPI = {
  search: (q, limit) => api.get('/search', { params: { q, limit } }),
  chat: (message, sessionId) => api.post('/search/chat', { message, sessionId }),
  getSessions: () => api.get('/search/chat/sessions'),
  getHistory: (sessionId) => api.get(`/search/chat/${sessionId}`),
};

// Admin & Features
export const featuresAPI = {
  getRecommendations: () => api.get('/recommendations'),
  getTrendingTopics: () => api.get('/trending-topics'),
  getClusters: () => api.get('/clusters'),
  generateNewsletter: () => api.post('/newsletter'),
  getNewsletters: () => api.get('/newsletters'),
  getAnalytics: () => api.get('/analytics'),
  getUsers: () => api.get('/users'),
  getDuplicates: () => api.get('/duplicates'),
};
