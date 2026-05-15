// Dashboard JavaScript
(function() {
    'use strict';

    // Auth check
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    // API Helper
    async function api(endpoint, options = {}) {
        const defaultHeaders = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        const config = {
            headers: { ...defaultHeaders, ...options.headers },
            ...options
        };

        if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
            config.body = JSON.stringify(options.body);
        }

        if (options.body instanceof FormData) {
            delete config.headers['Content-Type'];
            config.body = options.body;
        }

        try {
            const response = await fetch(`/admin/api${endpoint}`, config);
            
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login.html';
                return null;
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            return data;
        } catch (error) {
            showToast(error.message, 'error');
            throw error;
        }
    }

    // Toast Notifications
    function showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const icons = {
            success: 'bx-check-circle',
            error: 'bx-error-circle',
            info: 'bx-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class='bx ${icons[type] || icons.info}'></i>
            <span>${message}</span>
        `;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    // Modal
    function openModal(title, body, footer = '') {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = body;
        document.getElementById('modalFooter').innerHTML = footer;
        document.getElementById('modalOverlay').classList.add('active');
    }

    function closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
        if (e.target === document.getElementById('modalOverlay')) closeModal();
    });

    // Sidebar Navigation
    const menuItems = document.querySelectorAll('.menu-item');
    const pages = document.querySelectorAll('.page');

    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const pageId = item.dataset.page;
            
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            pages.forEach(p => p.classList.remove('active'));
            document.getElementById(`page-${pageId}`).classList.add('active');

            document.getElementById('pageTitle').textContent = item.querySelector('span').textContent;

            // Load page data
            loadPageData(pageId);

            // Close sidebar on mobile
            document.getElementById('sidebar').classList.remove('active');
        });
    });

    // Mobile sidebar toggle
    document.getElementById('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.add('active');
    });

    document.getElementById('sidebarClose').addEventListener('click', () => {
        document.getElementById('sidebar').classList.remove('active');
    });

    // User dropdown
    document.getElementById('userProfile').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('userDropdown').classList.toggle('active');
    });

    document.addEventListener('click', () => {
        document.getElementById('userDropdown').classList.remove('active');
    });

    // Set user info
    document.getElementById('userName').textContent = user.username || 'Admin';

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            await api('/auth/logout', { method: 'POST' });
        } catch (e) {}
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    // Change Password
    document.getElementById('changePasswordLink').addEventListener('click', (e) => {
        e.preventDefault();
        openModal('Change Password', `
            <div class="form-group">
                <label>Current Password</label>
                <input type="password" id="currentPassword" class="form-input">
            </div>
            <div class="form-group">
                <label>New Password</label>
                <input type="password" id="newPassword" class="form-input">
            </div>
            <div class="form-group">
                <label>Confirm New Password</label>
                <input type="password" id="confirmPassword" class="form-input">
            </div>
        `, `
            <button class="btn btn-primary" id="savePasswordBtn">
                <i class='bx bx-save'></i> Change Password
            </button>
        `);

        document.getElementById('savePasswordBtn').addEventListener('click', async () => {
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (newPassword !== confirmPassword) {
                showToast('Passwords do not match', 'error');
                return;
            }

            try {
                await api('/auth/change-password', {
                    method: 'POST',
                    body: { currentPassword, newPassword }
                });
                showToast('Password changed successfully', 'success');
                closeModal();
            } catch (e) {}
        });
    });

    // Load page data based on active page
    function loadPageData(pageId) {
        switch (pageId) {
            case 'dashboard': loadDashboard(); break;
            case 'pages': loadPages(); break;
            case 'media': loadMedia(); break;
            case 'users': loadUsers(); break;
            case 'settings': loadSettings(); break;
            case 'github': loadGitHub(); break;
            case 'activity': loadActivity(); break;
        }
    }

    // ==================== DASHBOARD ====================
    async function loadDashboard() {
        try {
            const stats = await api('/activity/stats');
            if (!stats) return;

            document.getElementById('statPages').textContent = stats.totalPages;
            document.getElementById('statMedia').textContent = stats.totalMedia;
            document.getElementById('statUsers').textContent = stats.totalUsers;
            document.getElementById('statActivity').textContent = stats.today;

            // Recent activity
            const activityHTML = stats.recentEdits.map(item => `
                <div class="activity-item">
                    <div class="activity-icon" style="background: ${getActionColor(item.action)}20; color: ${getActionColor(item.action)}">
                        <i class='bx ${getActionIcon(item.action)}'></i>
                    </div>
                    <div class="activity-info">
                        <p><strong>${item.username || 'System'}</strong> - ${item.details || item.action}</p>
                        <span class="time">${formatDate(item.created_at)}</span>
                    </div>
                </div>
            `).join('') || '<p class="loading">No recent activity</p>';

            document.getElementById('recentActivity').innerHTML = activityHTML;

            // GitHub status
            try {
                const github = await api('/github/status');
                document.getElementById('githubStatus').innerHTML = github.connected 
                    ? `<div class="github-status connected"><i class='bx bx-check-circle'></i> Connected to ${github.config.owner}/${github.config.repo}</div>`
                    : `<div class="github-status disconnected"><i class='bx bx-error'></i> GitHub not configured</div>`;
            } catch (e) {
                document.getElementById('githubStatus').innerHTML = `<div class="github-status disconnected"><i class='bx bx-error'></i> GitHub not configured</div>`;
            }
        } catch (e) {
            console.error('Dashboard load error:', e);
        }
    }

    // ==================== PAGES ====================
    async function loadPages() {
        try {
            const pages = await api('/pages');
            if (!pages) return;

            const tbody = document.getElementById('pagesTable');
            tbody.innerHTML = pages.map(page => `
                <tr>
                    <td>${page.menu_order}</td>
                    <td><strong>${page.title}</strong></td>
                    <td><code>${page.slug}</code></td>
                    <td>
                        <span class="badge ${page.is_visible ? 'badge-success' : 'badge-warning'}">
                            ${page.is_visible ? 'Visible' : 'Hidden'}
                        </span>
                    </td>
                    <td>${formatDate(page.updated_at)}</td>
                    <td class="actions">
                        <button class="btn-icon" onclick="editPage(${page.id})" title="Edit">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="btn-icon" onclick="togglePageVisibility(${page.id}, ${page.is_visible})" title="Toggle Visibility">
                            <i class='bx ${page.is_visible ? 'bx-hide' : 'bx-show'}'></i>
                        </button>
                        ${page.slug !== 'home' ? `
                            <button class="btn-icon" onclick="deletePage(${page.id})" title="Delete" style="color: var(--danger);">
                                <i class='bx bx-trash'></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `).join('');
        } catch (e) {}
    }

    // Edit page
    window.editPage = async function(id) {
        try {
            const page = await api(`/pages/${id}`);
            if (!page) return;

            openModal(`Edit: ${page.title}`, `
                <div class="form-group">
                    <label>Page Title</label>
                    <input type="text" id="editPageTitle" class="form-input" value="${page.title}">
                </div>
                <div class="form-group">
                    <label>HTML Content</label>
                    <textarea class="form-textarea" id="editPageContent" style="min-height: 400px; font-family: monospace;">${escapeHtml(page.file_content || page.content || '')}</textarea>
                </div>
            `, `
                <button class="btn btn-primary" id="savePageBtn">
                    <i class='bx bx-save'></i> Save Page
                </button>
            `);

            document.getElementById('savePageBtn').addEventListener('click', async () => {
                const title = document.getElementById('editPageTitle').value;
                const content = document.getElementById('editPageContent').value;

                try {
                    await api(`/pages/${id}`, {
                        method: 'PUT',
                        body: { title, content }
                    });
                    showToast('Page updated successfully', 'success');
                    closeModal();
                    loadPages();
                } catch (e) {}
            });
        } catch (e) {}
    };

    // Toggle page visibility
    window.togglePageVisibility = async function(id, currentState) {
        try {
            await api(`/pages/${id}`, {
                method: 'PUT',
                body: { is_visible: currentState ? 0 : 1 }
            });
            showToast('Page visibility updated', 'success');
            loadPages();
        } catch (e) {}
    };

    // Delete page
    window.deletePage = async function(id) {
        if (!confirm('Are you sure you want to delete this page? This cannot be undone.')) return;
        try {
            await api(`/pages/${id}`, { method: 'DELETE' });
            showToast('Page deleted successfully', 'success');
            loadPages();
        } catch (e) {}
    };

    // Add page button
    document.getElementById('addPageBtn').addEventListener('click', () => {
        openModal('Add New Page', `
            <div class="form-group">
                <label>Page Title</label>
                <input type="text" id="newPageTitle" class="form-input" placeholder="e.g. Gallery">
            </div>
            <div class="form-group">
                <label>URL Slug</label>
                <input type="text" id="newPageSlug" class="form-input" placeholder="e.g. gallery">
                <small style="color: var(--text-light);">This will be used as the filename (slug.html)</small>
            </div>
            <div class="form-group">
                <label>Menu Order</label>
                <input type="number" id="newPageOrder" class="form-input" value="10">
            </div>
        `, `
            <button class="btn btn-primary" id="createPageBtn">
                <i class='bx bx-plus'></i> Create Page
            </button>
        `);

        // Auto-generate slug from title
        document.getElementById('newPageTitle').addEventListener('input', (e) => {
            const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            document.getElementById('newPageSlug').value = slug;
        });

        document.getElementById('createPageBtn').addEventListener('click', async () => {
            const title = document.getElementById('newPageTitle').value;
            const slug = document.getElementById('newPageSlug').value;
            const menu_order = parseInt(document.getElementById('newPageOrder').value);

            if (!title || !slug) {
                showToast('Title and slug are required', 'error');
                return;
            }

            try {
                await api('/pages', {
                    method: 'POST',
                    body: { title, slug, is_visible: true, menu_order }
                });
                showToast('Page created successfully', 'success');
                closeModal();
                loadPages();
            } catch (e) {}
        });
    });

    // ==================== MEDIA ====================
    async function loadMedia() {
        try {
            const media = await api('/media');
            if (!media) return;

            const grid = document.getElementById('mediaGrid');
            
            if (media.length === 0) {
                grid.innerHTML = '<p class="loading">No media files uploaded yet</p>';
                return;
            }

            grid.innerHTML = media.map(item => {
                const isImage = item.file_type && item.file_type.startsWith('image/');
                return `
                    <div class="media-item">
                        ${isImage 
                            ? `<img src="${item.file_path}" alt="${item.original_name}">` 
                            : `<div style="height:140px;display:flex;align-items:center;justify-content:center;font-size:40px;color:var(--primary);"><i class='bx bx-file'></i></div>`
                        }
                        <div class="media-info">
                            <p title="${item.original_name}">${item.original_name}</p>
                            <p>${formatFileSize(item.file_size)} • ${formatDate(item.created_at)}</p>
                        </div>
                        <div class="media-actions">
                            <button class="btn-icon" onclick="copyMediaUrl('${item.file_path}')" title="Copy URL">
                                <i class='bx bx-link'></i>
                            </button>
                            <button class="btn-icon" onclick="deleteMedia(${item.id})" title="Delete" style="color:var(--danger);">
                                <i class='bx bx-trash'></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (e) {}
    }

    // Upload media
    document.getElementById('uploadMediaBtn').addEventListener('click', () => {
        const area = document.getElementById('uploadArea');
        area.style.display = area.style.display === 'none' ? 'block' : 'none';
    });

    document.getElementById('browseBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('dropzone').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    // Drag and drop
    const dropzone = document.getElementById('dropzone');
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--primary-dark)';
        dropzone.style.background = '#b3f0e8';
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.style.borderColor = 'var(--primary)';
        dropzone.style.background = 'var(--primary-light)';
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.style.borderColor = 'var(--primary)';
        dropzone.style.background = 'var(--primary-light)';
        handleFileUpload(e.dataTransfer.files);
    });

    document.getElementById('fileInput').addEventListener('change', (e) => {
        handleFileUpload(e.target.files);
    });

    async function handleFileUpload(files) {
        if (!files || files.length === 0) return;

        const formData = new FormData();
        if (files.length === 1) {
            formData.append('file', files[0]);
            try {
                await api('/media/upload', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                showToast('File uploaded successfully', 'success');
                loadMedia();
                document.getElementById('uploadArea').style.display = 'none';
            } catch (e) {}
        } else {
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
            try {
                await api('/media/upload-multiple', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                showToast(`${files.length} files uploaded successfully`, 'success');
                loadMedia();
                document.getElementById('uploadArea').style.display = 'none';
            } catch (e) {}
        }
    }

    window.copyMediaUrl = function(url) {
        navigator.clipboard.writeText(window.location.origin + url);
        showToast('URL copied to clipboard', 'success');
    };

    window.deleteMedia = async function(id) {
        if (!confirm('Delete this media file?')) return;
        try {
            await api(`/media/${id}`, { method: 'DELETE' });
            showToast('Media deleted', 'success');
            loadMedia();
        } catch (e) {}
    };

    // ==================== USERS ====================
    async function loadUsers() {
        try {
            const users = await api('/users');
            if (!users) return;

            const tbody = document.getElementById('usersTable');
            tbody.innerHTML = users.map(u => `
                <tr>
                    <td><strong>${u.username}</strong></td>
                    <td>${u.email || '-'}</td>
                    <td><span class="badge badge-${getRoleBadge(u.role)}">${u.role}</span></td>
                    <td><span class="badge ${u.is_active ? 'badge-success' : 'badge-danger'}">${u.is_active ? 'Active' : 'Disabled'}</span></td>
                    <td>${u.last_login ? formatDate(u.last_login) : 'Never'}</td>
                    <td class="actions">
                        <button class="btn-icon" onclick="editUser(${u.id})" title="Edit">
                            <i class='bx bx-edit'></i>
                        </button>
                        <button class="btn-icon" onclick="resetUserPassword(${u.id}, '${u.username}')" title="Reset Password">
                            <i class='bx bx-key'></i>
                        </button>
                        ${u.id !== user.id ? `
                            <button class="btn-icon" onclick="deleteUser(${u.id})" title="Delete" style="color:var(--danger);">
                                <i class='bx bx-trash'></i>
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `).join('');
        } catch (e) {
            if (user.role !== 'admin') {
                document.getElementById('usersTable').innerHTML = '<tr><td colspan="6" class="loading">Admin access required</td></tr>';
            }
        }
    }

    // Add user
    document.getElementById('addUserBtn').addEventListener('click', () => {
        openModal('Add New User', `
            <div class="form-group">
                <label>Username</label>
                <input type="text" id="newUsername" class="form-input">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="newUserPassword" class="form-input">
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="newUserEmail" class="form-input">
            </div>
            <div class="form-group">
                <label>Role</label>
                <select id="newUserRole" class="form-input">
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                </select>
            </div>
        `, `
            <button class="btn btn-primary" id="createUserBtn">
                <i class='bx bx-user-plus'></i> Create User
            </button>
        `);

        document.getElementById('createUserBtn').addEventListener('click', async () => {
            const username = document.getElementById('newUsername').value;
            const password = document.getElementById('newUserPassword').value;
            const email = document.getElementById('newUserEmail').value;
            const role = document.getElementById('newUserRole').value;

            if (!username || !password) {
                showToast('Username and password are required', 'error');
                return;
            }

            try {
                await api('/users', {
                    method: 'POST',
                    body: { username, password, email, role }
                });
                showToast('User created successfully', 'success');
                closeModal();
                loadUsers();
            } catch (e) {}
        });
    });

    window.editUser = async function(id) {
        try {
            const u = await api(`/users/${id}`);
            if (!u) return;

            openModal(`Edit User: ${u.username}`, `
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="editUserEmail" class="form-input" value="${u.email || ''}">
                </div>
                <div class="form-group">
                    <label>Role</label>
                    <select id="editUserRole" class="form-input">
                        <option value="editor" ${u.role === 'editor' ? 'selected' : ''}>Editor</option>
                        <option value="viewer" ${u.role === 'viewer' ? 'selected' : ''}>Viewer</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select id="editUserStatus" class="form-input">
                        <option value="1" ${u.is_active ? 'selected' : ''}>Active</option>
                        <option value="0" ${!u.is_active ? 'selected' : ''}>Disabled</option>
                    </select>
                </div>
            `, `
                <button class="btn btn-primary" id="updateUserBtn">
                    <i class='bx bx-save'></i> Save Changes
                </button>
            `);

            document.getElementById('updateUserBtn').addEventListener('click', async () => {
                try {
                    await api(`/users/${id}`, {
                        method: 'PUT',
                        body: {
                            email: document.getElementById('editUserEmail').value,
                            role: document.getElementById('editUserRole').value,
                            is_active: parseInt(document.getElementById('editUserStatus').value)
                        }
                    });
                    showToast('User updated', 'success');
                    closeModal();
                    loadUsers();
                } catch (e) {}
            });
        } catch (e) {}
    };

    window.resetUserPassword = function(id, username) {
        openModal(`Reset Password: ${username}`, `
            <div class="form-group">
                <label>New Password</label>
                <input type="password" id="resetNewPassword" class="form-input">
            </div>
        `, `
            <button class="btn btn-primary" id="resetPasswordBtn">
                <i class='bx bx-key'></i> Reset Password
            </button>
        `);

        document.getElementById('resetPasswordBtn').addEventListener('click', async () => {
            const newPassword = document.getElementById('resetNewPassword').value;
            if (!newPassword || newPassword.length < 6) {
                showToast('Password must be at least 6 characters', 'error');
                return;
            }
            try {
                await api(`/users/${id}/reset-password`, {
                    method: 'POST',
                    body: { newPassword }
                });
                showToast('Password reset successfully', 'success');
                closeModal();
            } catch (e) {}
        });
    };

    window.deleteUser = async function(id) {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await api(`/users/${id}`, { method: 'DELETE' });
            showToast('User deleted', 'success');
            loadUsers();
        } catch (e) {}
    };

    // ==================== SETTINGS ====================
    async function loadSettings() {
        try {
            const settings = await api('/settings');
            if (!settings) return;

            // Populate form fields
            const fields = [
                'site_title', 'site_description', 'footer_text', 'seo_keywords',
                'contact_email', 'contact_phone', 'contact_address',
                'social_facebook', 'social_instagram', 'social_playstore'
            ];

            fields.forEach(field => {
                const el = document.getElementById(`set_${field}`);
                if (el && settings[field]) el.value = settings[field];
            });

            // Color fields
            const colorFields = ['theme_primary_color', 'theme_secondary_color', 'theme_text_color', 'theme_bg_color'];
            colorFields.forEach(field => {
                const colorEl = document.getElementById(`set_${field}`);
                const textEl = document.getElementById(`set_${field}_text`);
                if (colorEl && settings[field]) {
                    colorEl.value = settings[field];
                    if (textEl) textEl.value = settings[field];
                }
            });

            // Sync color inputs
            colorFields.forEach(field => {
                const colorEl = document.getElementById(`set_${field}`);
                const textEl = document.getElementById(`set_${field}_text`);
                if (colorEl && textEl) {
                    colorEl.addEventListener('input', () => { textEl.value = colorEl.value; });
                    textEl.addEventListener('input', () => { colorEl.value = textEl.value; });
                }
            });
        } catch (e) {}
    }

    document.getElementById('saveSettingsBtn').addEventListener('click', async () => {
        const settings = {};
        const fields = [
            'site_title', 'site_description', 'footer_text', 'seo_keywords',
            'contact_email', 'contact_phone', 'contact_address',
            'social_facebook', 'social_instagram', 'social_playstore'
        ];

        fields.forEach(field => {
            const el = document.getElementById(`set_${field}`);
            if (el) settings[field] = el.value;
        });

        const colorFields = ['theme_primary_color', 'theme_secondary_color', 'theme_text_color', 'theme_bg_color'];
        colorFields.forEach(field => {
            const el = document.getElementById(`set_${field}`);
            if (el) settings[field] = el.value;
        });

        try {
            await api('/settings', {
                method: 'PUT',
                body: settings
            });
            showToast('Settings saved successfully', 'success');
        } catch (e) {}
    });

    // ==================== GITHUB ====================
    async function loadGitHub() {
        try {
            const status = await api('/github/status');
            if (!status) return;

            const statusEl = document.getElementById('githubConnectionStatus');
            statusEl.innerHTML = status.connected
                ? `<div class="github-status connected"><i class='bx bx-check-circle'></i> Connected to <strong>${status.config.owner}/${status.config.repo}</strong></div>`
                : `<div class="github-status disconnected"><i class='bx bx-error'></i> Not connected. Please configure below.</div>`;

            document.getElementById('githubOwner').value = status.config.owner || '';
            document.getElementById('githubRepo').value = status.config.repo || '';
            document.getElementById('githubBranch').value = status.config.branch || 'main';

            // Load commit history
            if (status.connected) {
                try {
                    const commits = await api('/github/history');
                    if (commits && commits.length > 0) {
                        document.getElementById('commitList').innerHTML = commits.map(c => `
                            <div class="commit-item">
                                <div class="commit-message">${c.message}</div>
                                <div class="commit-meta">
                                    <span><i class='bx bx-user'></i> ${c.author}</span>
                                    <span><i class='bx bx-time'></i> ${formatDate(c.date)}</span>
                                </div>
                            </div>
                        `).join('');
                    } else {
                        document.getElementById('commitList').innerHTML = '<p class="loading">No commits found</p>';
                    }
                } catch (e) {
                    document.getElementById('commitList').innerHTML = '<p class="loading">Could not load commits</p>';
                }
            }
        } catch (e) {
            document.getElementById('githubConnectionStatus').innerHTML = `<div class="github-status disconnected"><i class='bx bx-error'></i> Error checking status</div>`;
        }
    }

    document.getElementById('saveGithubBtn').addEventListener('click', async () => {
        const token_val = document.getElementById('githubToken').value;
        const owner = document.getElementById('githubOwner').value;
        const repo = document.getElementById('githubRepo').value;
        const branch = document.getElementById('githubBranch').value;

        try {
            await api('/github/config', {
                method: 'PUT',
                body: { token: token_val, owner, repo, branch }
            });
            showToast('GitHub configuration saved', 'success');
            loadGitHub();
        } catch (e) {}
    });

    document.getElementById('backupAllBtn').addEventListener('click', async () => {
        if (!confirm('Backup all website files to GitHub?')) return;
        showToast('Starting backup...', 'info');
        try {
            const result = await api('/github/push-all', { method: 'POST' });
            if (result) {
                const successCount = result.results.filter(r => r.status === 'success').length;
                showToast(`Backup complete! ${successCount} files pushed.`, 'success');
                loadGitHub();
            }
        } catch (e) {}
    });

    // ==================== ACTIVITY ====================
    let activityOffset = 0;
    async function loadActivity() {
        try {
            const type = document.getElementById('activityFilter').value;
            const data = await api(`/activity?limit=50&offset=${activityOffset}${type ? '&type=' + type : ''}`);
            if (!data) return;

            const tbody = document.getElementById('activityTable');
            tbody.innerHTML = data.logs.map(log => `
                <tr>
                    <td>
                        <span class="badge badge-${getActionBadge(log.action)}">${formatAction(log.action)}</span>
                    </td>
                    <td>${log.username || 'System'}</td>
                    <td>${log.details || '-'}</td>
                    <td>${formatDate(log.created_at)}</td>
                </tr>
            `).join('');

            // Pagination
            const totalPages = Math.ceil(data.total / data.limit);
            const currentPage = Math.floor(activityOffset / data.limit) + 1;
            let paginationHTML = '';
            for (let i = 1; i <= Math.min(totalPages, 10); i++) {
                paginationHTML += `<button class="${i === currentPage ? 'active' : ''}" onclick="setActivityPage(${i})">${i}</button>`;
            }
            document.getElementById('activityPagination').innerHTML = paginationHTML;
        } catch (e) {}
    }

    window.setActivityPage = function(page) {
        activityOffset = (page - 1) * 50;
        loadActivity();
    };

    document.getElementById('activityFilter').addEventListener('change', () => {
        activityOffset = 0;
        loadActivity();
    });

    // ==================== HELPERS ====================
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }

    function formatFileSize(bytes) {
        if (!bytes) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        let i = 0;
        while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
        return bytes.toFixed(1) + ' ' + units[i];
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function getActionColor(action) {
        if (action.includes('login')) return '#3182ce';
        if (action.includes('created') || action.includes('upload')) return '#38a169';
        if (action.includes('edited') || action.includes('updated')) return '#dd6b20';
        if (action.includes('deleted')) return '#e53e3e';
        if (action.includes('github')) return '#6b46c1';
        return '#718096';
    }

    function getActionIcon(action) {
        if (action.includes('login')) return 'bx-log-in';
        if (action.includes('page')) return 'bx-file';
        if (action.includes('upload') || action.includes('media')) return 'bx-image';
        if (action.includes('user')) return 'bx-user';
        if (action.includes('github')) return 'bxl-github';
        if (action.includes('setting')) return 'bx-cog';
        return 'bx-info-circle';
    }

    function getActionBadge(action) {
        if (action.includes('success') || action.includes('created') || action.includes('upload')) return 'success';
        if (action.includes('failed') || action.includes('deleted')) return 'danger';
        if (action.includes('edited') || action.includes('updated')) return 'warning';
        return 'info';
    }

    function getRoleBadge(role) {
        if (role === 'admin') return 'danger';
        if (role === 'editor') return 'primary';
        return 'info';
    }

    function formatAction(action) {
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // ==================== INIT ====================
    // Verify token is still valid
    api('/auth/verify').then(data => {
        if (!data) return;
        document.getElementById('userName').textContent = data.user.username;
        
        // Hide admin-only features for non-admins
        if (data.user.role === 'viewer') {
            document.querySelectorAll('[data-page="users"], [data-page="settings"], [data-page="github"]').forEach(el => {
                el.style.display = 'none';
            });
        }
    }).catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    // Load dashboard on init
    loadDashboard();
})();
