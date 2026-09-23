const Cart = require('../models/Cart');
const Product = require('../models/Product');
const store = require('../config/inMemoryStore');

const getCart = async (req, res) => {
  try {
    if (global.IS_IN_MEMORY_MODE) {
      const userCart = store.carts[req.user._id] || { user: req.user._id, items: [], totalPrice: 0 };
      store.carts[req.user._id] = userCart;
      return res.json(userCart);
    }

    let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [], totalPrice: 0 });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (global.IS_IN_MEMORY_MODE) {
      const product = store.products.find((p) => p._id === productId);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      let cart = store.carts[req.user._id] || { user: req.user._id, items: [], totalPrice: 0 };
      const itemIndex = cart.items.findIndex((i) => i.product === productId || i.product._id === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({
          product: product,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: Number(quantity),
        });
      }

      cart.totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
      store.carts[req.user._id] = cart;
      return res.json(cart);
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: Number(quantity),
      });
    }

    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (quantity <= 0) return removeFromCart(req, res);

    if (global.IS_IN_MEMORY_MODE) {
      let cart = store.carts[req.user._id];
      if (!cart) return res.status(404).json({ message: 'Cart not found' });

      const itemIndex = cart.items.findIndex((i) => (i.product._id || i.product) === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = Number(quantity);
        cart.totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
        store.carts[req.user._id] = cart;
        return res.json(cart);
      }
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Number(quantity);
      cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      await cart.save();
      const updatedCart = await Cart.findById(cart._id).populate('items.product');
      return res.json(updatedCart);
    }
    return res.status(404).json({ message: 'Item not found in cart' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    if (global.IS_IN_MEMORY_MODE) {
      let cart = store.carts[req.user._id];
      if (cart) {
        cart.items = cart.items.filter((i) => (i.product._id || i.product) !== productId);
        cart.totalPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
        store.carts[req.user._id] = cart;
        return res.json(cart);
      }
      return res.status(404).json({ message: 'Cart not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    if (global.IS_IN_MEMORY_MODE) {
      store.carts[req.user._id] = { user: req.user._id, items: [], totalPrice: 0 };
      return res.json({ message: 'Cart cleared', items: [], totalPrice: 0 });
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }
    res.json({ message: 'Cart cleared', items: [], totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
