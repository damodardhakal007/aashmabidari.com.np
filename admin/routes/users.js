const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', authMiddleware, adminOnly, (req, res) => {
    try {
        const users = db.prepare(`
            SELECT id, username, email, role, profile_image, is_active, last_login, created_at
            FROM users
            ORDER BY created_at DESC
        `).all();

        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users.' });
    }
});

// Get single user
router.get('/:id', authMiddleware, adminOnly, (req, res) => {
    try {
        const user = db.prepare(`
            SELECT id, username, email, role, profile_image, is_active, last_login, created_at
            FROM users WHERE id = ?
        `).get(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user.' });
    }
});

// Create new user (admin only)
router.post('/', authMiddleware, adminOnly, (req, res) => {
    try {
        const { username, password, email, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        // Check if username exists
        const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existing) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const hashedPassword = bcrypt.hashSync(password, 12);
        const validRoles = ['admin', 'editor', 'viewer'];
        const userRole = validRoles.includes(role) ? role : 'editor';

        const result = db.prepare(`
            INSERT INTO users (username, password, email, role)
            VALUES (?, ?, ?, ?)
        `).run(username, hashedPassword, email || null, userRole);

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type, target_id)
            VALUES (?, 'user_created', ?, 'user', ?)
        `).run(req.user.id, `Created user: ${username} (${userRole})`, result.lastInsertRowid);

        res.status(201).json({
            message: 'User created successfully.',
            user: { id: result.lastInsertRowid, username, email, role: userRole }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ message: 'Error creating user.' });
    }
});

// Update user (admin only)
router.put('/:id', authMiddleware, adminOnly, (req, res) => {
    try {
        const { email, role, is_active } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const validRoles = ['admin', 'editor', 'viewer'];
        const userRole = validRoles.includes(role) ? role : user.role;

        db.prepare(`
            UPDATE users SET 
                email = COALESCE(?, email),
                role = ?,
                is_active = COALESCE(?, is_active),
                updated_at = datetime('now')
            WHERE id = ?
        `).run(email, userRole, is_active, req.params.id);

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type, target_id)
            VALUES (?, 'user_updated', ?, 'user', ?)
        `).run(req.user.id, `Updated user: ${user.username}`, req.params.id);

        res.json({ message: 'User updated successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user.' });
    }
});

// Reset user password (admin only)
router.post('/:id/reset-password', authMiddleware, adminOnly, (req, res) => {
    try {
        const { newPassword } = req.body;
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters.' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 12);
        db.prepare('UPDATE users SET password = ?, updated_at = datetime("now") WHERE id = ?')
            .run(hashedPassword, req.params.id);

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type, target_id)
            VALUES (?, 'password_reset', ?, 'user', ?)
        `).run(req.user.id, `Reset password for: ${user.username}`, req.params.id);

        res.json({ message: 'Password reset successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password.' });
    }
});

// Delete user (admin only)
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
    try {
        const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent deleting yourself
        if (user.id === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account.' });
        }

        db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type)
            VALUES (?, 'user_deleted', ?, 'user')
        `).run(req.user.id, `Deleted user: ${user.username}`);

        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user.' });
    }
});

module.exports = router;
