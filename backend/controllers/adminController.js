// EN: Provide admin dashboard data to routes that already passed protect and admin middleware; SI: protect සහ admin middleware පසු කළ routes සඳහා dashboard දත්ත සපයයි.
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const store = require('../config/inMemoryStore');

const getDashboardStats = async (req, res) => {
  // EN: Aggregate counts, paid revenue, recent orders, and low stock from the active data source; SI: සක්‍රිය data source එකෙන් counts, ගෙවූ ආදායම, මෑත orders සහ අඩු තොගය එකතු කරයි.
  try {
    if (global.IS_IN_MEMORY_MODE) {
      // EN: Array filter/reduce operations provide the same dashboard shape without MongoDB; SI: MongoDB නොමැති විට array filter/reduce මඟින් එම dashboard හැඩය සකසයි.
      const totalUsers = store.users.filter((u) => u.role === 'customer').length;
      const totalProducts = store.products.length;
      const totalOrders = store.orders.length;
      const totalRevenue = store.orders
        .filter((o) => o.isPaid)
        .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

      const recentOrders = store.orders.slice(0, 5);
      const lowStockProducts = store.products.filter((p) => p.countInStock <= 5);

      return res.json({
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        recentOrders,
        lowStockProducts,
      });
    }

    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;
    const recentOrders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 }).limit(5);
    const lowStockProducts = await Product.find({ countInStock: { $lte: 5 } }).select('name countInStock price categoryName imageUrl');

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  // EN: List accounts newest-first while omitting password hashes from both response paths; SI: password hash ඉවත් කර accounts අලුත්ම සිට පැරණි පිළිවෙළට ලබා දෙයි.
  try {
    if (global.IS_IN_MEMORY_MODE) {
      const safeUsers = store.users.map(({ password, ...u }) => u);
      return res.json(safeUsers);
    }
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats, getUsers };
