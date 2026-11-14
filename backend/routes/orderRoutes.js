// EN: Connect order endpoints to orderController, allowing admin-only listing/status changes; SI: order endpoints orderController වෙත සම්බන්ධ කර listing/status වෙනස්කම් admin සඳහා පමණක් සීමා කරයි.
const express = require('express');
const router = express.Router();
const {
  addOrderItems,
  getOrderById,
  getMyOrders,
  getOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// EN: Customers create orders; only admins may list every order; SI: customers order සාදන අතර සියලු orders ලැයිස්තුගත කළ හැක්කේ admin ට පමණි.
router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
