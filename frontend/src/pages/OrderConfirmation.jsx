import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, Clock, MapPin } from 'lucide-react';
import API from '../services/api';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        console.error('Failed to fetch order confirmation:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="card text-center fade-in" style={{ padding: '4rem 2rem' }}>
        <div className="skeleton" style={{ height: '60px', width: '60px', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
        <div className="skeleton" style={{ height: '24px', width: '40%', margin: '0 auto' }}></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card text-center" style={{ padding: '4rem 2rem' }}>
        <h2>Order Not Found</h2>
        <Link to="/orders" className="btn btn-primary mt-3">
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="confirmation-page fade-in">
      <div className="card success-hero-card">
        <div className="success-icon-badge">
          <CheckCircle2 size={64} />
        </div>
        <h1>Order Confirmed!</h1>
        <p className="subtitle">
          Thank you for your purchase! We've received your order and are preparing it for dispatch.
        </p>

        <div className="order-id-badge">
          <span>Order Reference ID:</span>
          <strong>#{order._id}</strong>
        </div>
      </div>

      <div className="confirmation-grid">
        {/* Status Tracker */}
        <div className="card tracker-card">
          <h3>Order Status Tracking</h3>
          <hr className="divider" />
          <div className="status-progress-bar">
            <div className={`step ${['Pending', 'Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'active' : ''}`}>
              <div className="circle"><Clock size={16} /></div>
              <span>Pending</span>
            </div>
            <div className={`step ${['Processing', 'Shipped', 'Delivered'].includes(order.status) ? 'active' : ''}`}>
              <div className="circle"><Package size={16} /></div>
              <span>Processing</span>
            </div>
            <div className={`step ${['Shipped', 'Delivered'].includes(order.status) ? 'active' : ''}`}>
              <div className="circle"><Truck size={16} /></div>
              <span>Shipped</span>
            </div>
            <div className={`step ${order.status === 'Delivered' ? 'active' : ''}`}>
              <div className="circle"><CheckCircle2 size={16} /></div>
              <span>Delivered</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="confirmation-details-grid">
          <div className="card">
            <h4><MapPin size={18} /> Shipping Destination</h4>
            <p className="mt-2"><strong>{order.shippingAddress?.fullName}</strong></p>
            <p className="text-muted">{order.shippingAddress?.address}</p>
            <p className="text-muted">
              {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
            <p className="text-muted">Phone: {order.shippingAddress?.phone}</p>
          </div>

          <div className="card">
            <h4>Payment Details</h4>
            <p className="mt-2">Method: <strong>{order.paymentMethod}</strong></p>
            <p>Status: <span className="badge badge-success">Paid</span></p>
            <p className="text-muted">Paid At: {new Date(order.paidAt).toLocaleString()}</p>
          </div>
        </div>

        {/* Items Summary Table */}
        <div className="card">
          <h3>Order Items</h3>
          <hr className="divider" />
          <div className="confirm-items-list">
            {Array.isArray(order?.orderItems) && order.orderItems?.map((item) => (
              <div key={item._id} className="confirm-item-row">
                <img src={item.imageUrl} alt={item.name} className="confirm-thumb" />
                <div className="confirm-item-info">
                  <strong>{item.name}</strong>
                  <span className="text-muted">Qty: {item.quantity}</span>
                </div>
                <span className="confirm-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr className="divider" />

          <div className="confirm-total-box">
            <div className="row"><span>Total Paid:</span> <strong>${order.totalPrice?.toFixed(2)}</strong></div>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <Link to="/orders" className="btn btn-secondary btn-lg">
          View All Orders
        </Link>
        <Link to="/products" className="btn btn-primary btn-lg">
          Continue Shopping <ArrowRight size={18} />
        </Link>
      </div>

      <style>{`
        .confirmation-page {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }

        .success-hero-card {
          text-align: center;
          padding: 3rem 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .success-icon-badge {
          color: var(--success);
          margin-bottom: 1rem;
        }

        .success-hero-card h1 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
          max-width: 500px;
        }

        .order-id-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background-color: var(--bg-hover);
          padding: 0.5rem 1.25rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          font-size: 0.9rem;
        }

        .confirmation-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .status-progress-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 0;
          position: relative;
        }

        .status-progress-bar .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 1;
          color: var(--text-muted);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-progress-bar .circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background-color: var(--bg-hover);
          border: 2px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-progress-bar .step.active {
          color: var(--accent-primary);
        }

        .status-progress-bar .step.active .circle {
          background-color: var(--accent-primary);
          border-color: var(--accent-primary);
          color: white;
        }

        .confirmation-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .confirm-items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .confirm-item-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .confirm-thumb {
          width: 50px;
          height: 50px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .confirm-item-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .confirm-price {
          font-weight: 700;
        }

        .confirm-total-box {
          display: flex;
          justify-content: flex-end;
          font-size: 1.2rem;
        }

        .confirmation-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }

        @media (max-width: 650px) {
          .confirmation-details-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
