import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

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

  useEffect(() => {
    if (user && user.token) {
      fetchServerCart();
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('nexcart_cart', JSON.stringify(Array.isArray(cartItems) ? cartItems : []));
  }, [cartItems]);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

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
        setCartItems(formattedItems);
      }
    } catch (error) {
      console.warn('[Cart] Server cart sync error, using local cart state.');
    }
  };

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

    if (user && user.token) {
      try {
        await API.post('/cart', { productId: product._id, quantity: qty });
      } catch (err) {
        console.error('Server sync error on add to cart:', err);
      }
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const qty = Number(quantity);
    if (qty <= 0) {
      return removeFromCart(productId);
    }

    setCartItems((prev) =>
      (Array.isArray(prev) ? prev : []).map((item) => (item._id === productId ? { ...item, quantity: qty } : item))
    );

    if (user && user.token) {
      try {
        await API.put('/item', { productId, quantity: qty });
      } catch (err) {
        console.error('Server sync error on update cart:', err);
      }
    }
  };

  const removeFromCart = async (productId) => {
    const safeCart = Array.isArray(cartItems) ? cartItems : [];
    const targetItem = safeCart.find((i) => i._id === productId);
    setCartItems((prev) => (Array.isArray(prev) ? prev : []).filter((item) => item._id !== productId));

    if (targetItem) {
      showToast(`Removed ${targetItem.name} from bag`, 'info');
    }

    if (user && user.token) {
      try {
        await API.delete(`/cart/item/${productId}`);
      } catch (err) {
        console.error('Server sync error on remove from cart:', err);
      }
    }
  };

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
  const shippingFee = cartSubtotal >= 49 || cartItems.length === 0 ? 0 : 4.99;
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
