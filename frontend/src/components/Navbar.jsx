import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, Brain, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/features', label: 'Features' },
  { to: '/dashboard', label: 'Dashboard', auth: true },
  { to: '/search', label: 'Search' },
  { to: '/chat', label: 'AI Chat', auth: true },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
  { to: '/faq', label: 'FAQ' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();

  const visibleLinks = navLinks.filter((l) => !l.auth || user);

  return (
    <nav className="glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">NewsMind AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'text-primary-400 bg-white/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn-secondary text-sm py-2 px-4">Admin</Link>
                )}
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <User className="w-4 h-4" /> {user.name}
                </span>
                <button onClick={logout} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            <button className="md:hidden p-2 rounded-lg hover:bg-white/10" onClick={() => setOpen(!open)}>
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in">
            {visibleLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-300 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="block px-3 py-2 text-primary-400">Login</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="block px-3 py-2 text-accent-400">Sign Up</Link>
              </>
            )}
            {user && (
              <button onClick={() => { logout(); setOpen(false); }} className="block w-full text-left px-3 py-2 text-red-400">
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
