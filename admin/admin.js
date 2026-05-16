// ==================== CONSTANTS ====================
const AUTH_KEY = 'aashma_admin_auth';
const USERS_KEY = 'aashma_admin_users';
const ACTIVITY_KEY = 'aashma_activity_log';
const PAGES_KEY = 'aashma_pages';
const MEDIA_KEY = 'aashma_media';
const SETTINGS_KEY = 'aashma_settings';
const GITHUB_KEY = 'aashma_github';
const NOTIFICATIONS_KEY = 'aashma_notifications';

// ==================== AUTHENTICATION ====================
let currentUser = null;

function checkAuth() {
    const session = JSON.parse(localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY) || 'null');
    if (!session) {
        window.location.href = '../login.html';
        return;
    }
    currentUser = session;
    updateUserDisplay();
}

function updateUserDisplay() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.fullName || currentUser.username;
        document.getElementById('userRole').textContent = currentUser.role;
        document.getElementById('userAvatar').textContent = (currentUser.fullName || currentUser.username).charAt(0).toUpperCase();
    }
}

function handleLogout() {
    logActivity('logout', `${currentUser.fullName || currentUser.username} logged out`, currentUser.username);
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
    window.location.href = '../login.html';
}

// ==================== SIDEBAR & NAVIGATION ====================
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
    // Show selected page
    const page = document.getElementById('page-' + pageName);
    if (page) page.classList.add('active');

    // Update nav active state
    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'pages': 'Pages Management',
        'media': 'Media Library',
        'users': 'User Management',
        'home-editor': 'Home Page Editor',
        'privacy': 'Privacy Policy',
        'contact': 'Contact Information',
        'activity': 'Activity Logs',
        'github': 'GitHub Integration',
        'settings': 'Website Settings'
    };
    document.getElementById('pageTitle').textContent = titles[pageName] || 'Dashboard';

    // Load page data
    loadPageData(pageName);

    // Close mobile sidebar
    if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('mobile-open');
    }
}

function loadPageData(pageName) {
    switch (pageName) {
        case 'dashboard': loadDashboard(); break;
        case 'pages': loadPages(); break;
        case 'media': loadMedia(); break;
        case 'users': loadUsers(); break;
        case 'activity': loadActivityLogs(); break;
    }
}

// ==================== DASHBOARD ====================
function loadDashboard() {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
    const media = JSON.parse(localStorage.getItem(MEDIA_KEY) || '[]');
    const logs = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');

    document.getElementById('totalUsers').textContent = users.filter(u => u.isActive).length;
    document.getElementById('totalPages').textContent = pages.length || 5;
    document.getElementById('totalMedia').textContent = media.length || 3;

    // Recent activity on dashboard
    const dashActivity = document.getElementById('dashboardActivity');
    const recentLogs = logs.slice(0, 5);
    if (recentLogs.length === 0) {
        dashActivity.innerHTML = '<div class="empty-state"><i class="bx bx-history"></i><p>No activity recorded yet.</p></div>';
    } else {
        dashActivity.innerHTML = recentLogs.map(log => createActivityHTML(log)).join('');
    }
}

// ==================== PAGES MANAGEMENT ====================
function initializePages() {
    const pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
    if (pages.length === 0) {
        const defaultPages = [
            { id: 'pg_1', name: 'Home', slug: 'index', inNav: true, visible: true, order: 1 },
            { id: 'pg_2', name: 'About', slug: 'about', inNav: true, visible: true, order: 2 },
            { id: 'pg_3', name: 'Privacy Policy', slug: 'privacy-policy', inNav: true, visible: true, order: 3 },
            { id: 'pg_4', name: 'Contact Me', slug: 'contact-me', inNav: true, visible: true, order: 4 },
            { id: 'pg_5', name: 'Login', slug: 'login', inNav: false, visible: true, order: 5 }
        ];
        localStorage.setItem(PAGES_KEY, JSON.stringify(defaultPages));
    }
}

