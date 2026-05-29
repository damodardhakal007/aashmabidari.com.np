// ═════════════════════════════════════════
// PRELOADER
// ═════════════════════════════════════════
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    const loaderRing = preloader.querySelector('.loader-ring');
    const fullText = "Kavresthali Secondary School";
    let index = preloaderText.textContent.length;

    function typeEffect() {
        if (index < fullText.length) {
            if (index === 1 && loaderRing) loaderRing.classList.add('fade-out');
            preloaderText.textContent += fullText.charAt(index);
            index++;
            setTimeout(typeEffect, 55);
        } else {
            setTimeout(() => {
                preloader.classList.add('hidden');
                const imgBox = document.querySelector('.img-box');
                if (imgBox) imgBox.classList.add('entered');
            }, 600);
        }
    }
    setTimeout(typeEffect, 700);
});

// ═════════════════════════════════════════
// AURORA PARTICLE BACKGROUND
// ═════════════════════════════════════════
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
const blobs = [1,2,3,4,5,6].map(i => document.querySelector('.blob-' + i));

let particles = [], twinklingStars = [], shootingStars = [], auroraWaves = [];
let mouseX = 0, mouseY = 0;
let lastScrollY = window.scrollY || 0;
let scrollVelocity = 0, targetScrollVelocity = 0;

