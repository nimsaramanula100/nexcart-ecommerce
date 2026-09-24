import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, Lock, CheckCircle2, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import API from '../services/api';

const Checkout = () => {
  const { user } = useAuth();
  const {
    cartItems,
    cartSubtotal,
    cartTotal,
    discountAmount,
    appliedPromo,
    shippingFee,
    clearCart,
    showToast,
  } = useCart();
  const navigate = useNavigate();

  // Form State
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: user?.address?.street || 'No. 45, Flower Road, Colombo 07',
    city: user?.address?.city || 'Colombo',
    postalCode: user?.address?.postalCode || '00700',
    country: user?.address?.country || 'Sri Lanka',
    phone: user?.phone || '+94 77 123 4567',
  });

  const [paymentMethod, setPaymentMethod] = useState('Simulated Card Gateway');
  const [cardDetails, setCardDetails] = useState({
    name: user?.name || 'SHEIN VIP CUSTOMER',
    number: '4242 4242 4242 4242',
    expiry: '12/28',
    cvc: '888',
  });

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="card text-center fade-in" style={{ padding: '4rem 2rem' }}>
        <h2>NO ITEMS IN YOUR BAG</h2>
        <p className="text-muted">Please add items to your cart before completing checkout.</p>
        <Link to="/products" className="btn btn-primary mt-3">
          <ArrowLeft size={16} /> RETURN TO CATALOG
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city) {
      setError('Please fill in all required shipping fields.');
      return;
    }

    setProcessing(true);
    setError(null);

    // Simulate 1.5 second premium checkout delay
    setTimeout(async () => {
      try {
        const orderPayload = {
          orderItems: (Array.isArray(cartItems) ? cartItems : []).map((item) => ({
            name: item.name,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            price: item.price,
            product: item._id,
            selectedColor: item.selectedColor,
            selectedSize: item.selectedSize,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice: cartSubtotal,
          discountAmount,
          appliedPromo,
          taxPrice: 0,
          shippingPrice: shippingFee,
          totalPrice: cartTotal,
        };

        const { data } = await API.post('/orders', orderPayload);
        showToast('Order placed successfully!', 'success');
        clearCart();
        navigate(`/orders/confirm/${data._id}`);
      } catch (err) {
        setProcessing(false);
        setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      }
    }, 1500);
  };

  return (
    <div className="checkout-page fade-in">
      <div className="page-header">
        <h1>SECURE CHECKOUT</h1>
        <p className="flex-center gap-1 text-muted">
          <Lock size={14} color="#ff2460" /> End-to-end 256-Bit Encrypted Payment Sandbox
        </p>
      </div>

      {error && <div className="card badge-danger p-3 mb-3">{error}</div>}

      <div className="checkout-layout">
        {/* Left Column: Shipping & Interactive Card Form */}
        <form onSubmit={handlePlaceOrder} className="checkout-main-form">
          {/* Shipping Address */}
          <div className="card form-card">
            <h3><Truck size={20} className="card-icon" /> 1. Shipping & Delivery Address</h3>
            <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

            <div className="form-group">
              <label className="form-label">Full Recipient Name</label>
              <input
                type="text"
                name="fullName"
                required
                className="form-control"
                value={shippingAddress.fullName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Street Address & Apartment</label>
              <input
                type="text"
                name="address"
                required
                className="form-control"
                value={shippingAddress.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  className="form-control"
                  value={shippingAddress.city}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Postal / Zip Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  className="form-control"
                  value={shippingAddress.postalCode}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Country</label>
                <input
                  type="text"
                  name="country"
                  required
                  className="form-control"
                  value={shippingAddress.country}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number for Delivery SMS</label>
                <input
                  type="text"
                  name="phone"
                  required
                  className="form-control"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* Payment Options with Animated Credit Card Preview */}
          <div className="card form-card mt-3">
            <h3><CreditCard size={20} className="card-icon" /> 2. Payment Method</h3>
            <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

            <div className="payment-options">
              <label className={`pay-radio-card ${paymentMethod === 'Simulated Card Gateway' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="Simulated Card Gateway"
                  checked={paymentMethod === 'Simulated Card Gateway'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="pay-radio-info">
                  <span className="pay-title">Simulated Credit / Debit Card (Stripe Gateway)</span>
                  <span className="pay-sub">Auto-approved instant test demo</span>
                </div>
              </label>

              <label className={`pay-radio-card ${paymentMethod === 'Cash on Delivery' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="Cash on Delivery"
                  checked={paymentMethod === 'Cash on Delivery'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="pay-radio-info">
                  <span className="pay-title">Cash on Delivery (COD)</span>
                  <span className="pay-sub">Pay in cash when package arrives</span>
                </div>
              </label>
            </div>

            {paymentMethod === 'Simulated Card Gateway' && (
              <div className="card-simulator-wrapper mt-3">
                {/* Visual Credit Card Preview */}
                <div className="credit-card-visual">
                  <div className="card-top-row">
                    <span className="chip" />
                    <span className="card-brand-logo">SHEIN LUXE CARD</span>
                  </div>
                  <div className="card-number-display">{cardDetails.number || '•••• •••• •••• ••••'}</div>
                  <div className="card-bottom-row">
                    <div>
                      <span className="card-lbl">CARD HOLDER</span>
                      <div className="card-val">{cardDetails.name || 'VALUED CUSTOMER'}</div>
                    </div>
                    <div>
                      <span className="card-lbl">EXPIRES</span>
                      <div className="card-val">{cardDetails.expiry || 'MM/YY'}</div>
                    </div>
                  </div>
                </div>

                <div className="sim-badge"><Sparkles size={14} /> DEMO CARD PREVIEW (AUTOFILLED)</div>

                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className="form-control"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVC / CVV</label>
                    <input
                      type="text"
                      className="form-control"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg mt-3"
            disabled={processing}
          >
            {processing ? (
              <span>PROCESSING PAYMENT...</span>
            ) : (
              <span>PAY & PLACE ORDER (${cartTotal.toFixed(2)})</span>
            )}
          </button>
        </form>

        {/* Right Summary Panel */}
        <aside className="checkout-summary card">
          <h3>ORDER ITEMS ({Array.isArray(cartItems) ? cartItems.length : 0})</h3>
          <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

          <div className="checkout-items-list">
            {Array.isArray(cartItems) && cartItems?.map((item, idx) => (
              <div key={idx} className="mini-item">
                <img src={item.imageUrl} alt={item.name} className="mini-thumb" />
                <div className="mini-details">
                  <p className="mini-name">{item.name}</p>
                  <span className="mini-qty">
                    Qty: {item.quantity} × ${item.price.toFixed(2)}
                  </span>
                  {(item.selectedColor || item.selectedSize) && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {item.selectedColor} / {item.selectedSize}
                    </div>
                  )}
                </div>
                <span className="mini-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

          <div className="summary-row">
            <span>Items Subtotal</span>
            <span>${cartSubtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="summary-row" style={{ color: 'var(--accent-primary)' }}>
              <span>Promo ({appliedPromo})</span>
              <span style={{ color: 'var(--accent-primary)' }}>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Estimated Shipping</span>
            <span>{shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}</span>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

          <div className="summary-row total-row">
            <span>Grand Total</span>
            <span className="grand-val">${cartTotal.toFixed(2)}</span>
          </div>
        </aside>
      </div>

      <style>{`
        .checkout-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .checkout-layout {
          display: grid;
          grid-template-columns: 1fr 360px;
          gap: 1.5rem;
          align-items: start;
        }

        .form-card {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .card-icon {
          color: var(--accent-primary);
          vertical-align: middle;
          margin-right: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .payment-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .pay-radio-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: border-color var(--transition-fast);
        }

        .pay-radio-card.selected {
          border-color: var(--accent-primary);
          background-color: var(--danger-bg);
        }

        .pay-title {
          display: block;
          font-weight: 800;
          font-size: 0.9rem;
        }

        .pay-sub {
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .card-simulator-wrapper {
          background-color: var(--bg-hover);
          padding: 1.5rem;
          border-radius: var(--radius-md);
          border: 1px dashed var(--border-color);
        }

        .credit-card-visual {
          background: linear-gradient(135deg, #111111 0%, #ff2460 100%);
          color: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 8px 24px rgba(255, 36, 96, 0.3);
          margin-bottom: 1.25rem;
          font-family: 'Outfit', sans-serif;
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .chip {
          width: 36px;
          height: 26px;
          background: #ffd700;
          border-radius: 6px;
        }

        .card-brand-logo {
          font-size: 0.8rem;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .card-number-display {
          font-size: 1.25rem;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 1.25rem;
        }

        .card-bottom-row {
          display: flex;
          justify-content: space-between;
        }

        .card-lbl {
          font-size: 0.6rem;
          opacity: 0.7;
          display: block;
        }

        .card-val {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .sim-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--accent-primary);
          margin-bottom: 1rem;
        }

        .checkout-items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 320px;
          overflow-y: auto;
        }

        .mini-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.85rem;
        }

        .mini-thumb {
          width: 50px;
          height: 65px;
          border-radius: var(--radius-sm);
          object-fit: cover;
        }

        .mini-details { flex: 1; }
        .mini-name { font-weight: 700; line-height: 1.2; }
        .mini-qty { font-size: 0.75rem; color: var(--text-muted); }
        .mini-price { font-weight: 800; }

        @media (max-width: 900px) {
          .checkout-layout {
            grid-template-columns: 1fr;
          }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
