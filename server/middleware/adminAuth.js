const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT is_admin FROM users WHERE id = ?', [decoded.id]);
    if (rows.length === 0 || !rows[0].is_admin) {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = adminMiddleware;
