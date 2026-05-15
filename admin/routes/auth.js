const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { authMiddleware } = require('../middleware/auth');

// Login
router.post('/login', (req, res) => {
    try {
        const { username, password, rememberMe } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required.' });
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

        if (!user) {
            // Log failed attempt
            db.prepare(`
                INSERT INTO activity_logs (action, details, target_type, ip_address)
                VALUES ('login_failed', ?, 'auth', ?)
            `).run(`Failed login attempt for username: ${username}`, req.ip);

            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        if (!user.is_active) {
            return res.status(403).json({ message: 'Account is disabled. Contact administrator.' });
        }

        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            db.prepare(`
                INSERT INTO activity_logs (user_id, action, details, target_type, ip_address)
                VALUES (?, 'login_failed', 'Invalid password attempt', 'auth', ?)
            `).run(user.id, req.ip);

            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        // Generate JWT token
        const expiresIn = rememberMe ? '7d' : (process.env.SESSION_TIMEOUT || '24h');
        const token = jwt.sign(
            { userId: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn }
        );

        // Update last login
        db.prepare('UPDATE users SET last_login = datetime("now") WHERE id = ?').run(user.id);

        // Log successful login
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type, ip_address)
            VALUES (?, 'login_success', 'User logged in successfully', 'auth', ?)
        `).run(user.id, req.ip);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                profile_image: user.profile_image
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
});

// Verify token
router.get('/verify', authMiddleware, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// Change password
router.post('/change-password', authMiddleware, (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters.' });
        }

        const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
        const validPassword = bcrypt.compareSync(currentPassword, user.password);

        if (!validPassword) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, 12);
        db.prepare('UPDATE users SET password = ?, updated_at = datetime("now") WHERE id = ?')
            .run(hashedPassword, req.user.id);

        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type)
            VALUES (?, 'password_changed', 'User changed their password', 'auth')
        `).run(req.user.id);

        res.json({ message: 'Password changed successfully.' });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Logout (log activity)
router.post('/logout', authMiddleware, (req, res) => {
    db.prepare(`
        INSERT INTO activity_logs (user_id, action, details, target_type, ip_address)
        VALUES (?, 'logout', 'User logged out', 'auth', ?)
    `).run(req.user.id, req.ip);

    res.json({ message: 'Logged out successfully.' });
});

module.exports = router;