function loadPages() {
    const pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
    const container = document.getElementById('pagesList');
    
    if (pages.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="bx bx-file"></i><p>No pages created yet.</p></div>';
        return;
    }

    container.innerHTML = pages.sort((a, b) => a.order - b.order).map(page => `
        <div class="page-list-item">
            <div class="page-name">
                <i class='bx bx-grid-vertical'></i>
                <span>${page.name}</span>
                ${!page.visible ? '<span class="status-badge status-inactive">Hidden</span>' : ''}
                ${page.inNav ? '<span class="status-badge status-active">In Nav</span>' : ''}
            </div>
            <div class="page-actions">
                <button class="btn btn-secondary btn-sm" onclick="togglePageVisibility('${page.id}')" title="${page.visible ? 'Hide' : 'Show'}">
                    <i class='bx ${page.visible ? 'bx-hide' : 'bx-show'}'></i>
                </button>
                <button class="btn btn-danger btn-sm" onclick="deletePage('${page.id}')" title="Delete">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        </div>
    `).join('');
}

function showAddPageModal() {
    document.getElementById('addPageModal').classList.add('show');
}

function addPage() {
    const name = document.getElementById('newPageName').value.trim();
    const slug = document.getElementById('newPageSlug').value.trim();
    const inNav = document.getElementById('newPageNav').value === 'yes';

    if (!name || !slug) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    const pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
    const newPage = {
        id: 'pg_' + Date.now(),
        name: name,
        slug: slug,
        inNav: inNav,
        visible: true,
        order: pages.length + 1
    };
    pages.push(newPage);
    localStorage.setItem(PAGES_KEY, JSON.stringify(pages));

    logActivity('add', `New page "${name}" created`, currentUser.username);
    addNotification(`Page "${name}" was created`);
    showToast(`Page "${name}" created successfully`, 'success');
    closeModal('addPageModal');
    document.getElementById('newPageName').value = '';
    document.getElementById('newPageSlug').value = '';
    loadPages();
    loadDashboard();
}

function deletePage(id) {
    if (!confirm('Are you sure you want to delete this page?')) return;
    let pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
    const page = pages.find(p => p.id === id);
    pages = pages.filter(p => p.id !== id);
    localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
    logActivity('delete', `Page "${page?.name}" deleted`, currentUser.username);
    showToast('Page deleted successfully', 'success');
    loadPages();
    loadDashboard();
}

function togglePageVisibility(id) {
    let pages = JSON.parse(localStorage.getItem(PAGES_KEY) || '[]');
    const page = pages.find(p => p.id === id);
    if (page) {
        page.visible = !page.visible;
        localStorage.setItem(PAGES_KEY, JSON.stringify(pages));
        logActivity('edit', `Page "${page.name}" ${page.visible ? 'shown' : 'hidden'}`, currentUser.username);
        loadPages();
    }
}

// ==================== MEDIA MANAGEMENT ====================
function initializeMedia() {
    const media = JSON.parse(localStorage.getItem(MEDIA_KEY) || '[]');
    if (media.length === 0) {
        const defaultMedia = [
            { id: 'med_1', name: 'profile.JPG', type: 'image', url: '../assets/profile.JPG', size: '150KB', uploadedAt: new Date().toISOString(), uploadedBy: 'admin' },
            { id: 'med_2', name: 'about.jpeg', type: 'image', url: '../assets/about.jpeg', size: '120KB', uploadedAt: new Date().toISOString(), uploadedBy: 'admin' },
            { id: 'med_3', name: 'aashma.JPG', type: 'image', url: '../assets/aashma.JPG', size: '200KB', uploadedAt: new Date().toISOString(), uploadedBy: 'admin' }
        ];
        localStorage.setItem(MEDIA_KEY, JSON.stringify(defaultMedia));
    }
}

function loadMedia() {
    const media = JSON.parse(localStorage.getItem(MEDIA_KEY) || '[]');
    const grid = document.getElementById('mediaGrid');

    if (media.length === 0) {
        grid.innerHTML = '<div class="empty-state"><i class="bx bx-image"></i><p>No media files uploaded yet.</p></div>';
        return;
    }

    grid.innerHTML = media.map(item => `
        <div class="media-item">
            <img src="${item.url}" alt="${item.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect fill=%22%23f3f4f6%22 width=%22100%22 height=%22100%22/><text x=%2250%22 y=%2255%22 text-anchor=%22middle%22 fill=%22%239ca3af%22 font-size=%2212%22>${item.name}</text></svg>'">
            <div class="media-info">${item.name}</div>
            <button class="delete-media" onclick="deleteMedia('${item.id}')"><i class='bx bx-x'></i></button>
        </div>
    `).join('');
}

