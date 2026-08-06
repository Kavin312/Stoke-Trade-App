import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Wallet,
  Lock,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const StockDetail = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const [stock, setStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchStock = useCallback(async () => {
    try {
      const res = await api.get(`/stocks/${id}`);
      setStock(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    fetchStock();
    const interval = setInterval(fetchStock, 5000);
    return () => clearInterval(interval);
  }, [fetchStock]);

  const handleTrade = async (type) => {
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await api.post(`/trade/${type}`, { stockId: id, quantity: Number(quantity) });
      setMessage(`Successfully ${type === 'buy' ? 'bought' : 'sold'} ${quantity} share(s) of ${stock?.symbol}`);
      await refreshUser();
      await fetchStock();
    } catch (err) {
      setError(err.response?.data?.message || 'Trade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!stock) return (
    <div className="container mt-5 text-center py-5">
      <div className="spinner-border spinner-dark" role="status">
        <span className="visually-hidden">Loading asset data...</span>
      </div>
    </div>
  );

  const isUp = (stock.changePercent || 0) >= 0;
  const chartColor = isUp ? '#0ecb81' : '#f6465d';
  const historyData = stock.history && stock.history.length > 0 ? stock.history : [{ price: stock.price, date: new Date() }];

  const chartData = {
    labels: historyData.slice(-30).map((h) => new Date(h.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [
      {
        label: 'Price ($)',
        data: historyData.slice(-30).map((h) => h.price),
        borderColor: chartColor,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, isUp ? 'rgba(14, 203, 129, 0.25)' : 'rgba(246, 70, 93, 0.25)');
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: chartColor,
        borderWidth: 2.5
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#171d2b',
        titleColor: '#ffffff',
        bodyColor: '#0ecb81',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: false
      }
    },
    scales: {
      x: { display: false },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#9ca3af', font: { size: 11 } }
      }
    }
  };

  return (
    <div className="container mt-4 pb-5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/market" className="text-muted text-decoration-none small">Market</Link>
          </li>
          <li className="breadcrumb-item active text-white small" aria-current="page">
            {stock.symbol}
          </li>
        </ol>
      </nav>

      <div className="row g-4">
        {/* Left Column: Asset Detail Header & Chart */}
        <div className="col-lg-8">
          <div className="trade-card p-4 mb-4">
            <div className="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <div 
                    className="fw-bold rounded-2 d-flex align-items-center justify-content-center text-white" 
                    style={{ width: '52px', height: '40px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', fontSize: '1.1rem' }}
                  >
                    {stock.symbol}
                  </div>
                  <h2 className="fw-bold text-white mb-0 ms-1">{stock.symbol}</h2>
                  <span className="badge bg-secondary bg-opacity-25 text-dim ms-2">{stock.sector || 'Asset'}</span>
                </div>
                <h6 className="text-muted fw-normal mb-0 ms-1">{stock.name}</h6>
              </div>

              <div className="text-start text-sm-end">
                <h2 className="fw-bold text-white mb-1">${(stock.price || 0).toFixed(2)}</h2>
                <div className={`badge ${isUp ? 'badge-up' : 'badge-down'} d-inline-flex align-items-center gap-1`}>
                  {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                  <span>{isUp ? '+' : ''}{stock.changePercent || 0}%</span>
                </div>
              </div>
            </div>

            {/* Interactive Chart */}
            <div style={{ height: '360px' }}>
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Key Metrics Grid */}
            <div className="row mt-4 g-3 text-center border-top border-secondary border-opacity-25 pt-4">
              <div className="col-4">
                <div className="small text-muted mb-1">Prev. Close</div>
                <div className="fw-bold text-white">${(stock.previousClose || stock.price || 0).toFixed(2)}</div>
              </div>
              <div className="col-4">
                <div className="small text-muted mb-1">Day High</div>
                <div className="fw-bold price-up">${(stock.dayHigh || stock.price || 0).toFixed(2)}</div>
              </div>
              <div className="col-4">
                <div className="small text-muted mb-1">Day Low</div>
                <div className="fw-bold price-down">${(stock.dayLow || stock.price || 0).toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Placement Panel */}
        <div className="col-lg-4">
          {user ? (
            <div className="trade-card p-4 sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold text-white mb-4 d-flex align-items-center gap-2">
                <TrendingUp size={20} className="text-primary" />
                <span>Place Order</span>
              </h5>
              
              {message && (
                <div className="alert bg-success bg-opacity-15 text-success border-0 py-2 small mb-4 d-flex align-items-center gap-2">
                  <CheckCircle size={16} />
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="alert bg-danger bg-opacity-15 text-danger border-0 py-2 small mb-4 d-flex align-items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Quantity (Shares)</label>
                <div className="input-group">
                  <button 
                    className="btn btn-secondary-custom px-3" 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    className="form-control form-control-dark text-center fw-bold fs-5"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button 
                    className="btn btn-secondary-custom px-3" 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="d-flex gap-2 mb-4">
                {[1, 5, 10, 50].map((preset) => (
                  <button
                    key={preset}
                    className={`btn btn-sm flex-fill fw-bold ${
                      quantity === preset
                        ? 'btn-primary text-white'
                        : 'btn-outline-secondary border-secondary border-opacity-25 text-dim'
                    }`}
                    onClick={() => setQuantity(preset)}
                  >
                    +{preset}
                  </button>
                ))}
              </div>

              {/* Order Calculations */}
              <div className="p-3 rounded-3 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted small">Current Price</span>
                  <span className="fw-bold text-white">${(stock.price || 0).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-muted small">Estimated Total</span>
                  <span className="fw-bold text-primary fs-5">${((stock.price || 0) * quantity).toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <button 
                  className="btn-success-custom w-100 py-2 fw-bold" 
                  onClick={() => handleTrade('buy')}
                  disabled={loading}
                >
                  {loading ? 'Executing Trade...' : 'Buy Asset'}
                </button>
                <button 
                  className="btn-danger-custom w-100 py-2 fw-bold" 
                  onClick={() => handleTrade('sell')}
                  disabled={loading}
                >
                  {loading ? 'Executing Trade...' : 'Sell Asset'}
                </button>
              </div>

              {/* Available Cash Balance */}
              <div className="mt-4 pt-3 border-top border-secondary border-opacity-25">
                <div className="d-flex justify-content-between align-items-center small">
                  <span className="text-muted d-flex align-items-center gap-1">
                    <Wallet size={14} className="text-primary" /> Available Cash
                  </span>
                  <span className="fw-bold text-success">${(user.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="trade-card p-4 text-center">
              <div className="mx-auto p-3 rounded-circle mb-3" style={{ width: '56px', height: '56px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={26} className="text-primary" />
              </div>
              <h5 className="fw-bold text-white mb-2">Sign In to Trade</h5>
              <p className="text-muted small mb-4">Join StockTrader to trade real-time assets and manage your portfolio.</p>
              <Link to="/login" className="btn-primary-custom w-100">Sign In Now</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockDetail;
