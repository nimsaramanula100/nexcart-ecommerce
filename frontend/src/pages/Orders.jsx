import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, ChevronDown, ChevronUp, MapPin, CreditCard, ArrowRight } from 'lucide-react';
import API from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await API.get('/orders/myorders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch user orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered': return <span className="badge badge-success">Delivered</span>;
      case 'Shipped': return <span className="badge badge-primary">Shipped</span>;
      case 'Processing': return <span className="badge badge-warning">Processing</span>;
      default: return <span className="badge badge-secondary">Pending</span>;
    }
  };

  return (
    <div className="my-orders-page fade-in">
      <div className="page-header">
        <h1>My Order History</h1>
        <p>Track your current orders and review previous purchases.</p>
      </div>

      {loading ? (
        <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className="skeleton" style={{ height: '80px', marginBottom: '1rem' }}></div>
          <div className="skeleton" style={{ height: '80px' }}></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center fade-in" style={{ padding: '4rem 2rem' }}>
          <Package size={48} className="text-muted mb-2" />
          <h3>No Orders Found</h3>
          <p className="text-muted">You haven't placed any orders with NexCart yet.</p>
          <Link to="/products" className="btn btn-primary mt-3">
            Start Shopping <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order._id;
            return (
              <div key={order._id} className="order-card card">
                <div className="order-summary-row" onClick={() => toggleExpand(order._id)}>
                  <div className="order-col">
                    <span className="label">Order ID</span>
                    <strong className="order-id">#{order._id.substring(0, 10)}...</strong>
                  </div>

                  <div className="order-col">
                    <span className="label">Date Placed</span>
                    <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="order-col">
                    <span className="label">Total Amount</span>
                    <strong className="order-price">${order.totalPrice.toFixed(2)}</strong>
                  </div>

                  <div className="order-col">
                    <span className="label">Status</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="expand-btn">
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="order-details-drawer fade-in">
                    <hr className="divider" />
                    <div className="drawer-grid">
                      {/* Items */}
                      <div className="drawer-section">
                        <h4>Items Purchased ({order.orderItems?.length})</h4>
                        <div className="items-list">
                          {order.orderItems?.map((item) => (
                            <div key={item._id} className="drawer-item">
                              <img src={item.imageUrl} alt={item.name} className="thumb" />
                              <div className="info">
                                <span className="title">{item.name}</span>
                                <span className="sub">{item.quantity} × ${item.price.toFixed(2)}</span>
                              </div>
                              <span className="total">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping & Payment */}
                      <div className="drawer-section">
                        <h4><MapPin size={16} /> Delivery Address</h4>
                        <p className="text-muted font-sm">
                          <strong>{order.shippingAddress?.fullName}</strong><br />
                          {order.shippingAddress?.address}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.country}<br />
                          Phone: {order.shippingAddress?.phone}
                        </p>

                        <h4 className="mt-3"><CreditCard size={16} /> Payment Method</h4>
                        <p className="text-muted font-sm">
                          {order.paymentMethod} — <span className="badge badge-success">Paid</span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .my-orders-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .orders-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .order-card {
          cursor: pointer;
          transition: border-color var(--transition-fast);
        }

        .order-card:hover {
          border-color: var(--accent-primary);
        }

        .order-summary-row {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 40px;
          gap: 1rem;
          align-items: center;
        }

        .order-col {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          font-size: 0.85rem;
        }

        .label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .order-id {
          font-family: monospace;
          color: var(--accent-primary);
        }

        .order-price {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
        }

        .expand-btn {
          color: var(--text-muted);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .order-details-drawer {
          padding-top: 1rem;
        }

        .drawer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .drawer-section h4 {
          font-size: 0.9rem;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .drawer-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
        }

        .thumb {
          width: 42px;
          height: 42px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .title { font-weight: 600; }
        .sub { font-size: 0.75rem; color: var(--text-muted); }
        .total { font-weight: 700; }
        .font-sm { font-size: 0.85rem; line-height: 1.5; }

        @media (max-width: 768px) {
          .order-summary-row {
            grid-template-columns: 1fr 1fr;
          }
          .drawer-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Orders;
