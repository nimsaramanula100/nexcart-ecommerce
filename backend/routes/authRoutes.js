// EN: Map authentication/profile URLs to authController; protect profile operations with JWT middleware; SI: authentication/profile URLs authController වෙත යොමු කර profile ක්‍රියා JWT middleware මඟින් ආරක්ෂා කරයි.
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// EN: Public registration/login routes issue tokens; profile routes require the verified user first; SI: public register/login routes token ලබා දෙන අතර profile routes පෙර user සත්‍යාපනය කරයි.
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router;