function handleFileUpload(event) {
    const files = event.target.files;
    if (!files.length) return;

    const media = JSON.parse(localStorage.getItem(MEDIA_KEY) || '[]');

    for (let file of files) {
        if (file.size > 10 * 1024 * 1024) {
            showToast(`File "${file.name}" is too large (max 10MB)`, 'error');
            continue;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const newMedia = {
                id: 'med_' + Date.now() + Math.random().toString(36).substr(2, 5),
                name: file.name,
                type: file.type.startsWith('image/') ? 'image' : 'file',
                url: e.target.result,
                size: formatFileSize(file.size),
                uploadedAt: new Date().toISOString(),
                uploadedBy: currentUser.username
            };
            media.push(newMedia);
            localStorage.setItem(MEDIA_KEY, JSON.stringify(media));
            loadMedia();
            loadDashboard();
        };
        reader.readAsDataURL(file);

        logActivity('upload', `File "${file.name}" uploaded`, currentUser.username);
        addNotification(`New file "${file.name}" uploaded`);
    }

    showToast(`${files.length} file(s) uploaded successfully`, 'success');
    event.target.value = '';
}

function deleteMedia(id) {
    if (!confirm('Delete this file?')) return;
    let media = JSON.parse(localStorage.getItem(MEDIA_KEY) || '[]');
    const item = media.find(m => m.id === id);
    media = media.filter(m => m.id !== id);
    localStorage.setItem(MEDIA_KEY, JSON.stringify(media));
    logActivity('delete', `Media "${item?.name}" deleted`, currentUser.username);
    showToast('File deleted', 'success');
    loadMedia();
    loadDashboard();
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Drag and drop
function setupDragDrop() {
    const dropArea = document.getElementById('dropArea');
    if (!dropArea) return;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.style.borderColor = 'var(--primary)', false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, () => dropArea.style.borderColor = 'var(--gray-300)', false);
    });

    dropArea.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        document.getElementById('fileInput').files = files;
        handleFileUpload({ target: { files: files, value: '' } });
    }, false);
}

