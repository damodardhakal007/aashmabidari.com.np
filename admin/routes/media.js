const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authMiddleware, editorOrAdmin } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${uuidv4()}${ext}`;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'application/pdf',
        'video/mp4', 'video/webm',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('File type not allowed'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

// Get all media
router.get('/', authMiddleware, (req, res) => {
    try {
        const media = db.prepare(`
            SELECT m.*, u.username as uploaded_by_name
            FROM media m
            LEFT JOIN users u ON m.uploaded_by = u.id
            ORDER BY m.created_at DESC
        `).all();

        res.json(media);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching media.' });
    }
});

// Upload single file
router.post('/upload', authMiddleware, editorOrAdmin, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        const result = db.prepare(`
            INSERT INTO media (filename, original_name, file_path, file_type, file_size, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(
            req.file.filename,
            req.file.originalname,
            `/uploads/${req.file.filename}`,
            req.file.mimetype,
            req.file.size,
            req.user.id
        );

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type, target_id)
            VALUES (?, 'media_uploaded', ?, 'media', ?)
        `).run(req.user.id, `Uploaded: ${req.file.originalname}`, result.lastInsertRowid);

        res.status(201).json({
            message: 'File uploaded successfully.',
            media: {
                id: result.lastInsertRowid,
                filename: req.file.filename,
                original_name: req.file.originalname,
                file_path: `/uploads/${req.file.filename}`,
                file_type: req.file.mimetype,
                file_size: req.file.size
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading file.' });
    }
});

// Upload multiple files
router.post('/upload-multiple', authMiddleware, editorOrAdmin, upload.array('files', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' });
        }

        const uploaded = [];
        const insertMedia = db.prepare(`
            INSERT INTO media (filename, original_name, file_path, file_type, file_size, uploaded_by)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const file of req.files) {
            const result = insertMedia.run(
                file.filename,
                file.originalname,
                `/uploads/${file.filename}`,
                file.mimetype,
                file.size,
                req.user.id
            );

            uploaded.push({
                id: result.lastInsertRowid,
                filename: file.filename,
                original_name: file.originalname,
                file_path: `/uploads/${file.filename}`,
                file_type: file.mimetype,
                file_size: file.size
            });
        }

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type)
            VALUES (?, 'media_uploaded', ?, 'media')
        `).run(req.user.id, `Uploaded ${req.files.length} files`);

        res.status(201).json({
            message: `${req.files.length} files uploaded successfully.`,
            media: uploaded
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading files.' });
    }
});

// Delete media
router.delete('/:id', authMiddleware, editorOrAdmin, (req, res) => {
    try {
        const media = db.prepare('SELECT * FROM media WHERE id = ?').get(req.params.id);

        if (!media) {
            return res.status(404).json({ message: 'Media not found.' });
        }

        // Delete physical file
        const filePath = path.join(__dirname, '..', 'uploads', media.filename);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        db.prepare('DELETE FROM media WHERE id = ?').run(req.params.id);

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type, target_id)
            VALUES (?, 'media_deleted', ?, 'media', ?)
        `).run(req.user.id, `Deleted: ${media.original_name}`, req.params.id);

        res.json({ message: 'Media deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting media.' });
    }
});

module.exports = router;
