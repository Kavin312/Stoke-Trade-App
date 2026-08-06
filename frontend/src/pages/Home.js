import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  ShieldCheck,
  Activity,
  ChevronRight
} from 'lucide-react';

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStocks = async () => {
    try {
      const res = await api.get('/stocks');
      setStocks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(fetchStocks, 5000);
    return () => clearInterval(interval);
  }, []);

  const gainers = [...stocks].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0)).slice(0, 4);
  const losers = [...stocks].sort((a, b) => (a.changePercent || 0) - (b.changePercent || 0)).slice(0, 4);

  return (
    <div className="pb-5">
      {/* Live Ticker Bar */}
      {stocks.length > 0 && (
        <div className="ticker-banner">
          <div className="ticker-track">
            {stocks.concat(stocks).map((s, idx) => (
              <Link key={`${s._id}-${idx}`} to={`/stocks/${s._id}`} className="ticker-item">
                <span className="fw-bold">{s.symbol}</span>
                <span className="text-dim">${(s.price || 0).toFixed(2)}</span>
                <span className={(s.changePercent || 0) >= 0 ? 'price-up ms-1' : 'price-down ms-1'}>
                  {(s.changePercent || 0) >= 0 ? '▲' : '▼'} {Math.abs(s.changePercent || 0)}%
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="container">
        {/* Hero Section */}
        <div className="hero-wrapper text-center text-lg-start my-4">
          <div className="hero-glow-1"></div>
          <div className="hero-glow-2"></div>
          
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.25)' }}>
                <Zap size={14} className="text-primary" />
                <span className="small fw-semibold text-primary">Live Simulated Trading Engine</span>
              </div>
              <h1 className="hero-title mb-3">
                Trade Smarter. <br />
                Master the Market.
              </h1>
              <p className="hero-subtitle mb-4">
                Analyze real-time market trends, build your mock portfolio, and practice trading strategies with virtual money risk-free.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start">
                <Link to="/market" className="btn-primary-custom">
                  <span>Explore Market</span>
                  <ChevronRight size={18} />
                </Link>
                <Link to="/portfolio" className="btn-secondary-custom">
                  <span>View Portfolio</span>
                </Link>
              </div>

              {/* Stats Counters */}
              <div className="row g-3 mt-4 pt-3 border-top border-secondary border-opacity-25">
                <div className="col-4">
                  <div className="stat-value">{stocks.length || '10+'}</div>
                  <div className="small text-muted fw-semibold">Listed Assets</div>
                </div>
                <div className="col-4">
                  <div className="stat-value text-primary">5s</div>
                  <div className="small text-muted fw-semibold">Live Ticker</div>
                </div>
                <div className="col-4">
                  <div className="stat-value text-success">$10,000</div>
                  <div className="small text-muted fw-semibold">Demo Credit</div>
                </div>
              </div>
            </div>

            <div className="col-lg-5 d-none d-lg-block text-center position-relative">
              <div className="glass-card p-4 mx-auto" style={{ maxWidth: '380px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="small text-muted fw-bold text-uppercase">Market Sentiment</span>
                  <span className="badge bg-success bg-opacity-25 text-success">BULLISH</span>
                </div>
                <div className="p-3 rounded-3 mb-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold">AAPL</span>
                    <span className="price-up fw-bold">+2.45%</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Apple Inc.</span>
                    <span>$189.50</span>
                  </div>
                </div>
                <div className="p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="fw-bold">NVDA</span>
                    <span className="price-up fw-bold">+4.12%</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>NVIDIA Corp.</span>
                    <span>$125.80</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Gainers & Losers */}
        <div className="row g-4 mt-2">
          <div className="col-md-6">
            <div className="trade-card h-100 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3" style={{ background: 'rgba(14, 203, 129, 0.15)' }}>
                    <TrendingUp size={20} className="price-up" />
                  </div>
                  <h5 className="fw-bold mb-0 text-white">Top Gainers</h5>
                </div>
                <Link to="/market" className="small text-primary text-decoration-none fw-semibold">View All</Link>
              </div>
              <StockList stocks={gainers} loading={loading} isUp={true} />
            </div>
          </div>

          <div className="col-md-6">
            <div className="trade-card h-100 p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="p-2 rounded-3" style={{ background: 'rgba(246, 70, 93, 0.15)' }}>
                    <TrendingDown size={20} className="price-down" />
                  </div>
                  <h5 className="fw-bold mb-0 text-white">Top Losers</h5>
                </div>
                <Link to="/market" className="small text-primary text-decoration-none fw-semibold">View All</Link>
              </div>
              <StockList stocks={losers} loading={loading} isUp={false} />
            </div>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="row g-4 mt-5">
          <div className="col-md-4">
            <div className="trade-card p-4 text-center">
              <div className="mx-auto p-3 rounded-circle mb-3" style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={26} className="text-primary" />
              </div>
              <h5 className="fw-bold text-white mb-2">Live Price Simulation</h5>
              <p className="text-muted small mb-0">Market simulator automatically updates stock trends every 5 seconds to simulate real trading dynamics.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="trade-card p-4 text-center">
              <div className="mx-auto p-3 rounded-circle mb-3" style={{ width: '56px', height: '56px', background: 'rgba(14, 203, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={26} className="price-up" />
              </div>
              <h5 className="fw-bold text-white mb-2">Instant Execution</h5>
              <p className="text-muted small mb-0">Buy and sell assets with zero latency, managing position sizing and cash balances seamlessly.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="trade-card p-4 text-center">
              <div className="mx-auto p-3 rounded-circle mb-3" style={{ width: '56px', height: '56px', background: 'rgba(139, 92, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={26} style={{ color: '#8b5cf6' }} />
              </div>
              <h5 className="fw-bold text-white mb-2">Risk-Free Environment</h5>
              <p className="text-muted small mb-0">Test high-frequency strategies and test your portfolio performance without financial risk.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StockList = ({ stocks, loading, isUp }) => {
  if (loading) return <div className="py-4 text-center text-muted">Loading market assets...</div>;
  if (stocks.length === 0) return <div className="py-4 text-center text-muted">No market data available.</div>;

  return (
    <div className="d-flex flex-column gap-2">
      {stocks.map((s) => (
        <Link 
          key={s._id} 
          to={`/stocks/${s._id}`} 
          className="d-flex justify-content-between align-items-center p-3 rounded-3 text-decoration-none"
          style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.2s ease' }}
        >
          <div className="d-flex align-items-center gap-3">
            <div 
              className="fw-bold rounded-2 d-flex align-items-center justify-content-center text-white small" 
              style={{ width: '48px', height: '38px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}
            >
              {s.symbol}
            </div>
            <div>
              <div className="fw-bold text-white mb-0">{s.name}</div>
              <div className="small text-muted">{s.sector || 'Asset'}</div>
            </div>
          </div>
          <div className="text-end">
            <div className="fw-bold text-white">${(s.price || 0).toFixed(2)}</div>
            <div className={`small fw-bold d-flex align-items-center justify-content-end gap-1 ${ (s.changePercent || 0) >= 0 ? 'price-up' : 'price-down' }`}>
              {(s.changePercent || 0) >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              <span>{(s.changePercent || 0) >= 0 ? '+' : ''}{s.changePercent || 0}%</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Home;
