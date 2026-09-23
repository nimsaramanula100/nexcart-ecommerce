import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Star, ShieldCheck, Truck, ArrowLeft, Plus, Minus, Heart, Check, Share2 } from 'lucide-react';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
        setSelectedImage(data.imageUrl);

        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);

        if (data.categoryName) {
          const relRes = await API.get(`/products?category=${encodeURIComponent(data.categoryName)}&limit=5`);
          setRelatedProducts(relRes.data.products.filter((p) => p._id !== data._id));
        }
      } catch (err) {
        setError('Product not found or invalid URL');
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, selectedColor, selectedSize }, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({ ...product, selectedColor, selectedSize }, quantity);
      navigate('/cart');
    }
  };

  if (loading) {
    return (
      <div className="card fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="skeleton" style={{ height: '350px', marginBottom: '1.5rem' }} />
        <div className="skeleton" style={{ height: '30px', width: '50%', margin: '0 auto 1rem' }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="card text-center" style={{ padding: '4rem 2rem' }}>
        <h2>Product Not Found</h2>
        <p className="text-muted">{error || 'The requested product does not exist.'}</p>
        <Link to="/products" className="btn btn-primary mt-3">
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    );
  }

  const isOutOfStock = product.countInStock <= 0;
  const isWishlisted = isInWishlist(product._id);
  const allImages = [product.imageUrl, ...(product.images || [])];

  return (
    <div className="product-details-page fade-in">
      <Link to="/products" className="back-link">
        <ArrowLeft size={16} /> Back to Catalog
      </Link>

      <div className="details-container card">
        {/* Left Column: Multi-Image Thumbnail Gallery */}
        <div className="gallery-section">
          <div className="thumbnails-col">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                className={`thumb-btn ${selectedImage === img ? 'active' : ''}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt="" />
              </button>
            ))}
          </div>

          <div className="main-image-wrap">
            <img src={selectedImage} alt={product.name} className="main-image" />
            <button
              className={`wishlist-floating-btn ${isWishlisted ? 'active' : ''}`}
              onClick={() => toggleWishlist(product)}
            >
              <Heart size={20} fill={isWishlisted ? '#ff2460' : 'none'} color={isWishlisted ? '#ff2460' : 'currentColor'} />
            </button>
          </div>
        </div>

        {/* Right Column: SHEIN Info & Choice Controls */}
        <div className="details-info">
          <div className="details-brand-bar">
            <span className="brand-tag">{product.brand || 'SHEIN LUXE'}</span>
            <span className="sku-tag">SKU: SH-{product._id.slice(-6).toUpperCase()}</span>
          </div>

          <h1 className="details-title">{product.name}</h1>

          {/* Social Proof */}
          <div className="details-rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={15}
                  className={i < Math.floor(product.rating || 4.8) ? 'star-filled' : 'star-empty'}
                />
              ))}
            </div>
            <span className="rating-num">{product.rating || 4.8}</span>
            <span className="reviews-text">({product.numReviews || 56} Customer Reviews)</span>
            <span className="sold-pill">{product.soldCount || 180}+ Sold</span>
          </div>

          {/* Price Box */}
          <div className="shein-details-price">
            <span className="price-main">${product.price?.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="price-original">${product.originalPrice?.toFixed(2)}</span>
            )}
            {product.originalPrice > product.price && (
              <span className="save-badge">
                SAVE ${ (product.originalPrice - product.price).toFixed(2) } (-{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
              </span>
            )}
          </div>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="choice-section">
              <label className="choice-label">COLOR: <strong>{selectedColor}</strong></label>
              <div className="color-swatches">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={`color-btn ${selectedColor === c ? 'active' : ''}`}
                    onClick={() => setSelectedColor(c)}
                  >
                    <span
                      className="swatch-circle"
                      style={{
                        backgroundColor: c.toLowerCase() === 'white' ? '#fff' : c.toLowerCase(),
                        border: c.toLowerCase() === 'white' ? '1px solid #ccc' : 'none',
                      }}
                    />
                    <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="choice-section">
              <label className="choice-label">SIZE: <strong>{selectedSize}</strong></label>
              <div className="size-buttons">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                    onClick={() => setSelectedSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls */}
          <div className="choice-section">
            <label className="choice-label">QUANTITY:</label>
            <div className="quantity-controls">
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isOutOfStock}
              >
                <Minus size={14} />
              </button>
              <span className="qty-num">{quantity}</span>
              <button
                className="qty-btn"
                onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))}
                disabled={quantity >= product.countInStock || isOutOfStock}
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons-row">
            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
            >
              <ShoppingCart size={20} /> ADD TO BAG
            </button>
            <button
              className="btn btn-dark btn-block btn-lg"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
            >
              BUY NOW
            </button>
          </div>

          {/* Value Badges */}
          <div className="perks-grid">
            <div className="perk-box">
              <Truck size={18} color="#ff2460" />
              <div>
                <strong>Free Delivery</strong>
                <p>Express dispatch within 24 hours</p>
              </div>
            </div>
            <div className="perk-box">
              <ShieldCheck size={18} color="#10b981" />
              <div>
                <strong>Authentic Guarantee</strong>
                <p>30-day money-back return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Description, Reviews, Shipping) */}
      <div className="product-tabs-wrapper card mt-4">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Product Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Customer Reviews ({product.numReviews || 56})
          </button>
          <button
            className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Returns
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="tab-pane fade-in">
              <p>{product.description}</p>
              <ul className="details-bullets">
                <li>Material: High-Grade Premium Quality Blend</li>
                <li>Fit Type: Standard SHEIN True-to-size</li>
                <li>Care Instructions: Machine wash cold, dry flat</li>
                <li>Origin: Imported & Certified QC Passed</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="tab-pane fade-in">
              <div className="reviews-summary">
                <div className="rating-big">{product.rating || 4.8} / 5.0</div>
                <div>Based on {product.numReviews || 56} verified customer ratings</div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="tab-pane fade-in">
              <p>Standard Shipping: 3-5 business days across Sri Lanka & Worldwide ($4.99 or FREE over $49).</p>
              <p>Express Shipping: 1-2 business days with live tracking link ($9.99).</p>
              <p>Returns: 30-day return period with prepaid shipping label.</p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="related-section mt-5">
          <h2 className="mb-3">YOU MIGHT ALSO LIKE</h2>
          <div className="grid-products">
            {relatedProducts.map((relProd) => (
              <ProductCard key={relProd._id} product={relProd} />
            ))}
          </div>
        </section>
      )}

      <style>{`
        .product-details-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .back-link:hover {
          color: var(--accent-primary);
        }

        .details-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          padding: 2.5rem;
        }

        .gallery-section {
          display: flex;
          gap: 1rem;
        }

        .thumbnails-col {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .thumb-btn {
          width: 65px;
          height: 80px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 2px solid transparent;
          background: #f1f3f5;
        }

        .thumb-btn.active {
          border-color: var(--accent-primary);
        }

        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .main-image-wrap {
          position: relative;
          flex: 1;
          height: 480px;
          border-radius: var(--radius-md);
          overflow: hidden;
          background: #f1f3f5;
        }

        .main-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .wishlist-floating-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .details-info {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .details-brand-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
        }

        .brand-tag {
          color: var(--accent-primary);
          text-transform: uppercase;
        }

        .details-title {
          font-size: 2.2rem;
          font-weight: 900;
          line-height: 1.2;
        }

        .details-rating-row {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.85rem;
        }

        .sold-pill {
          background: var(--warning-bg);
          color: var(--warning);
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .shein-details-price {
          display: flex;
          align-items: baseline;
          gap: 1rem;
        }

        .price-main {
          font-family: 'Outfit', sans-serif;
          font-size: 2.5rem;
          font-weight: 900;
          color: var(--accent-primary);
        }

        .price-original {
          font-size: 1.2rem;
          color: var(--text-muted);
          text-decoration: line-through;
        }

        .save-badge {
          background: var(--accent-primary);
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .choice-section {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .choice-label {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--text-secondary);
        }

        .color-swatches {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .color-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          font-size: 0.85rem;
          font-weight: 600;
        }

        .color-btn.active {
          border-color: var(--accent-primary);
          background: var(--danger-bg);
          color: var(--accent-primary);
        }

        .swatch-circle {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .size-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .size-btn {
          padding: 8px 16px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          font-weight: 700;
          font-size: 0.85rem;
        }

        .size-btn.active {
          background: #111;
          color: white;
          border-color: #111;
        }

        .action-buttons-row {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .perks-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .perk-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.8rem;
        }

        .product-tabs-wrapper {
          padding: 1.5rem;
        }

        .tabs-header {
          display: flex;
          gap: 1.5rem;
          border-bottom: 2px solid var(--border-color);
          margin-bottom: 1.5rem;
        }

        .tab-btn {
          padding-bottom: 0.75rem;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--text-muted);
          border-bottom: 3px solid transparent;
        }

        .tab-btn.active {
          color: var(--accent-primary);
          border-bottom-color: var(--accent-primary);
        }

        .tab-pane p {
          line-height: 1.7;
          color: var(--text-secondary);
        }

        .details-bullets {
          margin-top: 1rem;
          padding-left: 1.25rem;
          color: var(--text-secondary);
        }

        @media (max-width: 900px) {
          .details-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
