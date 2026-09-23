const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const store = require('../config/inMemoryStore');

const addOrderItems = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentResult } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    if (global.IS_IN_MEMORY_MODE) {
      // Reduce stock in memory
      for (const item of orderItems) {
        const prod = store.products.find((p) => p._id === item.product || p._id === item.product?._id);
        if (prod) {
          prod.countInStock = Math.max(0, prod.countInStock - item.quantity);
        }
      }

      const newOrder = {
        _id: `ord_${Date.now()}`,
        user: { _id: req.user._id, name: req.user.name, email: req.user.email },
        orderItems,
        shippingAddress,
        paymentMethod: paymentMethod || 'Simulated Card Payment',
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        isPaid: true,
        paidAt: new Date(),
        paymentResult: paymentResult || {
          id: `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: req.user.email,
        },
        status: 'Pending',
        createdAt: new Date(),
      };

      store.orders.unshift(newOrder);
      store.carts[req.user._id] = { user: req.user._id, items: [], totalPrice: 0 };
      return res.status(201).json(newOrder);
    }

    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock = Math.max(0, product.countInStock - item.quantity);
        await product.save();
      }
    }

    const order = new Order({
      orderItems, user: req.user._id, shippingAddress, paymentMethod: paymentMethod || 'Simulated Card Payment',
      itemsPrice, taxPrice, shippingPrice, totalPrice, isPaid: true, paidAt: Date.now(), status: 'Pending',
    });

    const createdOrder = await order.save();
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [], totalPrice: 0 });
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    if (global.IS_IN_MEMORY_MODE) {
      const order = store.orders.find((o) => o._id === req.params.id);
      if (order) return res.json(order);
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (order) {
      if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
        res.json(order);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    if (global.IS_IN_MEMORY_MODE) {
      const userOrders = store.orders.filter(
        (o) => (o.user._id || o.user) === req.user._id
      );
      return res.json(userOrders);
    }
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    if (global.IS_IN_MEMORY_MODE) {
      return res.json(store.orders);
    }
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (global.IS_IN_MEMORY_MODE) {
      const order = store.orders.find((o) => o._id === req.params.id);
      if (order) {
        order.status = status || order.status;
        if (status === 'Delivered') {
          order.isDelivered = true;
          order.deliveredAt = new Date();
        }
        return res.json(order);
      }
      return res.status(404).json({ message: 'Order not found' });
    }

    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = status || order.status;
      if (status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addOrderItems, getOrderById, getMyOrders, getOrders, updateOrderStatus };
