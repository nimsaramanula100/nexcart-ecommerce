import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, Truck, RefreshCw, Heart, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="site-footer">
      {/* Value Proposition Badges */}
      <div className="footer-benefits">
        <div className="benefit-item">
          <Truck size={24} className="benefit-icon" />
          <div>
            <h4>Express Worldwide Shipping</h4>
            <p>Tracked delivery on all orders over $49</p>
          </div>
        </div>
        <div className="benefit-item">
          <ShieldCheck size={24} className="benefit-icon" />
          <div>
            <h4>100% Secure Checkout</h4>
            <p>Encrypted transactions & instant demo pay</p>
          </div>
        </div>
        <div className="benefit-item">
          <RefreshCw size={24} className="benefit-icon" />
          <div>
            <h4>Hassle-Free 30-Day Returns</h4>
            <p>Easy return process & money-back guarantee</p>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="newsletter-banner">
        <div className="newsletter-container">
          <div>
            <h3>JOIN THE LUXE CLUB</h3>
            <p>Get 15% OFF your first order + daily flash deal alerts!</p>
          </div>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email address..." className="newsletter-input" required />
            <button type="submit" className="btn btn-primary">
              <Send size={16} /> Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-col brand-col">
          <div className="footer-logo">
            <div className="logo-icon-sm">
              <ShoppingBag size={18} />
            </div>
            <span className="brand-title">ALORA<span className="brand-accent">LUXE</span></span>
          </div>
          <p className="footer-tagline">
            Your ultimate online fashion & lifestyle destination. Premium quality, unbeatable prices, 50+ diverse categories.
          </p>
          <div className="portfolio-badge">
            <Heart size={14} color="#ff2460" fill="#ff2460" />
            <span>Full-Stack E-Commerce Platform</span>
          </div>
        </div>

        <div className="footer-col">
          <h4>Fashion & Categories</h4>
          <ul>
            <li><Link to="/products?category=Women's%20Fashion">Women's Fashion</Link></li>
            <li><Link to="/products?category=Men's%20Fashion">Men's Fashion</Link></li>
            <li><Link to="/products?category=Shoes%20%26%20Sneakers">Shoes & Sneakers</Link></li>
            <li><Link to="/products?category=Beauty%20%26%20Skincare">Beauty & Skincare</Link></li>
            <li><Link to="/products?category=Jewelry%20%26%20Watches">Jewelry & Watches</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><Link to="/products">Browse All Products</Link></li>
            <li><Link to="/wishlist">My Wishlist</Link></li>
            <li><Link to="/cart">View Shopping Cart</Link></li>
            <li><Link to="/orders">Order Tracking</Link></li>
            <li><Link to="/profile">My Account</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Admin Portal</h4>
          <p className="footer-text-sm">
            Access administrative management, create/edit products, track customer orders, and manage inventory stock.
          </p>
          <Link to="/admin" className="btn btn-secondary btn-sm admin-footer-btn">
            Admin Dashboard
          </Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ALoraLuxe E-Commerce Platform. All rights reserved.</p>
        <div className="payment-badges">
          <span className="pay-badge">VISA</span>
          <span className="pay-badge">Mastercard</span>
          <span className="pay-badge">PayPal</span>
          <span className="pay-badge">Apple Pay</span>
          <span className="pay-badge">Demo Pay</span>
        </div>
      </div>

      <style>{`
        .site-footer {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          margin-top: 4rem;
        }

        .footer-benefits {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2.5rem 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          border-bottom: 1px solid var(--border-color);
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .benefit-icon {
          color: var(--accent-primary);
          flex-shrink: 0;
        }

        .benefit-item h4 {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .benefit-item p {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .newsletter-banner {
          background: #111111;
          color: white;
          padding: 2.5rem 1.5rem;
        }

        .newsletter-container {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .newsletter-container h3 {
          color: white;
          font-size: 1.4rem;
          letter-spacing: 0.5px;
        }

        .newsletter-container p {
          font-size: 0.875rem;
          color: #adb5bd;
        }

        .newsletter-form {
          display: flex;
          gap: 0.5rem;
          max-width: 480px;
          width: 100%;
        }

        .newsletter-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid #333;
          background: #1e1e1e;
          color: white;
          outline: none;
        }

        .footer-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 3.5rem 1.5rem;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2.5rem;
        }

        .brand-col {
          grid-column: span 1;
        }

        .footer-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.85rem;
        }

        .logo-icon-sm {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--accent-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .footer-tagline {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .portfolio-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          background-color: var(--bg-hover);
          padding: 0.45rem 0.85rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }

        .footer-col h4 {
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .footer-col a {
          font-size: 0.875rem;
          color: var(--text-secondary);
          transition: color var(--transition-fast);
        }

        .footer-col a:hover {
          color: var(--accent-primary);
        }

        .footer-text-sm {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1rem;
        }

        .admin-footer-btn {
          margin-top: 0.5rem;
        }

        .footer-bottom {
          max-width: 1400px;
          margin: 0 auto;
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        .payment-badges {
          display: flex;
          gap: 0.5rem;
        }

        .pay-badge {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 0.25rem 0.6rem;
          border-radius: var(--radius-sm);
          background-color: var(--bg-hover);
          border: 1px solid var(--border-color);
        }
      `}</style>
    </footer>
  );
};

export default Footer;
