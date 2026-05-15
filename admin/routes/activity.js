const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

// Get activity logs
router.get('/', authMiddleware, (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;
        const type = req.query.type;

        let query = `
            SELECT al.*, u.username
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
        `;
        const params = [];

        if (type) {
            query += ' WHERE al.target_type = ?';
            params.push(type);
        }

        query += ' ORDER BY al.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const logs = db.prepare(query).all(...params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM activity_logs';
        if (type) {
            countQuery += ' WHERE target_type = ?';
        }
        const total = type 
            ? db.prepare(countQuery).get(type).total 
            : db.prepare(countQuery).get().total;

        res.json({ logs, total, limit, offset });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activity logs.' });
    }
});

// Get activity stats (for dashboard)
router.get('/stats', authMiddleware, (req, res) => {
    try {
        const today = db.prepare(`
            SELECT COUNT(*) as count FROM activity_logs 
            WHERE date(created_at) = date('now')
        `).get();

        const thisWeek = db.prepare(`
            SELECT COUNT(*) as count FROM activity_logs 
            WHERE created_at >= datetime('now', '-7 days')
        `).get();

        const byType = db.prepare(`
            SELECT target_type, COUNT(*) as count 
            FROM activity_logs 
            WHERE created_at >= datetime('now', '-30 days')
            GROUP BY target_type
        `).all();

        const recentEdits = db.prepare(`
            SELECT al.*, u.username
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            WHERE al.action LIKE '%edit%' OR al.action LIKE '%created%' OR al.action LIKE '%upload%'
            ORDER BY al.created_at DESC
            LIMIT 10
        `).all();

        const totalPages = db.prepare('SELECT COUNT(*) as count FROM pages').get();
        const totalMedia = db.prepare('SELECT COUNT(*) as count FROM media').get();
        const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();

        res.json({
            today: today.count,
            thisWeek: thisWeek.count,
            byType,
            recentEdits,
            totalPages: totalPages.count,
            totalMedia: totalMedia.count,
            totalUsers: totalUsers.count
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats.' });
    }
});

module.exports = router;
