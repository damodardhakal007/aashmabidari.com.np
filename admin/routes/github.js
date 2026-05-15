const express = require('express');
const router = express.Router();
const { Octokit } = require('octokit');
const fs = require('fs');
const path = require('path');
const db = require('../database');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get GitHub connection status
router.get('/status', authMiddleware, (req, res) => {
    try {
        const hasToken = !!process.env.GITHUB_TOKEN;
        const hasRepo = !!process.env.GITHUB_REPO;
        const hasOwner = !!process.env.GITHUB_OWNER;

        const recentBackups = db.prepare(`
            SELECT * FROM github_logs 
            ORDER BY created_at DESC 
            LIMIT 10
        `).all();

        res.json({
            connected: hasToken && hasRepo && hasOwner,
            config: {
                hasToken,
                hasRepo,
                hasOwner,
                repo: process.env.GITHUB_REPO || '',
                owner: process.env.GITHUB_OWNER || '',
                branch: process.env.GITHUB_BRANCH || 'main'
            },
            recentBackups
        });
    } catch (error) {
        res.status(500).json({ message: 'Error checking GitHub status.' });
    }
});

// Update GitHub settings
router.put('/config', authMiddleware, adminOnly, (req, res) => {
    try {
        const { token, owner, repo, branch } = req.body;
        
        // Update .env file
        const envPath = path.join(__dirname, '..', '.env');
        let envContent = fs.readFileSync(envPath, 'utf8');

        if (token) envContent = envContent.replace(/GITHUB_TOKEN=.*/, `GITHUB_TOKEN=${token}`);
        if (owner) envContent = envContent.replace(/GITHUB_OWNER=.*/, `GITHUB_OWNER=${owner}`);
        if (repo) envContent = envContent.replace(/GITHUB_REPO=.*/, `GITHUB_REPO=${repo}`);
        if (branch) envContent = envContent.replace(/GITHUB_BRANCH=.*/, `GITHUB_BRANCH=${branch}`);

        fs.writeFileSync(envPath, envContent);

        // Update process.env
        if (token) process.env.GITHUB_TOKEN = token;
        if (owner) process.env.GITHUB_OWNER = owner;
        if (repo) process.env.GITHUB_REPO = repo;
        if (branch) process.env.GITHUB_BRANCH = branch;

        // Log activity
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type)
            VALUES (?, 'github_config_updated', 'GitHub configuration updated', 'github')
        `).run(req.user.id);

        res.json({ message: 'GitHub configuration updated successfully.' });
    } catch (error) {
        console.error('GitHub config error:', error);
        res.status(500).json({ message: 'Error updating GitHub configuration.' });
    }
});

// Push file to GitHub
router.post('/push', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { filePath, message } = req.body;

        if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
            return res.status(400).json({ message: 'GitHub not configured. Please set up GitHub integration first.' });
        }

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;
        const branch = process.env.GITHUB_BRANCH || 'main';

        const fullPath = path.join(__dirname, '..', '..', filePath);
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ message: 'File not found.' });
        }

        const content = fs.readFileSync(fullPath);
        const contentBase64 = content.toString('base64');

        // Get current file SHA (if exists)
        let sha;
        try {
            const { data } = await octokit.rest.repos.getContent({
                owner, repo, path: filePath, ref: branch
            });
            sha = data.sha;
        } catch (e) {
            // File doesn't exist yet
        }

        // Create or update file
        const commitMessage = message || `Update ${filePath} via admin dashboard`;
        const response = await octokit.rest.repos.createOrUpdateFileContents({
            owner, repo,
            path: filePath,
            message: commitMessage,
            content: contentBase64,
            branch,
            ...(sha && { sha })
        });

        // Log to database
        db.prepare(`
            INSERT INTO github_logs (action, file_path, commit_sha, commit_message, user_id, status)
            VALUES ('push', ?, ?, ?, ?, 'success')
        `).run(filePath, response.data.commit.sha, commitMessage, req.user.id);

        // Activity log
        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type)
            VALUES (?, 'github_push', ?, 'github')
        `).run(req.user.id, `Pushed ${filePath} to GitHub`);

        res.json({
            message: 'File pushed to GitHub successfully.',
            commit: response.data.commit.sha
        });
    } catch (error) {
        console.error('GitHub push error:', error);
        
        // Log failure
        db.prepare(`
            INSERT INTO github_logs (action, file_path, commit_message, user_id, status)
            VALUES ('push', ?, ?, ?, 'failed')
        `).run(req.body.filePath || '', error.message, req.user?.id);

        res.status(500).json({ message: 'Error pushing to GitHub: ' + error.message });
    }
});

