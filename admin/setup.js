require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./database');

console.log('🔧 Setting up Admin Dashboard...\n');

// Create default admin user
const adminUsername = process.env.ADMIN_USERNAME || 'damodardhakal007';
const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
const adminEmail = process.env.ADMIN_EMAIL || 'admin@aashmabidari.com.np';

const existingUser = db.prepare('SELECT id FROM users WHERE username = ?').get(adminUsername);

if (!existingUser) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 12);
    db.prepare(`
        INSERT INTO users (username, password, email, role) 
        VALUES (?, ?, ?, 'admin')
    `).run(adminUsername, hashedPassword, adminEmail);
    console.log(`✅ Admin user created: ${adminUsername}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   ⚠️  Please change the password after first login!\n`);
} else {
    console.log(`ℹ️  Admin user already exists: ${adminUsername}\n`);
}

// Insert default settings
const defaultSettings = [
    ['site_title', 'Aashma Bidari'],
    ['site_description', 'Student, Entrepreneur, Motivator'],
    ['site_logo', ''],
    ['theme_primary_color', '#007F73'],
    ['theme_secondary_color', '#d5fdf9'],
    ['theme_text_color', '#000000'],
    ['theme_bg_color', '#ffffff'],
    ['contact_email', 'aashmadhakal007@gmail.com'],
    ['contact_phone', ''],
    ['contact_address', 'Kathmandu, Nepal'],
    ['social_facebook', 'https://www.facebook.com/aashma.bidari.2025'],
    ['social_instagram', 'https://instagram.com/aashma._dhakal'],
    ['social_playstore', 'https://play.google.com/store/apps/details?id=com.bank.damodardhakal&hl=ne'],
    ['footer_text', '© Aashma Bidari - All Rights Reserved'],
    ['seo_keywords', 'Aashma Bidari, Student, Entrepreneur, Motivator, Nepal'],
    ['github_auto_backup', 'true'],
    ['notifications_enabled', 'true']
];

const insertSetting = db.prepare(`
    INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)
`);

for (const [key, value] of defaultSettings) {
    insertSetting.run(key, value);
}
console.log('✅ Default settings configured');

// Insert default pages
const defaultPages = [
    ['Home', 'home', 'index.html', 1, 1],
    ['About', 'about', 'about.html', 1, 2],
    ['Privacy Policy', 'privacy-policy', 'privacy-policy.html', 1, 3],
    ['Contact Me', 'contact-me', 'contact-me.html', 1, 4],
    ['Terms', 'terms', 'terms.html', 1, 5]
];

const insertPage = db.prepare(`
    INSERT OR IGNORE INTO pages (title, slug, file_path, is_visible, menu_order)
    VALUES (?, ?, ?, ?, ?)
`);

for (const page of defaultPages) {
    insertPage.run(...page);
}
console.log('✅ Default pages registered');

// Log setup activity
db.prepare(`
    INSERT INTO activity_logs (action, details, target_type)
    VALUES ('system_setup', 'Initial system setup completed', 'system')
`).run();

console.log('\n🎉 Setup complete! Run "npm start" to start the server.');
console.log(`\n📋 Login Credentials:`);
console.log(`   Username: ${adminUsername}`);
console.log(`   Password: ${adminPassword}`);
console.log(`\n🌐 Access the admin at: http://localhost:${process.env.PORT || 3000}/login.html`);
