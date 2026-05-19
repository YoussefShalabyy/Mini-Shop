import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';

export default function Login() {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const [email, setEmail] = useState('admin@mailtest.com');
  const [password, setPassword] = useState('Admin123!');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await authApi.login(email, password);
      if (user.role !== 'admin' && user.role !== 'owner') {
        setError('Access denied. Admin accounts only.');
        return;
      }
      setSession(token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message ?? 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <ShoppingBag size={28} color="#fff" />
        </div>
        <h1 className="login-title">Admin Dashboard</h1>
        <p className="login-subtitle">Sign in to manage Mini Shop</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-icon-wrap">
              <Mail size={16} />
              <input
                className="input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <div className="input-icon-wrap" style={{ position: 'relative' }}>
              <Lock size={16} />
              <input
                className="input"
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                style={{ position: 'absolute', right: 40, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', lineHeight: 0 }}
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: 'var(--error)15', border: '1px solid var(--error)44', borderRadius: 8, padding: '10px 14px', color: 'var(--error)', fontSize: 14 }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary w-full" type="submit" disabled={loading} style={{ justifyContent: 'center', marginTop: 4 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
