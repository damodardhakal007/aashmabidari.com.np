require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files - main website
app.use(express.static(path.join(__dirname, '..')));

// Serve admin dashboard
app.use('/admin/dashboard', express.static(path.join(__dirname, 'dashboard')));

// Serve uploaded media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
const authRoutes = require('./routes/auth');
const pagesRoutes = require('./routes/pages');
const mediaRoutes = require('./routes/media');
const usersRoutes = require('./routes/users');
const settingsRoutes = require('./routes/settings');
const activityRoutes = require('./routes/activity');
const githubRoutes = require('./routes/github');

app.use('/admin/api/auth', authRoutes);
app.use('/admin/api/pages', pagesRoutes);
app.use('/admin/api/media', mediaRoutes);
app.use('/admin/api/users', usersRoutes);
app.use('/admin/api/settings', settingsRoutes);
app.use('/admin/api/activity', activityRoutes);
app.use('/admin/api/github', githubRoutes);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Admin Server running at http://localhost:${PORT}`);
    console.log(`📊 Dashboard: http://localhost:${PORT}/admin/dashboard/`);
    console.log(`🔐 Login: http://localhost:${PORT}/login.html`);
    console.log(`🌐 Website: http://localhost:${PORT}/\n`);
});
