import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  Sun,
  Moon,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Package,
  Heart,
  Flame,
  Percent,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useWishlist } from '../context/WishlistContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const categories = [
    "Women's Fashion",
    "Men's Fashion",
    "Shoes & Sneakers",
    "Bags & Luggage",
    "Beauty & Makeup",
    "Jewelry & Accessories",
    "Electronics & Gadgets",
    "Home & Living",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      {/* SHEIN Announcement Top Bar */}
      <div className="top-promo-bar">
        <span><Zap size={14} fill="#ffb703" color="#ffb703" /> FLASH SALE: UP TO 70% OFF</span>
        <span className="desktop-only"><Percent size={14} /> FREE SHIPPING ON ORDERS OVER $49</span>
        <span className="desktop-only"><Sparkles size={14} /> USE CODE <strong>SHEINVIP</strong> FOR 15% OFF</span>
      </div>

      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="logo-icon">
            <ShoppingBag size={22} />
          </div>
          <div className="logo-text">
            <span className="brand-title">SHEIN<span className="brand-accent">LUXE</span></span>
            <span className="brand-tagline">TRENDY FASHION & EVERYTHING</span>
          </div>
        </Link>

        {/* Global Search Bar */}
        <form onSubmit={handleSearch} className="nav-search-form desktop-only">
          <input
            type="text"
            placeholder="Search 50+ trendy styles, shoes, beauty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="nav-search-input"
          />
          <button type="submit" className="nav-search-btn">
            <Search size={18} />
          </button>
        </form>

        {/* Right Action Icons */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {/* Wishlist Icon */}
          <Link to="/wishlist" className="icon-btn cart-btn" title="Wishlist">
            <Heart size={19} />
            {wishlistCount > 0 && <span className="cart-badge">{wishlistCount}</span>}
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="icon-btn cart-btn" title="Shopping Cart">
            <ShoppingBag size={19} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Profile / Auth State */}
          {user ? (
            <div className="user-dropdown-wrapper">
              <button
                className="user-avatar-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name desktop-only">{user.name.split(' ')[0]}</span>
              </button>

              {userDropdownOpen && (
                <div className="dropdown-menu fade-in">
                  <div className="dropdown-header">
                    <p className="dropdown-user-name">{user.name}</p>
                    <p className="dropdown-user-email">{user.email}</p>
                    {isAdmin && <span className="admin-pill">Admin</span>}
                  </div>
                  <hr style={{ borderColor: 'var(--border-color)', margin: '0.4rem 0' }} />
                  <Link to="/profile" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <User size={16} /> My Profile
                  </Link>
                  <Link to="/orders" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <Package size={16} /> My Orders
                  </Link>
                  <Link to="/wishlist" className="dropdown-item" onClick={() => setUserDropdownOpen(false)}>
                    <Heart size={16} /> Wishlist ({wishlistCount})
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="dropdown-item admin-item" onClick={() => setUserDropdownOpen(false)}>
                      <Shield size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <hr style={{ borderColor: 'var(--border-color)', margin: '0.4rem 0' }} />
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons desktop-only">
              <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Join Free</Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="icon-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Category Bar for Desktop */}
      <div className="category-mega-bar desktop-only">
        <div className="category-mega-container">
          <Link to="/products" className="cat-item hot-cat">
            <Flame size={15} color="#ff2460" /> ALL CATEGORIES
          </Link>
          {categories.map((cat) => (
            <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="cat-item">
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer fade-in">
          <form onSubmit={handleSearch} className="nav-search-form" style={{ maxWidth: '100%' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="nav-search-input"
            />
            <button type="submit" className="nav-search-btn">
              <Search size={18} />
            </button>
          </form>

          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home Page</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
          <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>My Wishlist ({wishlistCount})</Link>
          
          <div className="mobile-cat-header">Categories</div>
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${encodeURIComponent(cat)}`}
              onClick={() => setMobileMenuOpen(false)}
              className="mobile-cat-item"
            >
              {cat}
            </Link>
          ))}

          {user ? (
            <>
              <hr style={{ borderColor: 'var(--border-color)' }} />
              <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
              <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
              {isAdmin && (
                <Link to="/admin" style={{ color: 'var(--accent-primary)' }} onClick={() => setMobileMenuOpen(false)}>
                  Admin Dashboard
                </Link>
              )}
              <button className="btn btn-primary btn-block" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <div className="mobile-auth-stack">
              <Link to="/login" className="btn btn-secondary btn-block" onClick={() => setMobileMenuOpen(false)}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-block" onClick={() => setMobileMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Embedded Component CSS */}
      <style>{`
        .navbar-header {
          position: sticky;
          top: 0;
          z-index: 900;
          background-color: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .logo-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: var(--accent-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px var(--accent-glow);
        }

        .brand-title {
          font-family: 'Outfit', sans-serif;
          font-size: 1.4rem;
          font-weight: 900;
          letter-spacing: -0.5px;
          line-height: 1;
        }

        .brand-accent {
          color: var(--accent-primary);
        }

        .brand-tagline {
          display: block;
          font-size: 0.625rem;
          color: var(--text-muted);
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .nav-search-form {
          flex: 1;
          max-width: 450px;
          position: relative;
        }

        .nav-search-input {
          width: 100%;
          padding: 0.6rem 2.8rem 0.6rem 1rem;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--border-color);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          font-size: 0.875rem;
          outline: none;
          transition: all 0.2s ease;
        }

        .nav-search-input:focus {
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px var(--accent-glow);
        }

        .nav-search-btn {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--accent-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          background-color: var(--bg-primary);
          border: 1px solid var(--border-color);
          transition: all var(--transition-fast);
        }

        .icon-btn:hover {
          color: var(--accent-primary);
          border-color: var(--accent-primary);
          background-color: var(--bg-hover);
        }

        .cart-btn {
          position: relative;
        }

        .cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--accent-primary);
          color: white;
          font-size: 0.65rem;
          font-weight: 800;
          min-width: 18px;
          height: 18px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          box-shadow: 0 2px 6px var(--accent-glow);
        }

        .category-mega-bar {
          background-color: var(--bg-secondary);
          border-top: 1px solid var(--border-color);
          border-bottom: 1px solid var(--border-color);
          overflow-x: auto;
        }

        .category-mega-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0.4rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          white-space: nowrap;
        }

        .cat-item {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          transition: color 0.2s ease;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .cat-item:hover {
          color: var(--accent-primary);
        }

        .hot-cat {
          color: var(--accent-primary);
        }

        .user-dropdown-wrapper {
          position: relative;
        }

        .user-avatar-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.5rem 0.25rem 0.25rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background-color: var(--bg-primary);
        }

        .avatar-circle {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: var(--accent-gradient);
          color: white;
          font-weight: 800;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name {
          font-weight: 700;
          font-size: 0.8rem;
        }

        .dropdown-menu {
          position: absolute;
          top: 115%;
          right: 0;
          width: 220px;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 0.5rem;
          z-index: 1000;
        }

        .dropdown-header {
          padding: 0.4rem 0.6rem;
        }

        .dropdown-user-name {
          font-weight: 700;
          font-size: 0.9rem;
        }

        .dropdown-user-email {
          font-size: 0.725rem;
          color: var(--text-muted);
        }

        .admin-pill {
          display: inline-block;
          margin-top: 0.2rem;
          font-size: 0.65rem;
          font-weight: 800;
          background-color: var(--warning-bg);
          color: var(--warning);
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.55rem 0.65rem;
          font-size: 0.825rem;
          font-weight: 600;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          transition: background-color var(--transition-fast);
        }

        .dropdown-item:hover {
          background-color: var(--bg-hover);
          color: var(--accent-primary);
        }

        .logout-btn {
          color: var(--accent-primary);
        }

        .logout-btn:hover {
          background-color: var(--danger-bg);
        }

        .mobile-nav-drawer {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding: 1.25rem;
          background-color: var(--bg-card);
          border-bottom: 1px solid var(--border-color);
          font-weight: 600;
          max-height: 80vh;
          overflow-y: auto;
        }

        .mobile-cat-header {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--text-muted);
          text-transform: uppercase;
          margin-top: 0.5rem;
        }

        .mobile-cat-item {
          font-size: 0.85rem;
          color: var(--text-secondary);
          padding-left: 0.5rem;
        }

        .mobile-auth-stack {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          margin-top: 0.5rem;
        }

        @media (max-width: 900px) {
          .desktop-only { display: none !important; }
        }

        @media (min-width: 901px) {
          .mobile-only { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
