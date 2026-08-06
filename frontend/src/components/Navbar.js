import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  TrendingUp,
  BarChart2,
  PieChart,
  Shield,
  LogOut,
  Wallet,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand-custom" to="/">
          <div className="brand-icon-wrapper">
            <TrendingUp size={22} color="#ffffff" />
          </div>
          <span>StockTrader</span>
        </Link>
        
        <button 
          className="navbar-toggler border-0 text-white" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          style={{ focus: 'none' }}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-1">
            <li className="nav-item">
              <Link className={`nav-link-custom ${isActive('/') ? 'active' : ''}`} to="/">
                <BarChart2 size={18} />
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link-custom ${isActive('/market') ? 'active' : ''}`} to="/market">
                <TrendingUp size={18} />
                <span>Market</span>
              </Link>
            </li>
            {user && (
              <li className="nav-item">
                <Link className={`nav-link-custom ${isActive('/portfolio') ? 'active' : ''}`} to="/portfolio">
                  <PieChart size={18} />
                  <span>Portfolio</span>
                </Link>
              </li>
            )}
            {user && user.role === 'ADMIN' && (
              <li className="nav-item">
                <Link className={`nav-link-custom ${isActive('/admin') ? 'active' : ''}`} to="/admin">
                  <Shield size={18} />
                  <span>Admin</span>
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-3">
                <div className="balance-pill d-none d-md-flex">
                  <Wallet size={16} className="text-primary" />
                  <div>
                    <span className="text-dim me-2 small" style={{ fontSize: '0.75rem' }}>BALANCE</span>
                    <span className="balance-amount">
                      ${(user.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <div className="dropdown">
                  <button 
                    className="btn border-0 p-1 d-flex align-items-center gap-2 bg-transparent text-white" 
                    type="button" 
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div 
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" 
                      style={{ 
                        width: '36px', 
                        height: '36px', 
                        fontSize: '15px',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
                      }}
                    >
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="fw-semibold small d-none d-md-inline me-1">{user.name}</span>
                    <ChevronDown size={14} className="text-muted" />
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark-custom mt-2">
                    <li className="px-3 py-2 border-bottom border-secondary border-opacity-25">
                      <div className="small text-muted" style={{ fontSize: '0.75rem' }}>SIGNED IN AS</div>
                      <div className="fw-bold text-truncate" style={{ maxWidth: '180px' }}>{user.email}</div>
                      <span className="badge bg-primary bg-opacity-25 text-primary small mt-1">{user.role}</span>
                    </li>
                    <li className="mt-1">
                      <button 
                        className="dropdown-item dropdown-item-custom text-danger d-flex align-items-center gap-2" 
                        onClick={handleLogout}
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link className="btn-secondary-custom btn-sm" to="/login">Sign In</Link>
                <Link className="btn-primary-custom btn-sm" to="/register">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
