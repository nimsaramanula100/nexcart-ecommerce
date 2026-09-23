import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft, Plus, Minus, Tag, Check, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const {
    cartItems,
    cartSubtotal,
    cartTotal,
    discountAmount,
    appliedPromo,
    shippingFee,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const navigate = useNavigate();

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromoCode(inputCode);
      setInputCode('');
    }
  };

  const freeShippingThreshold = 49;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container card fade-in">
        <div className="empty-icon-circle">
          <ShoppingBag size={48} />
        </div>
        <h2>YOUR SHOPPING BAG IS EMPTY</h2>
        <p>Discover 50+ trendy fashion items, shoes, beauty, and gadgets waiting for you!</p>
        <Link to="/products" className="btn btn-primary btn-lg mt-3">
          START SHOPPING NOW <ArrowRight size={18} />
        </Link>
        <style>{`
          .empty-cart-container {
            text-align: center;
            padding: 5rem 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            max-width: 600px;
            margin: 3rem auto;
          }
          .empty-icon-circle {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background-color: var(--danger-bg);
            color: var(--accent-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
          }
          .empty-cart-container h2 {
            font-size: 1.8rem;
            font-weight: 900;
            margin-bottom: 0.5rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="cart-page fade-in">
      <div className="page-header">
        <h1>MY SHOPPING BAG ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} ITEMS)</h1>
      </div>

      {/* Free Shipping Progress Bar */}
      <div className="free-shipping-bar card">
        <div className="shipping-bar-text">
          <Truck size={20} color="#ff2460" />
          {remainingForFreeShipping > 0 ? (
            <span>Add <strong>${remainingForFreeShipping.toFixed(2)}</strong> more for <strong>FREE EXPRESS SHIPPING</strong>!</span>
          ) : (
            <span style={{ color: 'var(--success)', fontWeight: 800 }}>🎉 CONGRATS! YOU UNLOCKED FREE EXPRESS SHIPPING!</span>
          )}
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className="cart-layout">
        {/* Cart Items Table */}
        <div className="cart-items-list card">
          <div className="list-header">
            <span>Item Details</span>
            <span>Price</span>
            <span>Quantity</span>
            <span>Subtotal</span>
            <span>Remove</span>
          </div>

          <div className="items-body">
            {cartItems.map((item, idx) => (
              <div key={`${item._id}-${idx}`} className="cart-item-row">
                <div className="item-product-info">
                  <img src={item.imageUrl} alt={item.name} className="item-thumb" />
                  <div>
                    <h4 className="item-name">
                      <Link to={`/products/${item._id}`}>{item.name}</Link>
                    </h4>
                    <div className="item-variant-tags">
                      {item.selectedColor && <span className="v-tag">Color: {item.selectedColor}</span>}
                      {item.selectedSize && <span className="v-tag">Size: {item.selectedSize}</span>}
                    </div>
                  </div>
                </div>

                <div className="item-price-col">
                  ${item.price.toFixed(2)}
                </div>

                <div className="item-qty-col">
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="item-subtotal-col">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <div className="item-action-col">
                  <button
                    className="delete-btn"
                    onClick={() => removeFromCart(item._id)}
                    title="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-actions-footer">
            <Link to="/products" className="btn btn-secondary btn-sm">
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
            <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
              Clear Bag
            </button>
          </div>
        </div>

        {/* Summary Sidebar */}
        <div className="cart-summary card">
          <h3>ORDER SUMMARY</h3>
          <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

          {/* Promo Code Form */}
          <div className="promo-box">
            <label style={{ fontSize: '0.8rem', fontWeight: 800 }}>PROMO / COUPON CODE</label>
            {appliedPromo ? (
              <div className="applied-promo-tag">
                <span><Tag size={14} /> {appliedPromo}</span>
                <button onClick={removePromoCode} style={{ color: 'var(--accent-primary)', fontWeight: 800 }}>Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="promo-form">
                <input
                  type="text"
                  placeholder="Enter SHEINVIP or FLASH20"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="form-control"
                />
                <button type="submit" className="btn btn-dark btn-sm">Apply</button>
              </form>
            )}
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

          <div className="summary-row">
            <span>Bag Subtotal</span>
            <span className="val">${cartSubtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="summary-row" style={{ color: 'var(--accent-primary)' }}>
              <span>Promo Discount</span>
              <span className="val" style={{ color: 'var(--accent-primary)' }}>-${discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className="summary-row">
            <span>Shipping Fee</span>
            <span className="val">
              {shippingFee === 0 ? <span className="free-shipping">FREE</span> : `$${shippingFee.toFixed(2)}`}
            </span>
          </div>

          <hr style={{ borderColor: 'var(--border-color)', margin: '0.5rem 0' }} />

          <div className="summary-row total-row">
            <span>Estimated Total</span>
            <span className="grand-val">${cartTotal.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-primary btn-block btn-lg mt-3"
            onClick={() => navigate('/checkout')}
          >
            CHECKOUT NOW <ArrowRight size={18} />
          </button>

          <p className="summary-note">
            100% Secure Checkout with Instant Demo Payment Preview
          </p>
        </div>
      </div>

      <style>{`
        .cart-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .free-shipping-bar {
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #fff0f3 0%, #ffffff 100%);
          border: 1px solid rgba(255, 36, 96, 0.2);
        }

        .shipping-bar-text {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .progress-track {
          height: 8px;
          border-radius: 4px;
          background: #e9ecef;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: var(--accent-gradient);
          transition: width 0.3s ease;
        }

        .cart-layout {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 1.5rem;
          align-items: start;
        }

        .list-header {
          display: grid;
          grid-template-columns: 2.5fr 1fr 1.2fr 1fr 0.5fr;
          gap: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-color);
          font-weight: 800;
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .cart-item-row {
          display: grid;
          grid-template-columns: 2.5fr 1fr 1.2fr 1fr 0.5fr;
          gap: 1rem;
          align-items: center;
          padding: 1.25rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .item-product-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .item-thumb {
          width: 65px;
          height: 80px;
          border-radius: var(--radius-sm);
          object-fit: cover;
          background-color: var(--bg-hover);
        }

        .item-name {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .item-variant-tags {
          display: flex;
          gap: 6px;
          margin-top: 4px;
        }

        .v-tag {
          font-size: 0.7rem;
          background: var(--bg-hover);
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 600;
          color: var(--text-muted);
        }

        .item-price-col, .item-subtotal-col {
          font-weight: 800;
          font-family: 'Outfit', sans-serif;
        }

        .delete-btn {
          color: var(--text-muted);
          transition: color var(--transition-fast);
        }

        .delete-btn:hover {
          color: var(--accent-primary);
        }

        .cart-actions-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1.25rem;
        }

        .cart-summary {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .promo-form {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.35rem;
        }

        .applied-promo-tag {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--danger-bg);
          color: var(--accent-primary);
          padding: 0.5rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.85rem;
          font-weight: 700;
          margin-top: 0.35rem;
        }

        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.9rem;
          color: var(--text-secondary);
        }

        .summary-row .val {
          font-weight: 700;
          color: var(--text-primary);
        }

        .free-shipping {
          color: var(--success);
          font-weight: 800;
        }

        .total-row {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--text-primary);
        }

        .grand-val {
          font-family: 'Outfit', sans-serif;
          font-size: 1.6rem;
          color: var(--accent-primary);
        }

        .summary-note {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
        }

        @media (max-width: 900px) {
          .cart-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Cart;
