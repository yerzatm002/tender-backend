const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: '7d' });
}

function verifyToken(token) {
  return jwt.verify(token, secret);
}

module.exports = { generateToken, verifyToken };
