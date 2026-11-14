// EN: Route cart operations to cartController; router.use applies authentication to every endpoint below; SI: cart ක්‍රියා cartController වෙත යොමු කර router.use සියලු endpoints සඳහා authentication යොදයි.
const express = require('express');
const router = express.Router();
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// EN: Run this middleware before all cart routes so req.user is available to each handler; SI: සියලු cart routes වලට පෙර මෙය ධාවනය කර එක් එක් handler වෙත req.user ලබා දෙයි.
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.put('/item', updateCartItem);
router.delete('/item/:productId', removeFromCart);

module.exports = router;
