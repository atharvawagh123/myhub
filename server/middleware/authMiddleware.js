const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const protect = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token, access denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = protect;
