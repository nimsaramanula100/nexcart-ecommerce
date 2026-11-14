import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

// Shared cart state: local storage supports guests, while signed-in changes are synchronized with the API.
// පොදු cart තත්ත්වය: අමුත්තන්ට local storage භාවිත කර login පසු වෙනස්කම් API සමඟ සමමුහුර්ත කරයි.
const CartContext = createContext();

// Provider derives totals from items and publishes cart, promo, and toast actions to the app.
// Provider එක භාණ්ඩවලින් එකතුව ගණනය කර cart, promo සහ toast ක්‍රියා යෙදුමට ලබා දෙයි.
export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('nexcart_cart');
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // A signed-in session loads its server cart; a separate effect persists the merged state locally.
  // login සැසිය server cart ලබාගනී; වෙනම effect එක ඒකාබද්ධ තත්ත්වය locally සුරකියි.
  useEffect(() => {
    if (user && user.token) {
      fetchServerCart();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nexcart_cart', JSON.stringify(Array.isArray(cartItems) ? cartItems : []));
  }, [cartItems]);

  // Toast messages are short-lived UI feedback shared with the global Toast component.
  // Toast පණිවිඩ ගෝලීය Toast component එක සමඟ බෙදාගෙන කෙටි කාලයකින් ඉවත් වේ.
  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Normalize API cart items and retain local-only catalog items during synchronization.
  // API cart items සාමාන්‍යකරණය කර සමමුහුර්තයේදී local-only භාණ්ඩ රඳවා ගනී.
  const fetchServerCart = async () => {
    try {
      const { data } = await API.get('/cart');
      if (data && Array.isArray(data.items)) {
        const formattedItems = (Array.isArray(data.items) ? data.items : []).map((item) => ({
          _id: item.product?._id || item.product,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        }));
        setCartItems((currentItems) => {
          const localItems = currentItems.filter((item) => String(item._id).startsWith('local-'));
          const localIds = new Set(localItems.map((item) => item._id));
          return [...localItems, ...formattedItems.filter((item) => !localIds.has(item._id))];
        });
      }
    } catch (error) {
      console.warn('[Cart] Server cart sync error, using local cart state.');
    }
  };

  // Merge matching variants locally first, then sync non-local products for signed-in users.
  // එකම variant දේශීය cart එකට එකතු කර login පරිශීලකයන්ගේ server cart සමඟ සමමුහුර්ත කරයි.
  const addToCart = async (product, quantity = 1) => {
    const qty = Number(quantity);
    setCartItems((prevItems) => {
      const safePrev = Array.isArray(prevItems) ? prevItems : [];
      const existingIndex = safePrev.findIndex(
        (item) =>
          item._id === product._id &&
          item.selectedColor === product.selectedColor &&
          item.selectedSize === product.selectedSize
      );
      if (existingIndex > -1) {
        const updated = [...safePrev];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        return [
          ...safePrev,
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            categoryName: product.categoryName,
            countInStock: product.countInStock,
            selectedColor: product.selectedColor || '',
            selectedSize: product.selectedSize || '',
            quantity: qty,
          },
        ];
      }
    });

    showToast(`Added ${product.name} to shopping bag!`);

    if (user && user.token && !String(product._id).startsWith('local-')) {
      try {
        await API.post('/cart', { productId: product._id, quantity: qty });
      } catch (err) {
        console.error('Server sync error on add to cart:', err);
      }
    }
  };

  // Keep the item count positive; zero or less delegates to the removal flow.
  // ප්‍රමාණය ධනව තබා ශූන්‍ය/අඩු අගය ඉවත් කිරීමේ ක්‍රියාවට යොමු කරයි.
  const updateQuantity = async (productId, quantity) => {
    const qty = Number(quantity);
    if (qty <= 0) {
      return removeFromCart(productId);
    }

    setCartItems((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) => (item._id === productId ? { ...item, quantity: qty } : item))
    );

    if (user && user.token && !String(productId).startsWith('local-')) {
      try {
        await API.put('/item', { productId, quantity: qty });
      } catch (err) {
        console.error('Server sync error on update cart:', err);
      }
    }
  };

  // Remove from client state immediately and best-effort delete the server copy.
  // client තත්ත්වයෙන් වහා ඉවත් කර server පිටපත හැකි නම් මකා දමයි.
  const removeFromCart = async (productId) => {
    const safeCart = Array.isArray(cartItems) ? cartItems : [];
    const targetItem = safeCart.find((i) => i._id === productId);
    setCartItems((prev) => (Array.isArray(prev) ? prev : []).filter((item) => item._id !== productId));

    if (targetItem) {
      showToast(`Removed ${targetItem.name} from bag`, 'info');
    }

    if (user && user.token && !String(productId).startsWith('local-')) {
      try {
        await API.delete(`/cart/item/${productId}`);
      } catch (err) {
        console.error('Server sync error on remove from cart:', err);
      }
    }
  };

  // Clear items and discounts together, then request server cleanup for authenticated users.
  // භාණ්ඩ සහ වට්ටම් එකට හිස් කර පිවිසි අය සඳහා server එකත් පිරිසිදු කරයි.
  const clearCart = async () => {
    setCartItems([]);
    setAppliedPromo('');
    setDiscountPercent(0);
    if (user && user.token) {
      try {
        await API.delete('/cart');
      } catch (err) {
        console.error('Server sync error on clear cart:', err);
      }
    }
  };

  // Promo codes set the shared discount percentage used by both cart and checkout totals.
  // promo code එක cart සහ checkout එකතු සඳහා පොදු වට්ටම් ප්‍රතිශතය සකසයි.
  const applyPromoCode = (code) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'SHEINVIP') {
      setDiscountPercent(15);
      setAppliedPromo('SHEINVIP (15% OFF)');
      showToast('Promo code SHEINVIP applied! 15% OFF your cart', 'success');
      return true;
    } else if (cleanCode === 'FLASH20') {
      setDiscountPercent(20);
      setAppliedPromo('FLASH20 (20% OFF)');
      showToast('Promo code FLASH20 applied! 20% OFF your cart', 'success');
      return true;
    } else if (cleanCode === 'FREE') {
      setDiscountPercent(10);
      setAppliedPromo('FREE (10% OFF)');
      showToast('Promo code FREE applied! 10% OFF', 'success');
      return true;
    } else {
      showToast('Invalid promo code. Try SHEINVIP', 'error');
      return false;
    }
  };

  const removePromoCode = () => {
    setAppliedPromo('');
    setDiscountPercent(0);
    showToast('Promo code removed', 'info');
  };

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const cartCount = safeCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = safeCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discountAmount = (cartSubtotal * discountPercent) / 100;
  const shippingFee = cartSubtotal >= 15000 || cartItems.length === 0 ? 0 : 750;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartSubtotal,
        cartTotal,
        discountPercent,
        discountAmount,
        appliedPromo,
        shippingFee,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
