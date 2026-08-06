import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { Search, TrendingUp, ArrowUpRight, ArrowDownRight, ChevronRight, Filter } from 'lucide-react';

const Market = () => {
  const [stocks, setStocks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchStocks = async (q = '') => {
    try {
      const res = await api.get('/stocks', { params: q ? { search: q } : {} });
      setStocks(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(() => fetchStocks(search), 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Extract unique sectors
  const sectors = ['All', ...new Set(stocks.map((s) => s.sector).filter(Boolean))];

  const filteredStocks = stocks.filter((s) => {
    if (selectedSector !== 'All' && s.sector !== selectedSector) return false;
    return true;
  });

  return (
    <div className="container mt-4 pb-5">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-white d-flex align-items-center gap-2">
            <TrendingUp className="text-primary" />
            <span>Market Explorer</span>
          </h2>
          <p className="text-muted mb-0">Discover, filter, and analyze real-time market assets</p>
        </div>

        {/* Search Bar */}
        <div style={{ minWidth: '320px' }}>
          <div className="input-group">
            <span className="input-group-text input-group-text-dark border-end-0">
              <Search size={18} className="text-muted" />
            </span>
            <input
              className="form-control form-control-dark border-start-0 ps-0"
              placeholder="Search symbol or company name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Sector Filter Badges */}
      {sectors.length > 1 && (
        <div className="d-flex align-items-center gap-2 mb-4 overflow-auto pb-2">
          <span className="small text-muted fw-bold text-uppercase me-1 d-flex align-items-center gap-1">
            <Filter size={14} /> Sector:
          </span>
          {sectors.map((sec) => (
            <button
              key={sec}
              className={`btn btn-sm rounded-pill fw-semibold ${
                selectedSector === sec
                  ? 'btn-primary text-white'
                  : 'btn-outline-secondary border-secondary border-opacity-25 text-dim'
              }`}
              onClick={() => setSelectedSector(sec)}
            >
              {sec}
            </button>
          ))}
        </div>
      )}

      {/* Table Container */}
      <div className="trade-card overflow-hidden">
        <div className="table-responsive">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th className="ps-4">Asset</th>
                <th>Company Name</th>
                <th>Sector</th>
                <th>Market Price</th>
                <th>24h Change</th>
                <th className="pe-4 text-end">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading && stocks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <div className="spinner-border spinner-dark" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredStocks.map((s) => {
                  const isUp = (s.changePercent || 0) >= 0;
                  return (
                    <tr key={s._id}>
                      <td className="ps-4">
                        <Link to={`/stocks/${s._id}`} className="text-decoration-none d-flex align-items-center gap-2">
                          <div 
                            className="fw-bold rounded-2 d-flex align-items-center justify-content-center text-white small" 
                            style={{ width: '45px', height: '34px', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                          >
                            {s.symbol}
                          </div>
                        </Link>
                      </td>
                      <td className="fw-bold text-white">{s.name}</td>
                      <td>
                        <span className="badge bg-secondary bg-opacity-25 text-dim fw-semibold">
                          {s.sector || 'N/A'}
                        </span>
                      </td>
                      <td className="fw-bold text-white">${(s.price || 0).toFixed(2)}</td>
                      <td>
                        <span className={`badge ${isUp ? 'badge-up' : 'badge-down'} d-inline-flex align-items-center gap-1`}>
                          {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          <span>{isUp ? '+' : ''}{s.changePercent || 0}%</span>
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        <Link to={`/stocks/${s._id}`} className="btn-secondary-custom btn-sm">
                          <span>Trade</span>
                          <ChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}

              {!loading && filteredStocks.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    <p className="mb-0">No assets found matching your criteria.</p>
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

export default Market;
