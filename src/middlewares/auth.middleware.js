const { verifyToken } = require('../utils/jwt');

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Token required' });

  try {
    const token = auth.split(' ')[1];
    req.user = verifyToken(token);
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};