const SPECTRUM = [
    '0,245,255', '255,0,229', '255,215,0', '0,255,157',
    '192,132,252', '251,113,133', '96,165,250', '255,107,107',
];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class TwinklingStar {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.4 + 0.2;
        this.alpha = Math.random();
        this.speed = Math.random() * 0.016 + 0.005;
        this.brightness = Math.random() * 0.5 + 0.5;
        this.colour = Math.random() < 0.2 ? SPECTRUM[Math.floor(Math.random() * SPECTRUM.length)] : '255,255,255';
    }
    update() {
        this.alpha += this.speed;
        if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
        this.y -= scrollVelocity * 0.15;
        if (this.y < 0) { this.y = canvas.height; this.x = Math.random() * canvas.width; }
        if (this.y > canvas.height) { this.y = 0; this.x = Math.random() * canvas.width; }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.colour},${Math.abs(this.alpha) * this.brightness})`;
        ctx.fill();
    }
}

class ConstellationNode {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.speedY = (Math.random() - 0.5) * 0.45;
        this.opacity = Math.random() * 0.65 + 0.25;
        this.colour = SPECTRUM[Math.floor(Math.random() * SPECTRUM.length)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY - scrollVelocity * 0.65;
        const dx = mouseX - this.x, dy = mouseY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) { this.x -= dx * 0.016; this.y -= dy * 0.016; }
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }
    draw() {
        const stretch = Math.min(28, Math.abs(scrollVelocity) * 0.7);
        if (stretch > 1.2) {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - stretch);
            ctx.lineTo(this.x, this.y + stretch);
            const g = ctx.createLinearGradient(this.x, this.y - stretch, this.x, this.y + stretch);
            g.addColorStop(0,   `rgba(${this.colour},0)`);
            g.addColorStop(0.5, `rgba(255,255,255,${this.opacity * 1.5})`);
            g.addColorStop(1,   `rgba(${this.colour},0)`);
            ctx.strokeStyle = g;
            ctx.lineWidth = this.size * 1.3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.colour},${this.opacity})`;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.colour},${this.opacity * 0.18})`;
            ctx.fill();
        }
    }
}

class ShootingStar {
    constructor(scrollTriggered = false) { this.reset(scrollTriggered); }
    reset(scrollTriggered = false) {
        this.x = Math.random() * (canvas.width * 1.3) - canvas.width * 0.15;
        this.y = scrollTriggered ? -55 : Math.random() * canvas.height * 0.4;
        this.length = Math.random() * 110 + 70;
        this.speedX = -(Math.random() * 9 + 6);
        this.speedY = Math.random() * 10 + 8;
        if (scrollTriggered) {
            const s = Math.min(2.5, 1 + Math.abs(scrollVelocity) * 0.05);
            this.speedX *= s; this.speedY *= s;
        }
        this.opacity = 1.0;
        this.fadeSpeed = Math.random() * 0.016 + 0.01;
        const idx1 = Math.floor(Math.random() * SPECTRUM.length);
        const idx2 = (idx1 + 2) % SPECTRUM.length;
        this.c1 = SPECTRUM[idx1];
        this.c2 = SPECTRUM[idx2];
        this.active = true;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0 || this.x < -180 || this.y > canvas.height + 180) this.active = false;
    }
    draw() {
        if (!this.active) return;
        const tx = this.x - this.speedX * 4;
        const ty = this.y - this.speedY * 4;
        const g = ctx.createLinearGradient(this.x, this.y, tx, ty);
        g.addColorStop(0,    `rgba(255,255,255,${this.opacity})`);
        g.addColorStop(0.25, `rgba(${this.c1},${this.opacity * 0.9})`);
        g.addColorStop(0.65, `rgba(${this.c2},${this.opacity * 0.5})`);
        g.addColorStop(1,    `rgba(${this.c2},0)`);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = g;
        ctx.lineWidth = Math.random() * 2 + 1.8;
        ctx.stroke();
    }
}

class AuroraWave {
    constructor() { this.reset(); }
    reset() {
        this.y = Math.random() * canvas.height;
        this.height = Math.random() * 120 + 40;
        this.speed = (Math.random() - 0.5) * 0.3;
        this.alpha = Math.random() * 0.04 + 0.01;
        this.hue = Math.random() * 360;
        this.hueSpeed = Math.random() * 0.4 + 0.1;
        this.waveOffset = Math.random() * Math.PI * 2;
        this.waveFreq = Math.random() * 0.003 + 0.001;
        this.waveAmp = Math.random() * 30 + 10;
    }
    update() {
        this.y += this.speed;
        this.hue += this.hueSpeed;
        if (this.y < -this.height) this.y = canvas.height + this.height;
        if (this.y > canvas.height + this.height) this.y = -this.height;
    }
    draw(t) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 4) {
            const wave = Math.sin(x * this.waveFreq + t * 0.0008 + this.waveOffset) * this.waveAmp;
            if (x === 0) ctx.moveTo(x, this.y + wave);
            else ctx.lineTo(x, this.y + wave);
        }
        ctx.strokeStyle = `hsla(${this.hue % 360},100%,65%,${this.alpha})`;
        ctx.lineWidth = this.height * 0.3;
        ctx.stroke();
    }
}

function initParticles() {
    twinklingStars = [];
    const starCount = Math.min(200, Math.floor(canvas.width * canvas.height / 7000));
    for (let i = 0; i < starCount; i++) twinklingStars.push(new TwinklingStar());

    particles = [];
    const nodeCount = Math.min(70, Math.floor(canvas.width * canvas.height / 18000));
    for (let i = 0; i < nodeCount; i++) particles.push(new ConstellationNode());

    auroraWaves = [];
    for (let i = 0; i < 8; i++) auroraWaves.push(new AuroraWave());

    shootingStars = [];
}

function connectParticles() {
    const warpFactor = Math.min(1.0, Math.abs(scrollVelocity) * 0.08);
    if (warpFactor >= 0.95) return;
    const fadeMulti = 1.0 - warpFactor;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 135) {
                const op = (1 - dist / 135) * 0.14 * fadeMulti;
                if (op > 0) {
                    ctx.beginPath();
                    const idx = Math.floor(Math.random() * SPECTRUM.length);
                    ctx.strokeStyle = `rgba(${SPECTRUM[idx]},${op})`;
                    ctx.lineWidth = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
}

function animateParticles(ts = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scrollVelocity += (targetScrollVelocity - scrollVelocity) * 0.12;
    targetScrollVelocity *= 0.85;
    auroraWaves.forEach(w => { w.update(); w.draw(ts); });
    twinklingStars.forEach(s => { s.update(); s.draw(); });
    particles.forEach(n => { n.update(); n.draw(); });
    connectParticles();
    shootingStars = shootingStars.filter(s => s.active);
    shootingStars.forEach(s => { s.update(); s.draw(); });
    if (Math.random() < 0.003 && shootingStars.length < 4) shootingStars.push(new ShootingStar(false));
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

// ═════════════════════════════════════════
// CURSOR + TRAIL
// ═════════════════════════════════════════
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');
if (cursor && cursorFollower && window.matchMedia('(hover: hover)').matches) {
    let cx = 0, cy = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });
    function animateCursor() {
        cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
        cursor.style.transform = 'translate(-50%,-50%)';
        fx += (cx - fx) * 0.12;
        fy += (cy - fy) * 0.12;
        cursorFollower.style.left = fx + 'px'; cursorFollower.style.top = fy + 'px';
        cursorFollower.style.transform = 'translate(-50%,-50%)';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    document.addEventListener('mouseover', e => {
        if (e.target.closest('a,button,input,textarea,select,.about-card,.portfolio-card,.role-tab,.notice-row,.faculty-card,.contact-item,.news-card')) {
            cursorFollower.classList.add('hover');
            cursor.style.transform = 'translate(-50%,-50%) scale(1.6)';
        } else {
            cursorFollower.classList.remove('hover');
            cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        }
    });
    document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorFollower.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorFollower.style.opacity = '.6'; });

    // Trail
    const trailCount = 14, trailDots = [], trailPos = [];
    for (let i = 0; i < trailCount; i++) {
        const dot = document.createElement('div');
        const col = SPECTRUM[i % SPECTRUM.length];
        dot.style.cssText = `position:fixed;pointer-events:none;width:${Math.max(3,9-i*0.5)}px;height:${Math.max(3,9-i*0.5)}px;background:rgba(${col},${1-i*0.065});border-radius:50%;z-index:9997;top:0;left:0;transition:opacity .3s ease;box-shadow:0 0 ${5-i*0.3}px rgba(${col},.55);`;
        document.body.appendChild(dot);
        trailDots.push(dot);
        trailPos.push({ x:0, y:0 });
    }
    function animateTrail() {
        trailPos[0].x += (mouseX - trailPos[0].x) * 0.32;
        trailPos[0].y += (mouseY - trailPos[0].y) * 0.32;
        for (let i = 1; i < trailCount; i++) {
            trailPos[i].x += (trailPos[i-1].x - trailPos[i].x) * 0.26;
            trailPos[i].y += (trailPos[i-1].y - trailPos[i].y) * 0.26;
        }
        for (let i = 0; i < trailCount; i++) {
            trailDots[i].style.left = trailPos[i].x + 'px';
            trailDots[i].style.top = trailPos[i].y + 'px';
            trailDots[i].style.transform = 'translate(-50%,-50%)';
        }
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
}

// ═════════════════════════════════════════
// TYPED.JS
// ═════════════════════════════════════════
if (typeof Typed !== 'undefined') {
    new Typed(".text", {
        strings: ["Curious","Capable","Confident","Creative","Compassionate","Future-ready"],
        typeSpeed: 70, backSpeed: 50, backDelay: 1500,
        loop: true, smartBackspace: true
    });
}

// ═════════════════════════════════════════
// MOBILE MENU
// ═════════════════════════════════════════
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');
if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('bx-x');
        menuIcon.classList.toggle('bx-menu');
    });
    document.querySelectorAll('.navbar a').forEach(l => l.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuIcon.classList.remove('bx-x');
        menuIcon.classList.add('bx-menu');
    }));
}

// ═════════════════════════════════════════
// STICKY HEADER + SCROLL FX
// ═════════════════════════════════════════
const header = document.querySelector('.header');
const scrollTopBtn = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) header.classList.add('sticky'); else header.classList.remove('sticky');
    if (scrollTopBtn) {
        if (window.scrollY > 500) scrollTopBtn.classList.add('active');
        else scrollTopBtn.classList.remove('active');
    }
    updateActiveNav();
    const curr = window.scrollY;
    const diff = curr - lastScrollY;
    targetScrollVelocity += diff * 0.15;
    lastScrollY = curr;
    if (diff > 12 && Math.random() < 0.38) shootingStars.push(new ShootingStar(true));
    if (diff > 35 && Math.random() < 0.65) shootingStars.push(new ShootingStar(true));
    blobs.forEach((b, i) => {
        if (!b) return;
        const factors = [0.15, -0.12, 0.08, -0.10, 0.11, -0.07];
        b.style.transform = `translateY(${curr * factors[i]}px)`;
    });
});

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 200 && window.scrollY < sec.offsetTop - 200 + sec.clientHeight)
            current = sec.getAttribute('id');
    });
    navLinks.forEach(l => {
        l.classList.remove('active');
        if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
}

// ═════════════════════════════════════════
// SMOOTH SCROLL
// ═════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const t = document.querySelector(href);
        if (t) {
            e.preventDefault();
            window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
        }
    });
});

// ═════════════════════════════════════════
// SKILL BARS
// ═════════════════════════════════════════
const skillBars = document.querySelectorAll('.skill-progress');
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.width = e.target.getAttribute('data-progress') + '%';
            skillObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
skillBars.forEach(b => { b.style.width = '0%'; skillObs.observe(b); });

// ═════════════════════════════════════════
// REVEAL
// ═════════════════════════════════════════
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.about-card').forEach((c,i)=>{ c.classList.add('reveal-up'); c.style.transitionDelay=`${i*0.08}s`; revealObs.observe(c); });
document.querySelectorAll('.portfolio-card').forEach((c,i)=>{ c.classList.add('reveal-up'); c.style.transitionDelay=`${i*0.10}s`; revealObs.observe(c); });
document.querySelectorAll('.skill-category').forEach((c,i)=>{ c.classList.add('reveal-up'); c.style.transitionDelay=`${i*0.08}s`; revealObs.observe(c); });
document.querySelectorAll('.faculty-card').forEach((c,i)=>{ c.classList.add('reveal-up'); c.style.transitionDelay=`${i*0.08}s`; revealObs.observe(c); });
document.querySelectorAll('.news-card').forEach((c,i)=>{ c.classList.add('reveal-up'); c.style.transitionDelay=`${i*0.08}s`; revealObs.observe(c); });
document.querySelectorAll('.contact-item').forEach((c,i)=>{ c.classList.add('reveal-left'); c.style.transitionDelay=`${i*0.08}s`; revealObs.observe(c); });
document.querySelectorAll('.login-feature-list li').forEach((c,i)=>{ c.classList.add('reveal-left'); c.style.transitionDelay=`${i*0.08}s`; revealObs.observe(c); });
document.querySelectorAll('.heading').forEach(h=>{ h.classList.add('reveal-up'); revealObs.observe(h); });
const cs = document.querySelector('.contact-social'); if (cs) { cs.classList.add('reveal-left'); cs.style.transitionDelay='.32s'; revealObs.observe(cs); }
const cf = document.querySelector('.contact-form'); if (cf) { cf.classList.add('reveal-right'); revealObs.observe(cf); }
const lc = document.querySelector('.login-card'); if (lc) { lc.classList.add('reveal-right'); revealObs.observe(lc); }
const np = document.querySelector('.notice-panel'); if (np) { np.classList.add('reveal-up'); revealObs.observe(np); }

// ═════════════════════════════════════════
// LOGIN PORTAL — role tab switching
// ═════════════════════════════════════════
const tabs = document.querySelectorAll('.role-tab');
const usernameLabel = document.getElementById('username-label');
const usernameInput = document.getElementById('username');
const roleLabel = document.getElementById('role-label');
const roleIcon = document.getElementById('role-icon');

const roleConfig = {
    student: { label: 'Student', icon: 'bx-user',          usernameLabel: 'Student ID',     placeholder: 'e.g. KSS-2025-0314' },
    parent:  { label: 'Parent',  icon: 'bx-group',         usernameLabel: 'Parent ID / Mobile', placeholder: 'e.g. 98XXXXXXXX' },
    teacher: { label: 'Teacher', icon: 'bx-chalkboard',    usernameLabel: 'Faculty ID / Email', placeholder: 'faculty@kavresthali.edu.np' },
    admin:   { label: 'Admin',   icon: 'bx-shield-quarter', usernameLabel: 'Administrator',  placeholder: 'admin.username' }
};

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cfg = roleConfig[tab.dataset.role];
        usernameLabel.textContent = cfg.usernameLabel;
        usernameInput.placeholder = cfg.placeholder;
        usernameInput.value = '';
        if (roleLabel) roleLabel.textContent = cfg.label;
        if (roleIcon) roleIcon.className = 'bx ' + cfg.icon;
    });
});

// Password toggle
const togglePwBtn = document.getElementById('toggle-pw');
if (togglePwBtn) {
    togglePwBtn.addEventListener('click', () => {
        const pw = document.getElementById('password');
        const isPw = pw.type === 'password';
        pw.type = isPw ? 'text' : 'password';
        togglePwBtn.querySelector('i').className = 'bx ' + (isPw ? 'bx-hide' : 'bx-show');
    });
}

// ═════════════════════════════════════════
// LOGIN AUTHENTICATION + PORTAL REDIRECT
// ═════════════════════════════════════════
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const activeRole = document.querySelector('.role-tab.active')?.dataset.role || 'student';
        
        // Default credentials
        const validID = '123';
        const validPassword = 'Damodar@1234';
        
        // Validate credentials
        if (username === validID && password === validPassword) {
            const submit = loginForm.querySelector('.login-submit');
            const original = submit.innerHTML;
            submit.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Authenticating…`;
            submit.disabled = true;
            
            setTimeout(() => {
                submit.innerHTML = `<i class='bx bx-check-circle'></i> Welcome — Redirecting…`;
                submit.classList.add('success');
                launchConfetti();
                
                // Store login info and redirect to portal
                localStorage.setItem('userRole', activeRole);
                localStorage.setItem('userName', username);
                localStorage.setItem('loggedIn', 'true');
                
                setTimeout(() => {
                    window.location.href = 'portal.html?role=' + activeRole;
                }, 1200);
            }, 1000);
        } else {
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'login-error';
            errorDiv.innerHTML = `<i class='bx bx-x-circle'></i> Invalid ID or Password. Try: ID=123, Password=Damodar@1234`;
            loginForm.insertBefore(errorDiv, loginForm.querySelector('.login-row'));
            
            setTimeout(() => errorDiv.remove(), 4000);
        }
    });
}

