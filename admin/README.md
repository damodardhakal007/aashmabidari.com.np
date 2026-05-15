# Aashma Bidari - Website Admin Dashboard

A modern website system with secure login, admin dashboard, editable pages, GitHub backup integration, image uploads, and multi-user management.

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

1. **Navigate to the admin directory:**
   ```bash
   cd admin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   Edit `admin/.env` to set your preferences:
   ```env
   PORT=3000
   JWT_SECRET=your-secret-key
   GITHUB_TOKEN=your-github-token
   GITHUB_OWNER=your-github-username
   GITHUB_REPO=aashmabidari.com.np
   ```

4. **Run the setup (creates admin account & database):**
   ```bash
   npm run setup
   ```

5. **Start the server:**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the system:**
   - Website: `http://localhost:3000/`
   - Login: `http://localhost:3000/login.html`
   - Dashboard: `http://localhost:3000/admin/dashboard/`

---

## 🔐 Default Login Credentials

| Field    | Value             |
|----------|-------------------|
| Username | `damodardhakal007` |
| Password | `Admin@123`       |

⚠️ **Please change the password after first login!**

---

## 📋 Features

### ✅ Authentication System
- Secure login with JWT tokens
- Password encryption (bcrypt)
- Remember me option
- Session timeout protection
- Login activity tracking
- Change password
- Logout

### ✅ Admin Dashboard
- Clean, modern, responsive UI
- Dashboard overview with stats
- Real-time activity feed
- GitHub backup status

### ✅ Page Management
- View all website pages
- Edit page content (HTML editor)
- Create new pages
- Delete pages
- Show/hide pages
- Reorder menu items

### ✅ Media Library
- Upload images, PDFs, videos, documents
- Drag-and-drop upload
- Multiple file upload
- Image preview
- Copy media URLs
- Delete media

### ✅ User Management (Admin only)
- Add new users
- Edit user roles (Admin, Editor, Viewer)
- Enable/disable accounts
- Reset passwords
- Delete users

### ✅ Website Settings
- General settings (title, description, footer)
- Theme colors (primary, secondary, text, background)
- Contact information (email, phone, address)
- Social media links (Facebook, Instagram, Play Store)
- SEO keywords

### ✅ GitHub Integration
- Connect to GitHub repository
- Push individual files
- Full backup (push all files)
- View commit history
- Track backup activity

### ✅ Activity Logging
- Track all user actions
- Filter by type (auth, pages, media, users, settings, github)
- Pagination support
- Timestamp and user tracking

---

## 🏗️ Architecture

```
aashmabidari.com.np/
├── index.html              # Main website
├── about.html              # About page
├── contact-me.html         # Contact page
├── privacy-policy.html     # Privacy policy
├── terms.html              # Terms page
├── login.html              # Admin login page
├── style.css               # Website styles
├── script.js               # Website scripts
├── assets/                 # Website assets
│
└── admin/                  # Admin system
    ├── server.js           # Express server
    ├── database.js         # SQLite database
    ├── setup.js            # Initial setup script
    ├── package.json        # Dependencies
    ├── .env                # Environment config
    ├── .env.example        # Example config
    ├── .gitignore          # Git ignore rules
    │
    ├── middleware/
    │   └── auth.js         # JWT authentication
    │
    ├── routes/
    │   ├── auth.js         # Login/logout/password
    │   ├── pages.js        # Page management
    │   ├── media.js        # Media uploads
    │   ├── users.js        # User management
    │   ├── settings.js     # Website settings
    │   ├── activity.js     # Activity logs
    │   └── github.js       # GitHub integration
    │
    ├── dashboard/
    │   ├── index.html      # Dashboard UI
    │   ├── dashboard.css   # Dashboard styles
    │   └── dashboard.js    # Dashboard logic
    │
    ├── uploads/            # Uploaded media files
    └── data/               # SQLite database files
```

---

## 👥 User Roles

| Role   | Permissions                                    |
|--------|------------------------------------------------|
| Admin  | Full access: manage users, all pages, settings, GitHub |
| Editor | Edit content, upload images, create pages       |
| Viewer | Read-only access to dashboard                  |

---

## 🔧 Technology Stack

| Component      | Technology           |
|----------------|----------------------|
| Frontend       | HTML5, CSS3, Vanilla JS |
| Backend        | Node.js + Express    |
| Database       | SQLite (better-sqlite3) |
| Authentication | JWT (jsonwebtoken)   |
| Password Hash  | bcryptjs             |
| File Upload    | Multer               |
| GitHub API     | Octokit              |
| Icons          | Boxicons             |

---

## 🔒 Security Features

- Passwords encrypted with bcrypt (12 rounds)
- JWT token authentication
- Session timeout (configurable)
- Login attempt tracking
- Role-based access control
- CORS protection
- File type validation for uploads

---

## 📱 Responsive Design

The dashboard works on:
- ✅ Desktop computers
- ✅ Laptops
- ✅ Tablets
- ✅ Mobile phones

---

## 🐛 Troubleshooting

### Server won't start
- Make sure Node.js v18+ is installed
- Run `npm install` in the admin directory
- Check if port 3000 is already in use

### Login doesn't work
- Run `npm run setup` to create the admin account
- Check that the database exists at `admin/data/admin.db`
- Default password is `Admin@123`

### GitHub integration not working
- Ensure you have a valid GitHub Personal Access Token
- Token needs `repo` scope permissions
- Check owner and repo name in configuration

---

## 📄 License

© Aashma Bidari - All Rights Reserved
