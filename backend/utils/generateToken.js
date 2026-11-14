// EN: Create signed JWTs used by authentication responses and protected routes; SI: authentication ප්‍රතිචාර සහ ආරක්ෂිත routes සඳහා අත්සන් කළ JWT සාදයි.
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // EN: Put the user ID in the token and set a 30-day expiry; SI: user ID token එකට ඇතුළත් කර දින 30ක කල් ඉකුත්වීමක් සකසයි.
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nexcart_super_secret_jwt_key_2026_hndit_portfolio', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
