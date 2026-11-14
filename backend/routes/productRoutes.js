// EN: Product router connects public catalogue reads and admin writes to productController; SI: public catalogue කියවීම් සහ admin වෙනස්කම් productController වෙත සම්බන්ධ කරයි.
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getFeaturedProducts,
  getTrendingProducts,
  getNewArrivals,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// EN: Chained route handlers share a path; write handlers run authentication and role middleware before the controller; SI: එකම path එකේ handlers chain කර write ක්‍රියා controller ට පෙර authentication/role පරීක්ෂා කරයි.
router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.get('/featured', getFeaturedProducts);
router.get('/trending', getTrendingProducts);
router.get('/new-arrivals', getNewArrivals);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
