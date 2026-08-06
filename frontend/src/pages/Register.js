import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, UserPlus, TrendingUp, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email address.');
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
          <h3 className="fw-bold text-white mb-1">Create Account</h3>
          <p className="text-muted small mb-0">Start your trading journey with $10,000 demo cash</p>
        </div>

        {error && (
          <div className="alert alert-danger-custom py-2 px-3 small mb-4 d-flex align-items-center gap-2">
            <AlertCircle size={18} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Full Name</label>
            <div className="input-group">
              <span className="input-group-text input-group-text-dark border-end-0">
                <User size={16} className="text-muted" />
              </span>
              <input
                className="form-control form-control-dark border-start-0 ps-0"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
            ) : <UserPlus size={18} />}
            <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small text-muted mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-primary fw-semibold text-decoration-none ms-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