// ==================== USER MANAGEMENT ====================
function loadUsers() {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const tbody = document.getElementById('usersTableBody');

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="user-avatar" style="width: 32px; height: 32px; font-size: 0.75rem;">${(user.fullName || user.username).charAt(0).toUpperCase()}</div>
                    <div>
                        <div style="font-weight: 500;">${user.fullName || user.username}</div>
                        <div style="font-size: 0.8rem; color: var(--gray-400);">@${user.username}</div>
                    </div>
                </div>
            </td>
            <td><span class="status-badge status-${user.role}">${user.role}</span></td>
            <td>${user.email}</td>
            <td><span class="status-badge ${user.isActive ? 'status-active' : 'status-inactive'}">${user.isActive ? 'Active' : 'Disabled'}</span></td>
            <td>${user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
            <td>
                <div style="display: flex; gap: 0.25rem;">
                    <button class="btn btn-secondary btn-sm" onclick="toggleUserStatus('${user.id}')" title="${user.isActive ? 'Disable' : 'Enable'}">
                        <i class='bx ${user.isActive ? 'bx-block' : 'bx-check'}'></i>
                    </button>
                    ${user.username !== 'damodardhakal007' ? `<button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')" title="Delete"><i class='bx bx-trash'></i></button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddUserModal() {
    if (currentUser.role !== 'admin') {
        showToast('Only admins can add users', 'error');
        return;
    }
    document.getElementById('addUserModal').classList.add('show');
}

function addUser() {
    const fullName = document.getElementById('newUserName').value.trim();
    const username = document.getElementById('newUserUsername').value.trim();
    const email = document.getElementById('newUserEmail').value.trim();
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;

    if (!fullName || !username || !email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find(u => u.username === username)) {
        showToast('Username already exists', 'error');
        return;
    }

    const newUser = {
        id: 'usr_' + Date.now(),
        username: username,
        password: hashPassword(password),
        email: email,
        role: role,
        fullName: fullName,
        avatar: '',
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isActive: true
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    logActivity('add', `New user "${fullName}" (${role}) added`, currentUser.username);
    addNotification(`New user "${fullName}" was added`);
    showToast(`User "${fullName}" added successfully`, 'success');
    closeModal('addUserModal');
    
    // Clear form
    document.getElementById('newUserName').value = '';
    document.getElementById('newUserUsername').value = '';
    document.getElementById('newUserEmail').value = '';
    document.getElementById('newUserPassword').value = '';
    
    loadUsers();
    loadDashboard();
}

function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.id === id);
    users = users.filter(u => u.id !== id);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    logActivity('delete', `User "${user?.fullName}" removed`, currentUser.username);
    showToast('User deleted', 'success');
    loadUsers();
    loadDashboard();
}

function toggleUserStatus(id) {
    let users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.id === id);
    if (user) {
        user.isActive = !user.isActive;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        logActivity('edit', `User "${user.fullName}" ${user.isActive ? 'enabled' : 'disabled'}`, currentUser.username);
        showToast(`User ${user.isActive ? 'enabled' : 'disabled'}`, 'success');
        loadUsers();
    }
}

function hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return 'hashed_' + Math.abs(hash).toString(36) + '_' + btoa(password).replace(/=/g, '');
}

// ==================== CONTENT EDITORS ====================
function saveHomePage() {
    const data = {
        title: document.getElementById('siteTitle').value,
        bannerHeading: document.getElementById('bannerHeading').value,
        name: document.getElementById('siteName').value,
        typingText: document.getElementById('typingText').value,
        aboutText: document.getElementById('aboutText').value,
        facebookUrl: document.getElementById('facebookUrl').value,
        instagramUrl: document.getElementById('instagramUrl').value
    };
    localStorage.setItem('aashma_home_content', JSON.stringify(data));
    logActivity('edit', 'Home page content updated', currentUser.username);
    addNotification('Home page was updated');
    showToast('Home page saved successfully', 'success');

    // Auto-push to GitHub
    autoPushToGitHub(
        'admin/content/home.json',
        JSON.stringify(data, null, 2),
        `Update home page content - ${currentUser.username}`
    );
}

function savePrivacyPolicy() {
    const content = document.getElementById('privacyEditor').innerHTML;
    localStorage.setItem('aashma_privacy_content', content);
    logActivity('edit', 'Privacy Policy updated', currentUser.username);
    addNotification('Privacy Policy was updated');
    showToast('Privacy Policy saved successfully', 'success');

    // Auto-push to GitHub
    autoPushToGitHub(
        'admin/content/privacy.html',
        content,
        `Update privacy policy - ${currentUser.username}`
    );
}

function saveContactInfo() {
    const data = {
        email: document.getElementById('contactEmail').value,
        phone: document.getElementById('contactPhone').value,
        address: document.getElementById('contactAddress').value,
        map: document.getElementById('contactMap').value,
        facebook: document.getElementById('contactFacebook').value,
        instagram: document.getElementById('contactInstagram').value,
        playStore: document.getElementById('contactPlayStore').value
    };
    localStorage.setItem('aashma_contact_info', JSON.stringify(data));
    logActivity('edit', 'Contact information updated', currentUser.username);
    addNotification('Contact info was updated');
    showToast('Contact information saved successfully', 'success');

    // Auto-push to GitHub
    autoPushToGitHub(
        'admin/content/contact.json',
        JSON.stringify(data, null, 2),
        `Update contact info - ${currentUser.username}`
    );
}

function execCmd(command, value = null) {
    if (value) {
        document.execCommand(command, false, '<' + value + '>');
    } else {
        document.execCommand(command, false, null);
    }
}

// ==================== ACTIVITY LOGS ====================
function logActivity(type, description, user) {
    const logs = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    logs.unshift({
        id: 'log_' + Date.now(),
        type: type,
        description: description,
        user: user,
        timestamp: new Date().toISOString()
    });
    if (logs.length > 100) logs.pop();
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(logs));
}

function loadActivityLogs() {
    const logs = JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]');
    const container = document.getElementById('activityList');

    if (logs.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="bx bx-history"></i><p>No activity recorded yet.</p></div>';
        return;
    }

    container.innerHTML = logs.map(log => createActivityHTML(log)).join('');
}

function createActivityHTML(log) {
    const iconClass = getActivityIcon(log.type);
    return `
        <div class="activity-item">
            <div class="activity-icon ${iconClass.class}"><i class='bx ${iconClass.icon}'></i></div>
            <div class="activity-content">
                <div class="activity-desc">${log.description}</div>
                <div class="activity-time">${formatDate(log.timestamp)} by ${log.user}</div>
            </div>
        </div>
    `;
}

function getActivityIcon(type) {
    const icons = {
        'login': { class: 'login', icon: 'bx-log-in' },
        'logout': { class: 'login', icon: 'bx-log-out' },
        'failed_login': { class: 'delete', icon: 'bx-error' },
        'edit': { class: 'edit', icon: 'bx-edit' },
        'add': { class: 'add', icon: 'bx-plus' },
        'delete': { class: 'delete', icon: 'bx-trash' },
        'upload': { class: 'upload', icon: 'bx-upload' },
        'settings': { class: 'settings', icon: 'bx-cog' },
        'backup': { class: 'add', icon: 'bx-cloud-upload' }
    };
    return icons[type] || { class: 'edit', icon: 'bx-info-circle' };
}

function clearActivityLogs() {
    if (!confirm('Clear all activity logs?')) return;
    localStorage.setItem(ACTIVITY_KEY, '[]');
    loadActivityLogs();
    showToast('Activity logs cleared', 'success');
}

// ==================== GITHUB INTEGRATION (OAuth) ====================

// GitHub OAuth Configuration
// To set up: Create a GitHub OAuth App at https://github.com/settings/developers
// Set callback URL to: https://aashmabidari.com.np/admin/github-callback.html
const GITHUB_CLIENT_ID = 'Ov23liZAE6fT8eATFv2P';

function getGitHubRedirectURI() {
    let baseUrl = window.location.origin;
    if (!baseUrl || baseUrl === 'null' || baseUrl === 'file://') {
        baseUrl = 'https://aashmabidari.com.np';
    }
    return baseUrl + '/admin/github-callback.html';
}

const GITHUB_SCOPES = 'repo,user';

// Start GitHub OAuth Flow
function startGitHubOAuth() {
    try {
        // Check if Client ID is configured
        if (!GITHUB_CLIENT_ID || GITHUB_CLIENT_ID === 'Ov23liYourClientIdHere') {
            showToast('GitHub OAuth is not configured. Please set your GitHub OAuth App Client ID in admin.js and login.html.', 'error');
            return;
        }

        const state = generateRandomState();
        sessionStorage.setItem('github_oauth_state', state);
        
        // Save current config
        const githubData = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
        githubData.clientId = GITHUB_CLIENT_ID;
        githubData.proxyUrl = githubData.proxyUrl || '';
        localStorage.setItem(GITHUB_KEY, JSON.stringify(githubData));
        
        const redirectUri = getGitHubRedirectURI();
        
        // Redirect to GitHub OAuth
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${GITHUB_SCOPES}&state=${state}`;
        
        // Use window.open as primary, fallback to location.href
        const authWindow = window.open(authUrl, '_self');
        if (!authWindow) {
            window.location.href = authUrl;
        }
    } catch (err) {
        showToast('Failed to start GitHub OAuth: ' + err.message, 'error');
        console.error('GitHub OAuth Error:', err);
    }
}

function generateRandomState() {
    try {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        // Fallback if crypto is not available (e.g., non-HTTPS)
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
}

// Disconnect GitHub
function disconnectGitHub() {
    if (!confirm('Disconnect GitHub? Auto-push will stop working.')) return;
    const data = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
    data.token = null;
    data.connected = false;
    data.user = null;
    localStorage.setItem(GITHUB_KEY, JSON.stringify(data));
    logActivity('settings', 'GitHub account disconnected', currentUser.username);
    showToast('GitHub disconnected', 'success');
    loadGithubUI();
}

// Load GitHub UI state
function loadGithubUI() {
    const data = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
    const loginSection = document.getElementById('githubLoginSection');
    const connectedSection = document.getElementById('githubConnectedSection');
    const statusEl = document.getElementById('githubStatus');

    if (data.connected && data.token && data.user) {
        // Show connected state
        loginSection.style.display = 'none';
        connectedSection.style.display = 'block';
        statusEl.className = 'github-status';
        statusEl.innerHTML = `<i class="bx bxl-github"></i><span>Connected as @${data.user.login}</span>`;

        // Update user info
        document.getElementById('githubUserAvatar').src = data.user.avatar || '';
        document.getElementById('githubUserName').textContent = data.user.name || data.user.login;
        document.getElementById('githubUserLogin').textContent = '@' + data.user.login;

        // Load branch
        if (data.branch) {
            document.getElementById('githubBranch').value = data.branch;
        }

        // Load auto-push preference
        const autoPush = document.getElementById('githubAutoPush');
        if (autoPush) {
            autoPush.checked = data.autoPush !== false; // default true
        }

        // Load repos
        fetchUserRepos();

        // Load commit history
        loadCommitHistory();
    } else {
        // Show login state
        loginSection.style.display = 'block';
        connectedSection.style.display = 'none';
        statusEl.className = 'github-status disconnected';
        statusEl.innerHTML = '<i class="bx bxl-github"></i><span>Not connected - Login with GitHub to enable auto-backup</span>';
    }
}

// Alias for backward compatibility
function loadGithubSettings() {
    loadGithubUI();
}

// Fetch user's repositories
async function fetchUserRepos() {
    const data = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
    if (!data.token) return;

    try {
        const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=30', {
            headers: { 'Authorization': 'Bearer ' + data.token }
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired
                showToast('GitHub token expired. Please reconnect.', 'error');
                disconnectGitHub();
                return;
            }
            throw new Error('Failed to fetch repos');
        }

        const repos = await response.json();
        const select = document.getElementById('githubRepoSelect');
        select.innerHTML = repos.map(repo =>
            `<option value="${repo.full_name}" ${repo.name === (data.repo || 'aashmabidari.com.np') ? 'selected' : ''}>${repo.full_name}</option>`
        ).join('');

        // If no repo selected yet, try to find the default
        if (!data.selectedRepo) {
            const defaultRepo = repos.find(r => r.name === 'aashmabidari.com.np');
            if (defaultRepo) {
                data.selectedRepo = defaultRepo.full_name;
                data.owner = defaultRepo.owner.login;
                data.repo = defaultRepo.name;
                localStorage.setItem(GITHUB_KEY, JSON.stringify(data));
            }
        }
    } catch (err) {
        console.error('Failed to fetch repos:', err);
    }
}