// ═════════════════════════════════════════
// CONFETTI BURST
// ═════════════════════════════════════════
function launchConfetti() {
    const colors = ['#00f5ff','#ff00e5','#ffd700','#00ff9d','#c084fc','#fb7185'];
    for (let i = 0; i < 50; i++) {
        const dot = document.createElement('div');
        const col = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const startX = window.innerWidth * 0.5 + (Math.random() - 0.5) * 200;
        const startY = window.innerHeight * 0.55;
        dot.style.cssText = `position:fixed;left:${startX}px;top:${startY}px;width:${size}px;height:${size}px;background:${col};border-radius:${Math.random() > 0.5 ? '50%' : '2px'};pointer-events:none;z-index:99999;box-shadow:0 0 6px ${col};`;
        const vx = (Math.random() - 0.5) * 320;
        const vy = -(Math.random() * 420 + 150);
        const r = Math.random() * 720;
        const id = `cf_${Date.now()}_${i}`;
        const style = document.createElement('style');
        style.textContent = `@keyframes ${id}{0%{transform:translate(0,0) rotate(0) scale(1);opacity:1}100%{transform:translate(${vx}px,${vy + 420}px) rotate(${r}deg) scale(0);opacity:0}}`;
        document.head.appendChild(style);
        dot.style.animation = `${id} 1.8s ease-out forwards`;
        document.body.appendChild(dot);
        setTimeout(() => { dot.remove(); style.remove(); }, 2000);
    }
}

