import { create } from 'zustand';
import { articlesAPI } from '../services/api';

export const useArticleStore = create((set, get) => ({
  articles: [],
  trending: [],
  bookmarks: [],
  feeds: [],
  loading: false,
  pagination: { page: 1, pages: 1, total: 0 },

  fetchArticles: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await articlesAPI.getAll(params);
      set({
        articles: data.articles,
        pagination: { page: data.page, pages: data.pages, total: data.total },
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  fetchTrending: async () => {
    try {
      const { data } = await articlesAPI.getTrending();
      set({ trending: data });
    } catch {
      /* ignore */
    }
  },

  fetchBookmarks: async () => {
    try {
      const { data } = await articlesAPI.getBookmarks();
      set({ bookmarks: data });
    } catch {
      /* ignore */
    }
  },

  fetchFeeds: async () => {
    try {
      const { data } = await articlesAPI.getFeeds();
      set({ feeds: data });
    } catch {
      /* ignore */
    }
  },

  toggleBookmark: async (id) => {
    const { data } = await articlesAPI.toggleBookmark(id);
    if (data.bookmarked) {
      const article = get().articles.find((a) => a._id === id);
      if (article) set((s) => ({ bookmarks: [...s.bookmarks, article] }));
    } else {
      set((s) => ({ bookmarks: s.bookmarks.filter((b) => b._id !== id) }));
    }
    return data;
  },
}));
