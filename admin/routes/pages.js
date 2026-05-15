const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../database');
const { authMiddleware, editorOrAdmin } = require('../middleware/auth');

// Get all pages
router.get('/', authMiddleware, (req, res) => {
    try {
        const pages = db.prepare(`
            SELECT p.*, u1.username as created_by_name, u2.username as updated_by_name
            FROM pages p
            LEFT JOIN users u1 ON p.created_by = u1.id
            LEFT JOIN users u2 ON p.updated_by = u2.id
            ORDER BY p.menu_order ASC
        `).all();

        res.json(pages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching pages.' });
    }
});

// Get single page
router.get('/:id', authMiddleware, (req, res) => {
    try {
        const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id);
        
        if (!page) {
            return res.status(404).json({ message: 'Page not found.' });
        }

        // Read actual file content
        if (page.file_path) {
            const filePath = path.join(__dirname, '..', '..', page.file_path);
            if (fs.existsSync(filePath)) {
                page.file_content = fs.readFileSync(filePath, 'utf8');
            }
        }

        res.json(page);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching page.' });
    }
});

// Create new page
router.post('/', authMiddleware, editorOrAdmin, (req, res) => {
    try {
        const { title, slug, content, is_visible, menu_order } = req.body;

        if (!title || !slug) {
            return res.status(400).json({ message: 'Title and slug are required.' });
        }

        // Check if slug already exists
        const existing = db.prepare('SELECT id FROM pages WHERE slug = ?').get(slug);
        if (existing) {
            return res.status(400).json({ message: 'A page with this slug already exists.' });
        }

        const fileName = `${slug}.html`;
        const filePath = path.join(__dirname, '..', '..', fileName);

        // Create the HTML file
        const htmlContent = content || generatePageTemplate(title);
        fs.writeFileSync(filePath, htmlContent, 'utf8');

        const result = db.prepare(`
            INSERT INTO pages (title, slug, content, file_path, is_visible, menu_order, created_by, updated_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(title, slug, content, fileName, is_visible ? 1 : 0, menu_order || 0, req.user.id, req.user.id);

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type, target_id)
            VALUES (?, 'page_created', ?, 'page', ?)
        `).run(req.user.id, `Created page: ${title}`, result.lastInsertRowid);

        res.status(201).json({ 
            message: 'Page created successfully.', 
            id: result.lastInsertRowid,
            file_path: fileName
        });
    } catch (error) {
        console.error('Create page error:', error);
        res.status(500).json({ message: 'Error creating page.' });
    }
});

// Update page content
router.put('/:id', authMiddleware, editorOrAdmin, (req, res) => {
    try {
        const { title, content, is_visible, menu_order } = req.body;
        const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found.' });
        }

        // Update the actual file
        if (content && page.file_path) {
            const filePath = path.join(__dirname, '..', '..', page.file_path);
            fs.writeFileSync(filePath, content, 'utf8');
        }

        // Update database
        db.prepare(`
            UPDATE pages SET 
                title = COALESCE(?, title),
                content = COALESCE(?, content),
                is_visible = COALESCE(?, is_visible),
                menu_order = COALESCE(?, menu_order),
                updated_by = ?,
                updated_at = datetime('now')
            WHERE id = ?
        `).run(title, content, is_visible, menu_order, req.user.id, req.params.id);

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type, target_id)
            VALUES (?, 'page_edited', ?, 'page', ?)
        `).run(req.user.id, `Edited page: ${page.title}`, req.params.id);

        res.json({ message: 'Page updated successfully.' });
    } catch (error) {
        console.error('Update page error:', error);
        res.status(500).json({ message: 'Error updating page.' });
    }
});

// Delete page
router.delete('/:id', authMiddleware, editorOrAdmin, (req, res) => {
    try {
        const page = db.prepare('SELECT * FROM pages WHERE id = ?').get(req.params.id);

        if (!page) {
            return res.status(404).json({ message: 'Page not found.' });
        }

        // Don't allow deleting the home page
        if (page.slug === 'home') {
            return res.status(400).json({ message: 'Cannot delete the home page.' });
        }

        // Delete the file
        if (page.file_path) {
            const filePath = path.join(__dirname, '..', '..', page.file_path);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        db.prepare('DELETE FROM pages WHERE id = ?').run(req.params.id);

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type, target_id)
            VALUES (?, 'page_deleted', ?, 'page', ?)
        `).run(req.user.id, `Deleted page: ${page.title}`, req.params.id);

        res.json({ message: 'Page deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting page.' });
    }
});

// Reorder pages
router.post('/reorder', authMiddleware, editorOrAdmin, (req, res) => {
    try {
        const { pages } = req.body;
        const updateOrder = db.prepare('UPDATE pages SET menu_order = ? WHERE id = ?');
        
        const transaction = db.transaction(() => {
            for (const page of pages) {
                updateOrder.run(page.order, page.id);
            }
        });
        transaction();

        res.json({ message: 'Pages reordered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error reordering pages.' });
    }
});

// Helper function to generate page template
function generatePageTemplate(title) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    <link rel="stylesheet" href="style.css">
    <title>${title} - Aashma Bidari</title>
</head>
<body>
    <!-- HEADER SECTION -->
    <header class="header">
        <a href="index.html#home" class="logo">Aashma Bidari</a>
        <i class='bx bx-menu' id="menu-icon"></i>
        <nav class="navbar">
            <a href="index.html#home">Home</a>
            <a href="about.html">About</a>
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="index.html#services">Services</a>
            <a href="contact-me.html">Contact Me</a>
        </nav>
    </header>

    <!-- Page Content -->
    <section class="about">
        <div class="about-content">
            <h2 class="heading">${title}</h2>
            <p>Page content goes here...</p>
        </div>
    </section>

    <!-- Footer Section -->
    <footer class="footer">
        <div class="social">
            <a href="https://www.facebook.com/aashma.bidari.2025" target="_blank"><i class='bx bxl-facebook'></i></a>
            <a href="https://instagram.com/aashma._dhakal" target="_blank"><i class='bx bxl-instagram'></i></a>
            <a href="https://play.google.com/store/apps/details?id=com.bank.damodardhakal&hl=ne" target="_blank"><i class='bx bxl-play-store'></i></a>
        </div>
        <p class="copyright">© Aashma Bidari - All Rights Reserved</p>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
}

module.exports = router;