// ═════════════════════════════════════════
// CONTACT FORM
// ═════════════════════════════════════════
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', e => {
        e.preventDefault();
        const status = document.getElementById('form-status');
        const submit = contactForm.querySelector('.submit-btn');
        const original = submit.innerHTML;
        submit.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i> Sending…`;
        submit.disabled = true;
        setTimeout(() => {
            status.textContent = '✅ Message received — our office will reply within one working day.';
            status.className = 'form-status success';
            contactForm.reset();
            submit.innerHTML = original;
            submit.disabled = false;
            launchConfetti();
            setTimeout(() => status.className = 'form-status', 6000);
        }, 1200);
    });
}

// ═════════════════════════════════════════
// COUNTER ANIMATION
// ═════════════════════════════════════════
const numObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const el = e.target;
            const target = parseFloat(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            const decimals = (target % 1 !== 0) ? 1 : 0;
            let cur = 0;
            const steps = 50;
            const inc = target / steps;
            const tm = setInterval(() => {
                cur += inc;
                if (cur >= target) { cur = target; clearInterval(tm); }
                el.textContent = cur.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + suffix;
            }, 24);
            numObs.unobserve(el);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => numObs.observe(el));

// ═════════════════════════════════════════
// HOME PARALLAX
// ═════════════════════════════════════════
const homeSection = document.querySelector('.home');
const homeImg = document.querySelector('.home-img');
if (homeSection && homeImg && window.matchMedia('(hover: hover)').matches) {
    homeSection.addEventListener('mousemove', e => {
        const r = homeSection.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        homeImg.style.transform = `translate(${x*22}px,${y*22}px)`;
    });
    homeSection.addEventListener('mouseleave', () => { homeImg.style.transform = 'translate(0,0)'; homeImg.style.transition = 'transform .5s ease'; });
    homeSection.addEventListener('mouseenter', () => { homeImg.style.transition = 'transform .1s ease'; });
}

// ═════════════════════════════════════════
// RESIZE
// ═════════════════════════════════════════
let rt;
window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resizeCanvas(); initParticles(); }, 250); });

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => { el.style.animationDuration = '.01s'; el.style.transitionDuration = '.01s'; });
}

document.addEventListener('DOMContentLoaded', () => { updateActiveNav(); document.body.classList.add('loaded'); });