// Update selected repository
function updateSelectedRepo() {
    const select = document.getElementById('githubRepoSelect');
    const fullName = select.value;
    if (!fullName) return;

    const [owner, repo] = fullName.split('/');
    const data = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
    data.selectedRepo = fullName;
    data.owner = owner;
    data.repo = repo;
    localStorage.setItem(GITHUB_KEY, JSON.stringify(data));
    showToast(`Repository set to ${fullName}`, 'success');
    loadCommitHistory();
}

// Save GitHub preferences
function saveGithubPrefs() {
    const data = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
    data.branch = document.getElementById('githubBranch').value || 'main';
    data.autoPush = document.getElementById('githubAutoPush').checked;
    localStorage.setItem(GITHUB_KEY, JSON.stringify(data));
}

// Fetch repo info
function fetchRepoInfo() {
    fetchUserRepos();
    loadCommitHistory();
    showToast('Refreshed repository info', 'success');
}

// Load recent commit history
async function loadCommitHistory() {
    const data = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
    if (!data.token || !data.owner || !data.repo) return;

    const historyEl = document.getElementById('backupHistory');
    try {
        const response = await fetch(
            `https://api.github.com/repos/${data.owner}/${data.repo}/commits?per_page=10&sha=${data.branch || 'main'}`,
            { headers: { 'Authorization': 'Bearer ' + data.token } }
        );

        if (!response.ok) throw new Error('Failed to fetch commits');

        const commits = await response.json();
        if (commits.length === 0) {
            historyEl.innerHTML = '<div class="empty-state"><i class="bx bx-git-branch"></i><p>No commits found.</p></div>';
            return;
        }

        document.getElementById('totalBackups').textContent = commits.length;

        historyEl.innerHTML = commits.map(c => `
            <div class="activity-item">
                <div class="activity-icon add"><i class='bx bx-git-commit'></i></div>
                <div class="activity-content">
                    <div class="activity-desc">${escapeHtml(c.commit.message)}</div>
                    <div class="activity-time">${formatDate(c.commit.author.date)} by ${c.commit.author.name}</div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        historyEl.innerHTML = `<div class="empty-state"><i class="bx bx-error"></i><p>Could not load commits: ${err.message}</p></div>`;
    }
}

// Push file to GitHub (used by auto-push)
async function pushToGitHub(filePath, content, commitMessage) {
    const data = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
    if (!data.token || !data.connected || !data.owner || !data.repo) {
        return { success: false, error: 'GitHub not connected' };
    }

    const branch = data.branch || 'main';
    const apiBase = `https://api.github.com/repos/${data.owner}/${data.repo}`;

    try {
        // Get current file SHA (needed for updates)
        let sha = null;
        try {
            const getResp = await fetch(`${apiBase}/contents/${filePath}?ref=${branch}`, {
                headers: { 'Authorization': 'Bearer ' + data.token }
            });
            if (getResp.ok) {
                const fileData = await getResp.json();
                sha = fileData.sha;
            }
        } catch (e) { /* File doesn't exist yet, that's fine */ }

        // Create or update file
        const body = {
            message: commitMessage || `Update ${filePath} from admin dashboard`,
            content: btoa(unescape(encodeURIComponent(content))),
            branch: branch
        };
        if (sha) body.sha = sha;

        const putResp = await fetch(`${apiBase}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + data.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!putResp.ok) {
            const errData = await putResp.json();
            throw new Error(errData.message || 'Push failed');
        }

        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// Trigger manual backup - pushes all content to GitHub
async function triggerBackup() {
    const data = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
    if (!data.connected || !data.token) {
        showToast('Please connect GitHub first', 'error');
        return;
    }

    showToast('Pushing changes to GitHub...', 'info');

    // Gather content to push
    const homeContent = localStorage.getItem('aashma_home_content');
    const privacyContent = localStorage.getItem('aashma_privacy_content');
    const contactInfo = localStorage.getItem('aashma_contact_info');
    const timestamp = new Date().toISOString();

    let successCount = 0;
    let errors = [];

    // Push site data as JSON backup
    const siteData = {
        home: homeContent ? JSON.parse(homeContent) : null,
        privacy: privacyContent,
        contact: contactInfo ? JSON.parse(contactInfo) : null,
        pages: JSON.parse(localStorage.getItem(PAGES_KEY) || '[]'),
        settings: JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'),
        lastBackup: timestamp
    };

    const result = await pushToGitHub(
        'admin/site-data.json',
        JSON.stringify(siteData, null, 2),
        `Backup site data - ${new Date().toLocaleString()}`
    );

    if (result.success) {
        successCount++;
    } else {
        errors.push(result.error);
    }

    if (successCount > 0) {
        logActivity('backup', 'Site data pushed to GitHub', currentUser.username);
        addNotification('GitHub backup completed');
        showToast('Backup pushed to GitHub successfully!', 'success');
        loadCommitHistory();
    } else {
        showToast('Backup failed: ' + errors.join(', '), 'error');
    }
}

// Auto-push on save (called after content saves)
async function autoPushToGitHub(filePath, content, description) {
    const data = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
    if (!data.connected || !data.token || data.autoPush === false) return;

    const result = await pushToGitHub(filePath, content, description);
    if (result.success) {
        showToast('Auto-pushed to GitHub ✓', 'success');
        logActivity('backup', `Auto-pushed: ${description}`, currentUser.username);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ==================== SETTINGS ====================
function saveSettings() {
    const data = {
        siteName: document.getElementById('settingSiteName').value,
        seoDesc: document.getElementById('settingSeoDesc').value,
        primaryColor: document.getElementById('settingPrimaryColor').value,
        bgColor: document.getElementById('settingBgColor').value,
        darkMode: document.getElementById('settingDarkMode').checked,
        autoSave: document.getElementById('settingAutoSave').checked,
        tracking: document.getElementById('settingTracking').checked,
        githubAuto: document.getElementById('settingGithubAuto').checked
    };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(data));
    logActivity('settings', 'Website settings updated', currentUser.username);
    showToast('Settings saved successfully', 'success');
}

function loadSettings() {
    const data = JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}');
    if (data.siteName) document.getElementById('settingSiteName').value = data.siteName;
    if (data.seoDesc) document.getElementById('settingSeoDesc').value = data.seoDesc;
    if (data.primaryColor) document.getElementById('settingPrimaryColor').value = data.primaryColor;
    if (data.bgColor) document.getElementById('settingBgColor').value = data.bgColor;
    if (data.darkMode !== undefined) document.getElementById('settingDarkMode').checked = data.darkMode;
    if (data.autoSave !== undefined) document.getElementById('settingAutoSave').checked = data.autoSave;
    if (data.tracking !== undefined) document.getElementById('settingTracking').checked = data.tracking;
    if (data.githubAuto !== undefined) document.getElementById('settingGithubAuto').checked = data.githubAuto;
}

function changePassword() {
    const currentPwd = document.getElementById('currentPassword').value;
    const newPwd = document.getElementById('newPassword').value;

    if (!currentPwd || !newPwd) {
        showToast('Please fill in both password fields', 'error');
        return;
    }

    if (newPwd.length < 6) {
        showToast('New password must be at least 6 characters', 'error');
        return;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find(u => u.username === currentUser.username);

    if (!user || user.password !== hashPassword(currentPwd)) {
        showToast('Current password is incorrect', 'error');
        return;
    }

    user.password = hashPassword(newPwd);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    logActivity('settings', 'Password changed', currentUser.username);
    showToast('Password changed successfully', 'success');
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
}

// ==================== NOTIFICATIONS ====================
function addNotification(message) {
    const notifs = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    notifs.unshift({
        id: 'notif_' + Date.now(),
        message: message,
        timestamp: new Date().toISOString(),
        read: false
    });
    if (notifs.length > 20) notifs.pop();
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
    updateNotifDot();
    loadNotifications();
}

function loadNotifications() {
    const notifs = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    const container = document.getElementById('notifList');
    
    if (notifs.length === 0) {
        container.innerHTML = '<div class="notif-item"><div>No notifications yet</div></div>';
        return;
    }

    container.innerHTML = notifs.slice(0, 10).map(n => `
        <div class="notif-item">
            <div class="notif-icon" style="background: var(--green-100); color: var(--green-500);"><i class='bx bx-check'></i></div>
            <div>
                <div>${n.message}</div>
                <small style="color: var(--gray-400);">${formatDate(n.timestamp)}</small>
            </div>
        </div>
    `).join('');
}

function updateNotifDot() {
    const notifs = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
    const unread = notifs.filter(n => !n.read).length;
    const dot = document.getElementById('notifDot');
    dot.style.display = unread > 0 ? 'block' : 'none';
}

function toggleNotifications() {
    const panel = document.getElementById('notifPanel');
    panel.classList.toggle('show');

    // Mark as read
    if (panel.classList.contains('show')) {
        const notifs = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
        notifs.forEach(n => n.read = true);
        localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
        updateNotifDot();
    }
}

// ==================== DROPDOWN ====================
function toggleDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

// ==================== MODALS ====================
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// ==================== TOASTS ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class='bx ${type === 'success' ? 'bx-check-circle' : type === 'error' ? 'bx-error-circle' : 'bx-info-circle'}'></i>
        <span class="toast-message">${message}</span>
        <button class="close-toast" onclick="this.parentElement.remove()"><i class='bx bx-x'></i></button>
    `;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
}

// ==================== UTILITIES ====================
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return Math.floor(diff / 60000) + ' min ago';
    if (diff < 86400000) return Math.floor(diff / 3600000) + ' hours ago';
    if (diff < 604800000) return Math.floor(diff / 86400000) + ' days ago';

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-dropdown')) {
        document.getElementById('userDropdown').classList.remove('show');
    }
    if (!e.target.closest('.notification-panel') && !e.target.closest('.nav-icon-btn')) {
        document.getElementById('notifPanel').classList.remove('show');
    }
});

// Close modals on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('show');
    });
});

// Color picker live update
document.getElementById('settingPrimaryColor').addEventListener('input', function() {
    document.getElementById('primaryColorLabel').textContent = this.value;
});
document.getElementById('settingBgColor').addEventListener('input', function() {
    document.getElementById('bgColorLabel').textContent = this.value;
});

// ==================== INITIALIZATION ====================
function init() {
    checkAuth();
    initializePages();
    initializeMedia();
    loadDashboard();
    loadNotifications();
    updateNotifDot();
    loadGithubSettings();
    loadSettings();
    setupDragDrop();

    // Check if returning from GitHub OAuth (hash navigation)
    if (window.location.hash === '#github') {
        showPage('github');
        window.location.hash = '';
        const data = JSON.parse(localStorage.getItem(GITHUB_KEY) || '{}');
        if (data.connected) {
            showToast('GitHub connected successfully!', 'success');
        }
    }
}

// Run on page load
init();