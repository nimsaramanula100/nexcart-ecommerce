import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, wishlistCount } = useWishlist();

  if (!Array.isArray(wishlist) || wishlistCount === 0) {
    return (
      <div className="empty-wishlist card text-center fade-in">
        <div className="icon-circle">
          <Heart size={48} />
        </div>
        <h2>YOUR WISHLIST IS EMPTY</h2>
        <p>Save items you love by tapping the heart icon on any product!</p>
        <Link to="/products" className="btn btn-primary mt-3">
          EXPLORE CATALOG <ArrowRight size={18} />
        </Link>
        <style>{`
          .empty-wishlist {
            padding: 5rem 2rem;
            max-width: 600px;
            margin: 3rem auto;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .icon-circle {
            width: 90px;
            height: 90px;
            border-radius: 50%;
            background: var(--danger-bg);
            color: var(--accent-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="wishlist-page fade-in">
      <div className="page-header">
        <h1>MY WISHLIST ({wishlistCount} ITEMS)</h1>
        <p>Your saved favorite styles and products ready for your bag.</p>
      </div>

      <div className="grid-products mt-4">
        {Array.isArray(wishlist) && wishlist?.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <style>{`
        .wishlist-page {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .page-header h1 {
          font-size: 2.2rem;
          font-weight: 900;
        }
      `}</style>
    </div>
  );
};

export default Wishlist;
