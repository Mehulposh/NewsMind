import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { useThemeStore } from './store/themeStore';

import Home from './pages/Home';
import Features from './pages/Features';
import FAQ from './pages/FAQ';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import ArticleDetail from './pages/ArticleDetail';
import Bookmarks from './pages/Bookmarks';
import AuthCallback from './pages/AuthCallback';

export default function App() {
  const { theme } = useThemeStore();

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'gradient-bg text-gray-100' : 'gradient-bg-light text-gray-900'}`}>
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/search" element={<Search />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
