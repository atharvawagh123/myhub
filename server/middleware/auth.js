const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET = process.env.JWT_SECRET || 'your-fallback-secret';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const tokenValue = token.replace('Bearer ', '');
        const decoded = jwt.verify(tokenValue, JWT_SECRET);

        
        const user = await User.findById(decoded.id);
        
        // if (!user || user.tokenversion !== decoded.tokenversion) {
        //     return res.status(401).json({ message: 'Invalid token or user not found' });
        // }
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Set the entire user object in req.user
        req.user = user;
        next();
    } catch (err) {
        console.log('Auth Error:', err);
        res.status(401).json({ message: 'Please authenticate properly' });
    }
};

module.exports = auth;