const jwt = require('jsonwebtoken');

module.exports = function generateToken(user) {
  const token = jwt.sign(user,
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  }
  );
  return token;
}