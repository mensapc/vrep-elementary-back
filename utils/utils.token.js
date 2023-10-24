const jwt = require('jsonwebtoken');

module.exports = function generateToken(user) {
  const token = jwt.sign(user,
    process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  }
  );

  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
  });

  return { token, refreshToken };
}