// Push all changed files
router.post('/push-all', authMiddleware, adminOnly, async (req, res) => {
    try {
        if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
            return res.status(400).json({ message: 'GitHub not configured.' });
        }

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const owner = process.env.GITHUB_OWNER;
        const repo = process.env.GITHUB_REPO;
        const branch = process.env.GITHUB_BRANCH || 'main';

        // Get list of website files to push
        const websiteDir = path.join(__dirname, '..', '..');
        const filesToPush = [
            'index.html', 'about.html', 'contact-me.html', 
            'privacy-policy.html', 'terms.html', 'style.css', 'script.js'
        ];

        // Also include any custom pages
        const pages = db.prepare('SELECT file_path FROM pages').all();
        for (const page of pages) {
            if (page.file_path && !filesToPush.includes(page.file_path)) {
                filesToPush.push(page.file_path);
            }
        }

        const results = [];
        for (const filePath of filesToPush) {
            const fullPath = path.join(websiteDir, filePath);
            if (!fs.existsSync(fullPath)) continue;

            try {
                const content = fs.readFileSync(fullPath);
                const contentBase64 = content.toString('base64');

                let sha;
                try {
                    const { data } = await octokit.rest.repos.getContent({
                        owner, repo, path: filePath, ref: branch
                    });
                    sha = data.sha;
                } catch (e) {}

                const response = await octokit.rest.repos.createOrUpdateFileContents({
                    owner, repo,
                    path: filePath,
                    message: `Backup: Update ${filePath} via admin dashboard`,
                    content: contentBase64,
                    branch,
                    ...(sha && { sha })
                });

                results.push({ file: filePath, status: 'success', sha: response.data.commit.sha });
            } catch (e) {
                results.push({ file: filePath, status: 'failed', error: e.message });
            }
        }

        // Log to database
        db.prepare(`
            INSERT INTO github_logs (action, commit_message, user_id, status)
            VALUES ('push_all', ?, ?, 'success')
        `).run(`Backup all files (${results.filter(r => r.status === 'success').length} files)`, req.user.id);

        db.prepare(`
            INSERT INTO activity_logs (user_id, action, details, target_type)
            VALUES (?, 'github_backup', ?, 'github')
        `).run(req.user.id, `Full backup: ${results.filter(r => r.status === 'success').length} files pushed`);

        res.json({ message: 'Backup completed.', results });
    } catch (error) {
        console.error('GitHub push-all error:', error);
        res.status(500).json({ message: 'Error during backup: ' + error.message });
    }
});

// Get commit history
router.get('/history', authMiddleware, async (req, res) => {
    try {
        if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
            return res.status(400).json({ message: 'GitHub not configured.' });
        }

        const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        const { data } = await octokit.rest.repos.listCommits({
            owner: process.env.GITHUB_OWNER,
            repo: process.env.GITHUB_REPO,
            per_page: 20
        });

        const commits = data.map(commit => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author.name,
            date: commit.commit.author.date,
            url: commit.html_url
        }));

        res.json(commits);
    } catch (error) {
        console.error('GitHub history error:', error);
        res.status(500).json({ message: 'Error fetching commit history.' });
    }
});

module.exports = router;
