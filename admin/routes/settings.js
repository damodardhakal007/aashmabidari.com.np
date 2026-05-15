const express = require('express');
const router = express.Router();
const db = require('../database');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get all settings
router.get('/', authMiddleware, (req, res) => {
    try {
        const settings = db.prepare('SELECT * FROM settings ORDER BY key ASC').all();
        const settingsObj = {};
        for (const s of settings) {
            settingsObj[s.key] = s.value;
        }
        res.json(settingsObj);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings.' });
    }
});

// Update settings (admin only)
router.put('/', authMiddleware, adminOnly, (req, res) => {
    try {
        const settings = req.body;
        
        const updateSetting = db.prepare(`
            INSERT INTO settings (key, value, updated_by, updated_at)
            VALUES (?, ?, ?, datetime('now'))
            ON CONFLICT(key) DO UPDATE SET 
                value = excluded.value,
                updated_by = excluded.updated_by,
                updated_at = datetime('now')
        `);

        const transaction = db.transaction(() => {
            for (const [key, value] of Object.entries(settings)) {
                updateSetting.run(key, value, req.user.id);
            }
        });
        transaction();

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type)
            VALUES (?, 'settings_updated', ?, 'settings')
        `).run(req.user.id, `Updated ${Object.keys(settings).length} settings`);

        res.json({ message: 'Settings updated successfully.' });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Error updating settings.' });
    }
});

// Get single setting
router.get('/:key', authMiddleware, (req, res) => {
    try {
        const setting = db.prepare('SELECT * FROM settings WHERE key = ?').get(req.params.key);
        if (!setting) {
            return res.status(404).json({ message: 'Setting not found.' });
        }
        res.json(setting);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching setting.' });
    }
});

module.exports = router;
