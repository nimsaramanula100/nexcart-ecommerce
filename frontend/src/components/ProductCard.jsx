import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const isOutOfStock = product.countInStock <= 0;
  const isWishlisted = isInWishlist(product._id);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  return (
    <div className="shein-card fade-in">
      {/* Product Image & Badges */}
      <div className="shein-card-img-wrapper">
        <Link to={`/products/${product._id}`}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="shein-card-img"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        {discountPercent > 0 ? (
          <span className="shein-card-badge sale">-{discountPercent}%</span>
        ) : product.isTrending ? (
          <span className="shein-card-badge trending">🔥 HOT</span>
        ) : product.isNewArrival ? (
          <span className="shein-card-badge">NEW</span>
        ) : null}

        {/* Wishlist Heart Button */}
        <button
          className={`shein-card-wishlist ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={16} fill={isWishlisted ? '#ff2460' : 'none'} color={isWishlisted ? '#ff2460' : 'currentColor'} />
        </button>

        {/* Quick Add Slide-up Button */}
        <div className="shein-card-quick-add">
          <button
            className="btn btn-dark btn-block btn-sm"
            onClick={() => addToCart(product, 1)}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={14} />
            <span>{isOutOfStock ? 'Sold Out' : 'Quick Add'}</span>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="shein-card-body">
        <div>
          <div className="shein-card-brand">{product.brand || 'SHEIN LUXE'}</div>
          <h3 className="shein-card-title">
            <Link to={`/products/${product._id}`}>{product.name}</Link>
          </h3>
        </div>

        {/* Color Swatch Preview (if available) */}
        {product.colors && product.colors.length > 0 && (
          <div className="color-swatches-preview">
            {product.colors.slice(0, 4).map((color, idx) => (
              <span
                key={idx}
                className="color-dot"
                style={{
                  backgroundColor: color.toLowerCase() === 'white' ? '#fff' : color.toLowerCase(),
                  border: color.toLowerCase() === 'white' ? '1px solid #ccc' : 'none',
                }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="more-colors">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        <div>
          {/* Price Row */}
          <div className="shein-card-price-row">
            <span className="shein-price-current">${product.price?.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="shein-price-original">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>

          {/* Social Proof / Sales & Rating */}
          <div className="shein-card-meta">
            <div className="rating-mini">
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span>{product.rating || 4.8}</span>
              <span style={{ color: 'var(--text-muted)' }}>({product.numReviews || 34})</span>
            </div>

            {product.soldCount > 0 && (
              <span className="shein-sold-count">{product.soldCount}+ sold</span>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .color-swatches-preview {
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 6px 0;
        }

        .color-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .more-colors {
          font-size: 0.65rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .rating-mini {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 0.75rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default ProductCard;
