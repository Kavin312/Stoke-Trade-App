import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, TrendingUp, KeyRound, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('admin@stocktrader.com');
    setPassword('admin123');
    setError('');
    setLoading(true);
    try {
      await login('admin@stocktrader.com', 'admin123');
      navigate('/');
    } catch (err) {
      setError('Demo login failed. Make sure backend and database are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card-dark">
        {/* Brand Header */}
        <div className="text-center mb-4">
          <div className="brand-icon-wrapper mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
            <TrendingUp size={26} color="#ffffff" />
          </div>
          <h3 className="fw-bold text-white mb-1">Welcome Back</h3>
          <p className="text-muted small mb-0">Sign in to your StockTrader account</p>
        </div>

        {error && (
          <div className="alert alert-danger-custom py-2 px-3 small mb-4 d-flex align-items-center gap-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Email Address</label>
            <div className="input-group">
              <span className="input-group-text input-group-text-dark border-end-0">
                <Mail size={16} className="text-muted" />
              </span>
              <input
                type="email"
                className="form-control form-control-dark border-start-0 ps-0"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Password</label>
            <div className="input-group">
              <span className="input-group-text input-group-text-dark border-end-0">
                <Lock size={16} className="text-muted" />
              </span>
              <input
                type="password"
                className="form-control form-control-dark border-start-0 ps-0"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-primary-custom w-100 py-2 fw-bold" 
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : <LogIn size={18} />}
            <span>{loading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 text-center">
          <button 
            type="button" 
            className="btn-secondary-custom btn-sm w-100 justify-content-center"
            onClick={handleDemoLogin}
            disabled={loading}
          >
            <KeyRound size={16} className="text-primary" />
            <span>One-Click Demo Admin Login</span>
          </button>
        </div>

        <div className="text-center mt-4">
          <p className="small text-muted mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary fw-semibold text-decoration-none ms-1">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
