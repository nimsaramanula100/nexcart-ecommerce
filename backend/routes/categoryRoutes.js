// EN: Expose category reads publicly and require an admin for create/delete operations; SI: category කියවීම් public වන අතර create/delete සඳහා admin අවශ්‍යය.
const express = require('express');
const router = express.Router();
const {
  getCategories,
  createCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCategories)
  .post(protect, admin, createCategory);

router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;
