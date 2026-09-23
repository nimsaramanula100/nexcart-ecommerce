import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, ShoppingBag, Users, Package, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import API from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard fade-in">
        <div className="skeleton" style={{ height: '120px', marginBottom: '1.5rem' }}></div>
        <div className="skeleton" style={{ height: '300px' }}></div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard fade-in">
      <div className="page-header flex-between">
        <div>
          <h1><ShieldCheck size={28} className="icon-header" /> Admin Dashboard</h1>
          <p>Real-time analytics, order overview, and store inventory monitoring.</p>
        </div>

        <div className="admin-quick-nav">
          <Link to="/admin/products" className="btn btn-secondary btn-sm">
            Manage Products
          </Link>
          <Link to="/admin/orders" className="btn btn-secondary btn-sm">
            Manage Orders
          </Link>
          <Link to="/admin/users" className="btn btn-secondary btn-sm">
            View Customers
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="metrics-grid">
        <div className="metric-card card">
          <div className="metric-icon green">
            <DollarSign size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Revenue</span>
            <h3 className="metric-value">${stats?.totalRevenue?.toFixed(2) || '0.00'}</h3>
          </div>
        </div>

        <div className="metric-card card">
          <div className="metric-icon purple">
            <ShoppingBag size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Orders</span>
            <h3 className="metric-value">{stats?.totalOrders || 0}</h3>
          </div>
        </div>

        <div className="metric-card card">
          <div className="metric-icon blue">
            <Package size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Active Products</span>
            <h3 className="metric-value">{stats?.totalProducts || 0}</h3>
          </div>
        </div>

        <div className="metric-card card">
          <div className="metric-icon orange">
            <Users size={24} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Registered Customers</span>
            <h3 className="metric-value">{stats?.totalUsers || 0}</h3>
          </div>
        </div>
      </div>

      <div className="admin-tables-grid">
        {/* Recent Orders Table */}
        <div className="card">
          <div className="card-header flex-between">
            <h3>Recent Orders</h3>
            <Link to="/admin/orders" className="link-sm">View All <ArrowRight size={14} /></Link>
          </div>
          <hr className="divider" />

          {stats?.recentOrders?.length > 0 ? (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((ord) => (
                  <tr key={ord._id}>
                    <td className="font-mono">#{ord._id.substring(0, 8)}</td>
                    <td>{ord.user?.name || 'Customer'}</td>
                    <td className="font-bold">${ord.totalPrice?.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${ord.status === 'Delivered' ? 'badge-success' : 'badge-warning'}`}>
                        {ord.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-muted p-3 text-center">No orders recorded yet.</p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <div className="card-header flex-between">
            <h3 className="text-danger flex-center gap-1">
              <AlertTriangle size={18} /> Low Stock Alerts
            </h3>
            <Link to="/admin/products" className="link-sm">Restock <ArrowRight size={14} /></Link>
          </div>
          <hr className="divider" />

          {stats?.lowStockProducts?.length > 0 ? (
            <div className="low-stock-list">
              {stats.lowStockProducts.map((p) => (
                <div key={p._id} className="low-stock-row">
                  <img src={p.imageUrl} alt={p.name} className="mini-thumb" />
                  <div className="flex-1">
                    <p className="font-bold font-sm">{p.name}</p>
                    <span className="text-muted font-xs">{p.categoryName}</span>
                  </div>
                  <span className="badge badge-danger">
                    {p.countInStock} Remaining
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-success p-3 text-center">All product stock levels are healthy.</p>
          )}
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .flex-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .icon-header {
          color: var(--accent-primary);
          vertical-align: middle;
          margin-right: 0.5rem;
        }

        .admin-quick-nav {
          display: flex;
          gap: 0.5rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        .metric-card {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.5rem;
        }

        .metric-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .metric-icon.green { background: linear-gradient(135deg, #10b981 0%, #059669 100%); }
        .metric-icon.purple { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); }
        .metric-icon.blue { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); }
        .metric-icon.orange { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }

        .metric-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .metric-value {
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          font-weight: 800;
        }

        .admin-tables-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 1.5rem;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .admin-table th, .admin-table td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .admin-table th {
          color: var(--text-muted);
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.75rem;
        }

        .font-mono { font-family: monospace; }
        .font-bold { font-weight: 700; }
        .font-sm { font-size: 0.85rem; }
        .font-xs { font-size: 0.75rem; }
        .link-sm { font-size: 0.85rem; color: var(--accent-primary); font-weight: 600; }

        .low-stock-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .low-stock-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .mini-thumb {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        @media (max-width: 900px) {
          .admin-tables-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
