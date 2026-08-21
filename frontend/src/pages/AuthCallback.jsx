import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth, fetchUser } = useAuthStore();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      setAuth(token, { name: 'User' });
      fetchUser().then(() => {
        toast.success('Logged in with Google!');
        navigate('/dashboard');
      });
    } else {
      navigate('/login');
    }
  }, [params, setAuth, fetchUser, navigate]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="glass-card text-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Completing authentication...</p>
      </div>
    </div>
  );
}
