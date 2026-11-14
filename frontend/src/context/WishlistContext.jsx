import React, { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

// Read-only consumer hook for components that need shared saved-product state.
// පොදු කැමති භාණ්ඩ තත්ත්වය අවශ්‍ය components සඳහා consumer hook එක.
export const useWishlist = () => useContext(WishlistContext);

// Wishlist provider persists saved products and offers add/remove/toggle helpers.
// Wishlist provider සුරැකි භාණ්ඩ persist කර add/remove/toggle helper සපයයි.
export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('nexcart_wishlist');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('nexcart_wishlist', JSON.stringify(Array.isArray(wishlist) ? wishlist : []));
  }, [wishlist]);

  // Avoid duplicate IDs before adding a product / එකම ID ඇති භාණ්ඩ නැවත එකතු නොකරයි.
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      if (safePrev.some((item) => item._id === product._id)) return safePrev;
      return [...safePrev, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => (Array.isArray(prev) ? prev : []).filter((item) => item._id !== productId));
  };

  const isInWishlist = (productId) => {
    const safeWishlist = Array.isArray(wishlist) ? wishlist : [];
    return safeWishlist.some((item) => item._id === productId);
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

  return (
    <WishlistContext.Provider
      value={{
        wishlist: safeWishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        wishlistCount: safeWishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
