// EN: Authentication and role checks used between route matching and controllers; SI: route තේරීම සහ controller අතර භාවිත වන authentication හා role පරීක්ෂා.
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const store = require('../config/inMemoryStore');

const protect = async (req, res, next) => {
  // EN: Verify a Bearer token, load its user from the active data source, then continue; SI: Bearer token සත්‍යාපනය කර සක්‍රිය data source එකෙන් user ලබාගෙන ඉදිරියට යයි.
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'nexcart_super_secret_jwt_key_2026_hndit_portfolio'
      );

      if (global.IS_IN_MEMORY_MODE) {
        // EN: Attach a password-free store user before passing control to the next handler; SI: ඊළඟ handler වෙත යැවීමට පෙර password නොමැති store user එක request එකට එක් කරයි.
        const found = store.users.find((u) => u._id === decoded.id);
        if (found) {
          const { password, ...safeUser } = found;
          req.user = safeUser;
          return next();
        }
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      next();
    } catch (error) {
      console.error('[Auth Middleware] Token error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const admin = (req, res, next) => {
  // EN: Allow only authenticated users with the admin role to reach the controller; SI: admin role සහිත authenticated users පමණක් controller වෙත යවයි.
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };
