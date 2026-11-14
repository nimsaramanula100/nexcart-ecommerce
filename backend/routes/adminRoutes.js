// EN: Define admin-only dashboard endpoints; protect authenticates first, then admin checks the role; SI: admin පමණක් භාවිත කරන dashboard endpoints නිර්වචනය කරයි; protect පසුව admin role පරීක්ෂා කරයි.
const express = require('express');
const router = express.Router();
const { getDashboardStats, getUsers } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getUsers);

module.exports = router;
