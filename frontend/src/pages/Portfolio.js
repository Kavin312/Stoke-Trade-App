import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  Wallet,
  PieChart,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3
} from 'lucide-react';

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPortfolio = async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/portfolio');
      setData(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to refresh portfolio data.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    const interval = setInterval(fetchPortfolio, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div className="container mt-5 text-center py-5">
      <div className="spinner-border spinner-dark" role="status">
        <span className="visually-hidden">Loading portfolio...</span>
      </div>
    </div>
  );

  if (error && !data) return (
    <div className="container mt-5">
      <div className="alert bg-danger bg-opacity-15 text-danger border-0">{error}</div>
    </div>
  );

  const holdings = data?.holdings || [];
  const totalValue = data?.totalValue || 0;
  const balance = data?.balance || 0;
  const profitLoss = data?.profitLoss || 0;
  const totalInvested = data?.totalInvested || 0;
  const profitLossPercent = totalInvested > 0 ? (((totalValue - totalInvested) / totalInvested) * 100).toFixed(2) : '0.00';
  const isProfit = profitLoss >= 0;

  return (
    <div className="container mt-4 pb-5">
      {/* Portfolio Header */}
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-white d-flex align-items-center gap-2">
            <PieChart className="text-primary" />
            <span>My Portfolio</span>
          </h2>
          <p className="text-muted mb-0">Real-time performance and asset allocation</p>
        </div>
        <div>
          <button 
            className="btn-secondary-custom btn-sm" 
            onClick={fetchPortfolio}
            disabled={refreshing}
          >
            <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="stat-card-dark">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="stat-label">Available Cash</span>
              <div className="p-2 rounded-3" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
                <Wallet size={18} className="text-primary" />
              </div>
            </div>
            <div className="stat-value">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <span className="small text-dim">Ready for trading</span>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card-dark">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="stat-label">Total Portfolio Value</span>
              <div className="p-2 rounded-3" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
                <PieChart size={18} style={{ color: '#8b5cf6' }} />
              </div>
            </div>
            <div className="stat-value">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <span className="small text-dim">Cash + Holdings</span>
          </div>
        </div>

        <div className="col-md-4">
          <div className="stat-card-dark">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="stat-label">Total Profit / Loss</span>
              <div className="p-2 rounded-3" style={{ background: isProfit ? 'rgba(14, 203, 129, 0.15)' : 'rgba(246, 70, 93, 0.15)' }}>
                {isProfit ? <TrendingUp size={18} className="price-up" /> : <TrendingDown size={18} className="price-down" />}
              </div>
            </div>
            <div className="d-flex align-items-baseline gap-2">
              <div className={`stat-value ${isProfit ? 'price-up' : 'price-down'}`}>
                {isProfit ? '+' : ''}${Math.abs(profitLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className={`badge ${isProfit ? 'badge-up' : 'badge-down'} d-inline-flex align-items-center gap-1`}>
                {isProfit ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                <span>{profitLossPercent}%</span>
              </span>
            </div>
            <span className="small text-dim">Unrealized return</span>
          </div>
        </div>
      </div>

      {/* Holdings Table Card */}
      <div className="trade-card overflow-hidden">
        <div className="p-4 border-bottom border-secondary border-opacity-25 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            <span>Current Holdings</span>
          </h5>
          <span className="badge bg-secondary bg-opacity-25 text-dim">{holdings.length} Assets</span>
        </div>

        <div className="table-responsive">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th className="ps-4">Asset</th>
                <th>Quantity</th>
                <th>Avg Buy Price</th>
                <th>Current Price</th>
                <th>Market Value</th>
                <th>Profit / Loss</th>
                <th className="pe-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => {
                const isHoldingProfit = (h.profitLoss || 0) >= 0;
                return (
                  <tr key={h.symbol}>
                    <td className="ps-4">
                      <Link to={`/stocks/${h.stock || h.symbol}`} className="text-decoration-none d-flex align-items-center gap-2">
                        <div 
                          className="fw-bold rounded-2 d-flex align-items-center justify-content-center text-white small" 
                          style={{ width: '45px', height: '34px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                        >
                          {h.symbol}
                        </div>
                      </Link>
                    </td>
                    <td className="fw-bold text-white">{h.quantity}</td>
                    <td className="fw-semibold text-white opacity-75">${(h.avgBuyPrice || 0).toFixed(2)}</td>
                    <td className="fw-bold text-white">${(h.currentPrice || 0).toFixed(2)}</td>
                    <td className="fw-bold text-white">${(h.marketValue || 0).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${isHoldingProfit ? 'badge-up' : 'badge-down'} d-inline-flex align-items-center gap-1`}>
                        {isHoldingProfit ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        <span>{isHoldingProfit ? '+' : ''}${(h.profitLoss || 0).toFixed(2)} ({h.profitLossPercent || '0.00'}%)</span>
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <Link to={`/stocks/${h.stock || h.symbol}`} className="btn-secondary-custom btn-sm">
                        <span>Trade</span>
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {holdings.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <div className="mx-auto p-3 rounded-circle mb-3" style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PieChart size={28} className="text-muted" />
                    </div>
                    <h6 className="text-white fw-bold">No Positions Open</h6>
                    <p className="text-muted small mb-3">You don't own any stock shares in your portfolio yet.</p>
                    <Link to="/market" className="btn-primary-custom btn-sm">
                      <span>Explore Market</span>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
