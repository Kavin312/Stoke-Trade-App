import React, { useEffect, useState } from 'react';
import api from '../api';
import {
  Shield,
  Users,
  BarChart2,
  PlusCircle,
  Trash2,
  UserCheck,
  UserX,
  History,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newStock, setNewStock] = useState({ symbol: '', name: '', price: '', sector: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      const [statsRes, usersRes, stocksRes, txRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users'),
        api.get('/stocks'),
        api.get('/admin/transactions')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data || []);
      setStocks(stocksRes.data || []);
      setTransactions(txRes.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleAddStock = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.post('/stocks', {
        ...newStock,
        price: Number(newStock.price)
      });
      setNewStock({ symbol: '', name: '', price: '', sector: '' });
      setMessage('New stock asset listed successfully!');
      loadAll();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list new stock');
    }
  };

  const handleDeleteStock = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stock asset?')) return;
    try {
      await api.delete(`/stocks/${id}`);
      setMessage('Stock deleted successfully');
      loadAll();
    } catch (err) {
      setError('Failed to delete stock');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      setMessage('User role updated successfully');
      loadAll();
    } catch (err) {
      setError('Failed to update user role');
    }
  };

  if (loading) return (
    <div className="container mt-5 text-center py-5">
      <div className="spinner-border spinner-dark" role="status">
        <span className="visually-hidden">Loading admin dashboard...</span>
      </div>
    </div>
  );

  return (
    <div className="container mt-4 pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1 text-white d-flex align-items-center gap-2">
            <Shield className="text-primary" />
            <span>Admin Console</span>
          </h2>
          <p className="text-muted mb-0">Platform analytics, asset management, and global audit log</p>
        </div>
      </div>

      {/* Admin Stats Grid */}
      {stats && (
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="stat-card-dark">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="stat-label">Registered Traders</span>
                <div className="p-2 rounded-3" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
                  <Users size={18} className="text-primary" />
                </div>
              </div>
              <div className="stat-value">{stats.userCount || 0}</div>
              <span className="small text-dim">Total active user accounts</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card-dark">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="stat-label">Active Market Assets</span>
                <div className="p-2 rounded-3" style={{ background: 'rgba(14, 203, 129, 0.15)' }}>
                  <BarChart2 size={18} className="price-up" />
                </div>
              </div>
              <div className="stat-value">{stats.stockCount || 0}</div>
              <span className="small text-dim">Traded stocks on exchange</span>
            </div>
          </div>

          <div className="col-md-4">
            <div className="stat-card-dark">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="stat-label">Total Executed Trades</span>
                <div className="p-2 rounded-3" style={{ background: 'rgba(139, 92, 246, 0.15)' }}>
                  <History size={18} style={{ color: '#8b5cf6' }} />
                </div>
              </div>
              <div className="stat-value">{stats.txCount || 0}</div>
              <span className="small text-dim">Platform-wide orders</span>
            </div>
          </div>
        </div>
      )}

      {/* List New Asset Card */}
      <div className="trade-card p-4 mb-5">
        <h5 className="mb-4 fw-bold text-white d-flex align-items-center gap-2">
          <PlusCircle size={20} className="text-primary" />
          <span>List New Market Asset</span>
        </h5>

        {message && (
          <div className="alert bg-success bg-opacity-15 text-success border-0 py-2 small mb-4 d-flex align-items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="alert bg-danger bg-opacity-15 text-danger border-0 py-2 small mb-4 d-flex align-items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form className="row g-3" onSubmit={handleAddStock}>
          <div className="col-md-2">
            <label className="form-label small text-muted fw-bold">Symbol</label>
            <input 
              className="form-control form-control-dark" 
              placeholder="e.g. AAPL" 
              required
              value={newStock.symbol}
              onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value.toUpperCase() })} 
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small text-muted fw-bold">Company Name</label>
            <input 
              className="form-control form-control-dark" 
              placeholder="e.g. Apple Inc." 
              required
              value={newStock.name}
              onChange={(e) => setNewStock({ ...newStock, name: e.target.value })} 
            />
          </div>
          <div className="col-md-2">
            <label className="form-label small text-muted fw-bold">Initial Price ($)</label>
            <input 
              type="number" 
              step="0.01" 
              className="form-control form-control-dark" 
              placeholder="150.00" 
              required
              value={newStock.price}
              onChange={(e) => setNewStock({ ...newStock, price: e.target.value })} 
            />
          </div>
          <div className="col-md-3">
            <label className="form-label small text-muted fw-bold">Sector</label>
            <input 
              className="form-control form-control-dark" 
              placeholder="e.g. Technology"
              value={newStock.sector}
              onChange={(e) => setNewStock({ ...newStock, sector: e.target.value })} 
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn-primary-custom w-100 py-2" type="submit">
              <span>List Asset</span>
            </button>
          </div>
        </form>
      </div>

      {/* Asset & User Management Tables */}
      <div className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="trade-card h-100 overflow-hidden">
            <div className="p-4 border-bottom border-secondary border-opacity-25">
              <h5 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
                <BarChart2 size={20} className="text-primary" />
                <span>Asset Management</span>
              </h5>
            </div>
            <div className="table-responsive">
              <table className="table table-custom mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">Asset</th>
                    <th>Price</th>
                    <th className="pe-4 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((s) => (
                    <tr key={s._id}>
                      <td className="ps-4">
                        <div className="fw-bold text-white">{s.symbol}</div>
                        <div className="small text-muted">{s.name}</div>
                      </td>
                      <td className="fw-bold text-white">${(s.price || 0).toFixed(2)}</td>
                      <td className="pe-4 text-end">
                        <button 
                          className="btn btn-sm btn-outline-danger border-0 p-1"
                          onClick={() => handleDeleteStock(s._id)}
                          title="Delete Stock"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="trade-card h-100 overflow-hidden">
            <div className="p-4 border-bottom border-secondary border-opacity-25">
              <h5 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
                <Users size={20} className="text-primary" />
                <span>User Management</span>
              </h5>
            </div>
            <div className="table-responsive">
              <table className="table table-custom mb-0">
                <thead>
                  <tr>
                    <th className="ps-4">User</th>
                    <th>Role</th>
                    <th className="pe-4 text-end">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td className="ps-4">
                        <div className="fw-bold text-white">{u.name}</div>
                        <div className="small text-muted">{u.email}</div>
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'ADMIN' ? 'bg-primary' : 'bg-secondary bg-opacity-25 text-dim'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="pe-4 text-end">
                        <button
                          className={`btn btn-sm ${u.role === 'ADMIN' ? 'btn-outline-warning' : 'btn-outline-primary'} border-0 p-1`}
                          onClick={() => handleRoleChange(u._id, u.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                          title={u.role === 'ADMIN' ? 'Demote to User' : 'Promote to Admin'}
                        >
                          {u.role === 'ADMIN' ? <UserX size={16} /> : <UserCheck size={16} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Global Transaction Feed Card */}
      <div className="trade-card overflow-hidden">
        <div className="p-4 border-bottom border-secondary border-opacity-25">
          <h5 className="mb-0 fw-bold text-white d-flex align-items-center gap-2">
            <History size={20} className="text-primary" />
            <span>Global Transaction Audit Feed</span>
          </h5>
        </div>
        <div className="table-responsive">
          <table className="table table-custom mb-0">
            <thead>
              <tr>
                <th className="ps-4">User</th>
                <th>Asset</th>
                <th>Order Type</th>
                <th>Quantity</th>
                <th>Price per Share</th>
                <th className="pe-4">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td className="ps-4">
                    <div className="fw-bold text-white small">{t.user?.name || 'User'}</div>
                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>{t.user?.email || 'N/A'}</div>
                  </td>
                  <td className="fw-bold text-white">{t.symbol}</td>
                  <td>
                    <span className={`badge ${t.type === 'BUY' ? 'badge-up' : 'badge-down'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="text-white">{t.quantity}</td>
                  <td className="text-muted">${(t.price || 0).toFixed(2)}</td>
                  <td className="pe-4 fw-bold text-white">${(t.total || 0).toFixed(2)}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No transactions executed yet.
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

export default Admin;
