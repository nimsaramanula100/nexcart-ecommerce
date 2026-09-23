import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Flame,
  Clock,
  Zap,
  Tag,
  Gift,
  Award,
} from 'lucide-react';
import API from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Flash Sale Countdown State
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, trendRes, newRes, catRes] = await Promise.all([
          API.get('/products/featured'),
          API.get('/products/trending'),
          API.get('/products/new-arrivals'),
          API.get('/categories'),
        ]);
        setFeaturedProducts(featRes.data);
        setTrendingProducts(trendRes.data.slice(0, 8));
        setNewArrivals(newRes.data.slice(0, 8));
        setCategories(catRes.data);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="shein-home-page">
      {/* High-Fashion Hero Section */}
      <section className="shein-hero">
        <div className="shein-hero-bg">
          <div className="shein-hero-overlay" />
          <img
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80"
            alt="SHEIN Luxe Fashion Hero"
            className="shein-hero-img"
          />
        </div>

        <div className="shein-hero-content">
          <span className="shein-badge">
            <Sparkles size={14} /> NEW SEASON FASHION DROP 2026
          </span>
          <h1 className="shein-hero-title">
            HIGH FASHION <br />
            <span className="shein-gradient-text">UNBEATABLE PRICES</span>
          </h1>
          <p className="shein-hero-desc">
            Explore 50+ fresh styles across dresses, streetwear, shoes, beauty, tech, and daily accessories.
          </p>

          <div className="shein-hero-btns">
            <Link to="/products" className="btn btn-primary hero-btn">
              SHOP ALL STYLES <ArrowRight size={18} />
            </Link>
            <Link to="/products?category=Women's%20Fashion" className="btn btn-dark hero-btn">
              WOMEN'S TRENDS
            </Link>
          </div>

          {/* Quick Perks */}
          <div className="shein-perks-row">
            <div className="perk-pill"><Zap size={14} color="#ff2460" /> Daily Flash Deals</div>
            <div className="perk-pill"><Gift size={14} color="#f59e0b" /> Free Gifts & Code SHEINVIP</div>
            <div className="perk-pill"><Award size={14} color="#10b981" /> Guaranteed Quality</div>
          </div>
        </div>
      </section>

      {/* Flash Sale Countdown Bar */}
      <div className="flash-sale-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Clock size={28} className="pulse-icon" />
          <div>
            <h3 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>FLASH SALE ENDS IN</h3>
            <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.85 }}>Up to 70% OFF selected trendy styles!</p>
          </div>
        </div>

        <div className="countdown-digits">
          <div className="countdown-box">
            {String(timeLeft.hours).padStart(2, '0')}
            <span className="countdown-label">HOURS</span>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>:</span>
          <div className="countdown-box">
            {String(timeLeft.minutes).padStart(2, '0')}
            <span className="countdown-label">MINS</span>
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>:</span>
          <div className="countdown-box">
            {String(timeLeft.seconds).padStart(2, '0')}
            <span className="countdown-label">SECS</span>
          </div>
        </div>

        <Link to="/products?sort=price-asc" className="btn btn-dark btn-sm">
          VIEW FLASH DEALS <ArrowRight size={16} />
        </Link>
      </div>

      {/* Visual Category Tiles */}
      <section className="category-tiles-section">
        <div className="section-title-wrap">
          <h2>EXPLORE POPULAR CATEGORIES</h2>
          <p>Find what you love across 10+ curated departments</p>
        </div>

        <div className="category-tile-grid">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="cat-tile-card"
            >
              <div className="cat-tile-img-wrap">
                <img src={cat.imageUrl} alt={cat.name} className="cat-tile-img" />
              </div>
              <div className="cat-tile-info">
                <h4>{cat.name}</h4>
                <span>Explore &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Hot Sales */}
      <section className="section-block">
        <div className="section-title-wrap flex-title">
          <div>
            <span className="hot-tag"><Flame size={16} /> POPULAR NOW</span>
            <h2>TRENDING HOT SALES</h2>
          </div>
          <Link to="/products?sort=rating" className="view-link">
            See All Trending &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid-products">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shein-card" style={{ height: '320px' }}>
                <div className="skeleton" style={{ height: '220px' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-products">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* SHEIN Style Promo Banner */}
      <section className="shein-middle-banner">
        <div className="middle-banner-content">
          <span className="vip-badge"><Tag size={14} /> VIP DISCOUNT CODE</span>
          <h2>SPRING / SUMMER LOOKBOOK</h2>
          <p>Use code <strong>SHEINVIP</strong> at checkout to get an extra 15% OFF your cart + free delivery.</p>
          <Link to="/products" className="btn btn-primary">
            SHOP LOOKBOOK NOW
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="section-block">
        <div className="section-title-wrap flex-title">
          <div>
            <span className="hot-tag" style={{ color: '#10b981' }}><Sparkles size={16} /> FRESH ARRIVALS</span>
            <h2>NEW IN STORES</h2>
          </div>
          <Link to="/products?sort=newest" className="view-link">
            See New Arrivals &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid-products">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="shein-card" style={{ height: '320px' }}>
                <div className="skeleton" style={{ height: '220px' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid-products">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <style>{`
        .shein-home-page {
          display: flex;
          flex-direction: column;
          gap: 3.5rem;
        }

        .shein-hero {
          position: relative;
          height: 520px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 0 3.5rem;
          color: white;
          box-shadow: var(--shadow-lg);
        }

        .shein-hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .shein-hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
        }

        .shein-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(17,17,17,0.92) 0%, rgba(17,17,17,0.65) 50%, rgba(17,17,17,0.1) 100%);
          z-index: 2;
        }

        .shein-hero-content {
          position: relative;
          z-index: 3;
          max-width: 620px;
        }

        .shein-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-primary);
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: var(--radius-full);
          letter-spacing: 0.5px;
          margin-bottom: 1.25rem;
        }

        .shein-hero-title {
          font-size: 3.2rem;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -1px;
          margin-bottom: 1rem;
          color: white;
        }

        .shein-gradient-text {
          background: linear-gradient(135deg, #ff2460 0%, #ff758c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .shein-hero-desc {
          font-size: 1.1rem;
          color: #e9ecef;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .shein-hero-btns {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .hero-btn {
          padding: 0.85rem 1.75rem;
          font-size: 0.95rem;
          letter-spacing: 0.5px;
        }

        .shein-perks-row {
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .perk-pill {
          font-size: 0.8rem;
          font-weight: 700;
          color: #f8f9fa;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .section-title-wrap {
          margin-bottom: 1.75rem;
        }

        .section-title-wrap.flex-title {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
        }

        .section-title-wrap h2 {
          font-size: 1.75rem;
          font-weight: 800;
          letter-spacing: -0.5px;
        }

        .section-title-wrap p {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .hot-tag {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--accent-primary);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          letter-spacing: 0.5px;
        }

        .view-link {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--accent-primary);
        }

        .category-tile-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
          gap: 1.25rem;
        }

        .cat-tile-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .cat-tile-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--accent-primary);
        }

        .cat-tile-img-wrap {
          height: 160px;
          overflow: hidden;
          background: #f1f3f5;
        }

        .cat-tile-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .cat-tile-card:hover .cat-tile-img {
          transform: scale(1.08);
        }

        .cat-tile-info {
          padding: 1rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .cat-tile-info h4 {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .cat-tile-info span {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--accent-primary);
        }

        .shein-middle-banner {
          background: linear-gradient(135deg, #111111 0%, #2b2b2b 100%);
          color: white;
          padding: 3.5rem 2.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          text-align: center;
          position: relative;
        }

        .vip-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: var(--accent-gold);
          color: #111;
          font-weight: 800;
          font-size: 0.75rem;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          margin-bottom: 1rem;
        }

        .middle-banner-content h2 {
          color: white;
          font-size: 2.2rem;
          margin-bottom: 0.75rem;
          letter-spacing: 0.5px;
        }

        .middle-banner-content p {
          color: #ced4da;
          font-size: 1.05rem;
          margin-bottom: 1.75rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (max-width: 768px) {
          .shein-hero {
            height: auto;
            padding: 3rem 1.5rem;
          }
          .shein-hero-title {
            font-size: 2.2rem;
          }
          .flash-sale-box {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
