const jwt = require('jsonwebtoken');
const db = require('../database');

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = db.prepare('SELECT id, username, email, role, is_active FROM users WHERE id = ?').get(decoded.userId);
        
        if (!user || !user.is_active) {
            return res.status(401).json({ message: 'User account is disabled or not found.' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired. Please login again.' });
        }
        return res.status(403).json({ message: 'Invalid token.' });
    }
}

function adminOnly(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required.' });
    }
    next();
}

function editorOrAdmin(req, res, next) {
    if (req.user.role !== 'admin' && req.user.role !== 'editor') {
        return res.status(403).json({ message: 'Editor or admin access required.' });
    }
    next();
}

module.exports = { authMiddleware, adminOnly, editorOrAdmin };
