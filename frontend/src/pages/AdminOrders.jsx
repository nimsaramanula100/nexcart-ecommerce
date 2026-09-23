import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Package, CheckCircle2, Truck } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const { showToast } = useCart();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/orders');
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast(`Order status updated to "${newStatus}"`, 'success');
      fetchOrders();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const filteredOrders = statusFilter === 'All'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="admin-orders-page fade-in">
      <div className="page-header flex-between">
        <div>
          <Link to="/admin" className="back-link mb-1">
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
          <h1>Order Status Management</h1>
          <p>Monitor order fulfillments, update tracking stages, and review customer invoices.</p>
        </div>

        <div className="status-filter-pills">
          {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map((st) => (
            <button
              key={st}
              className={`pill-btn ${statusFilter === st ? 'active' : ''}`}
              onClick={() => setStatusFilter(st)}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="card p-0">
        {loading ? (
          <div className="p-4 text-center">Loading Orders...</div>
        ) : filteredOrders.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order Reference</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Payment</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((ord) => (
                <tr key={ord._id}>
                  <td>
                    <strong className="font-mono">#{ord._id.substring(0, 10)}...</strong>
                    <br />
                    <span className="text-muted font-xs">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td>
                    <strong>{ord.user?.name || 'Customer'}</strong>
                    <br />
                    <span className="text-muted font-xs">{ord.user?.email}</span>
                  </td>

                  <td>
                    <span className="font-sm">{ord.orderItems?.length} items</span>
                  </td>

                  <td className="font-bold">${ord.totalPrice.toFixed(2)}</td>

                  <td>
                    <span className="badge badge-success">
                      {ord.paymentMethod === 'Cash on Delivery' ? 'COD' : 'Paid'}
                    </span>
                  </td>

                  <td>
                    <select
                      className="status-select"
                      value={ord.status}
                      onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-4 text-center text-muted">No orders found in this view.</div>
        )}
      </div>

      <style>{`
        .admin-orders-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .status-filter-pills {
          display: flex;
          gap: 0.35rem;
        }

        .pill-btn {
          padding: 0.4rem 0.85rem;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
        }

        .pill-btn.active {
          background-color: var(--accent-primary);
          color: white;
          border-color: var(--accent-primary);
        }

        .status-select {
          padding: 0.35rem 0.65rem;
          font-size: 0.85rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default AdminOrders;
