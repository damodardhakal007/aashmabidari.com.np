// ============================================
// PRELOADER & IMAGE ENTRY ANIMATION
// ============================================
const imgBox = document.querySelector('.img-box');
if (imgBox) {
    const setupInitialImagePosition = () => {
        const rect = imgBox.getBoundingClientRect();
        const startX = window.innerWidth / 2 - (rect.left + rect.width / 2);
        const startY = window.innerHeight - 50 - (rect.top + rect.height / 2);
        imgBox.style.transition = 'none';
        imgBox.style.transform = `translate(${startX}px, ${startY}px) scale(0.2)`;
        imgBox.style.opacity = '0.25';
    };
    setupInitialImagePosition();
    window.addEventListener('resize', () => {
        if (!imgBox.classList.contains('floating')) setupInitialImagePosition();
    });
}

window.addEventListener('load', () => {
    const preloader   = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    const loaderRing  = preloader.querySelector('.loader-ring');
    const fullText    = "Damodar Dhakal";
    let index = 1;

    function typeEffect() {
        if (index < fullText.length) {
            if (index === 1 && loaderRing) loaderRing.classList.add('fade-out');
            preloaderText.textContent += fullText.charAt(index);
            index++;
            setTimeout(typeEffect, 80);
        } else {
            setTimeout(() => {
                preloader.classList.add('hidden');
                if (imgBox) {
                    imgBox.style.transition = 'transform 1.6s cubic-bezier(0.25,1,0.30,1), opacity 1.6s ease-out';
                    imgBox.style.transform  = 'translate(0,0) scale(1)';
                    imgBox.style.opacity    = '1';
                    setTimeout(() => {
                        imgBox.classList.add('floating');
                        imgBox.style.transform = '';
                        imgBox.style.transition = '';
                    }, 1600);
                }
            }, 800);
        }
    }
    setTimeout(typeEffect, 1000);
});

// ============================================
// AURORA PARTICLE BACKGROUND
// Full-spectrum: rainbow stars, coloured nodes, prismatic shooting stars
// ============================================
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');

const blob1 = document.querySelector('.blob-1');
const blob2 = document.querySelector('.blob-2');
const blob3 = document.querySelector('.blob-3');
const blob4 = document.querySelector('.blob-4');
const blob5 = document.querySelector('.blob-5');
const blob6 = document.querySelector('.blob-6');

let particles    = [];
let twinklingStars = [];
let shootingStars  = [];
let auroraWaves    = [];
let mouseX = 0, mouseY = 0;
let lastScrollY = window.scrollY || 0;
let scrollVelocity = 0, targetScrollVelocity = 0;

// Full-spectrum node colours
const SPECTRUM = [
    '0,245,255',    // cyan
    '255,0,229',    // magenta
    '255,215,0',    // gold
    '0,255,157',    // emerald
    '192,132,252',  // violet
    '251,113,133',  // rose
    '96,165,250',   // sapphire
    '255,107,107',  // coral
];

function resizeCanvas() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ── 1. Multicolour twinkling stars ──────────────────────────────────
class TwinklingStar {
    constructor() { this.reset(); }
    reset() {
        this.x    = Math.random() * canvas.width;
        this.y    = Math.random() * canvas.height;
        this.size = Math.random() * 1.4 + 0.2;
        this.alpha= Math.random();
        this.speed= Math.random() * 0.016 + 0.005;
        this.brightness = Math.random() * 0.5 + 0.5;
        // Randomly rainbow-coloured stars (20%) or pure white (80%)
        this.colour = Math.random() < 0.2
            ? SPECTRUM[Math.floor(Math.random() * SPECTRUM.length)]
            : '255,255,255';
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

// ── 2. Constellation nodes with spectrum colours ─────────────────────
class ConstellationNode {
    constructor() { this.reset(); }
    reset() {
        this.x      = Math.random() * canvas.width;
        this.y      = Math.random() * canvas.height;
        this.size   = Math.random() * 2.2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.45;
        this.speedY = (Math.random() - 0.5) * 0.45;
        this.opacity= Math.random() * 0.65 + 0.25;
        this.colour = SPECTRUM[Math.floor(Math.random() * SPECTRUM.length)];
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY - scrollVelocity * 0.65;
        const dx = mouseX - this.x, dy = mouseY - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 130) { this.x -= dx * 0.016; this.y -= dy * 0.016; }
        if (this.x < 0)            this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0)            this.y = canvas.height;
        if (this.y > canvas.height)this.y = 0;
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
            ctx.lineWidth   = this.size * 1.3;
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.colour},${this.opacity})`;
            ctx.fill();
            // outer glow halo
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.colour},${this.opacity * 0.18})`;
            ctx.fill();
        }
    }
}

// ── 3. Prismatic shooting stars ───────────────────────────────────────
class ShootingStar {
    constructor(scrollTriggered = false) { this.reset(scrollTriggered); }
    reset(scrollTriggered = false) {
        this.x = Math.random() * (canvas.width * 1.3) - canvas.width * 0.15;
        this.y = scrollTriggered ? -55 : Math.random() * canvas.height * 0.4;
        this.length  = Math.random() * 110 + 70;
        this.speedX  = -(Math.random() * 9 + 6);
        this.speedY  = Math.random() * 10 + 8;
        if (scrollTriggered) {
            const s = Math.min(2.5, 1 + Math.abs(scrollVelocity) * 0.05);
            this.speedX *= s; this.speedY *= s;
        }
        this.opacity  = 1.0;
        this.fadeSpeed= Math.random() * 0.016 + 0.01;
        // random prismatic pair
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
        const g  = ctx.createLinearGradient(this.x, this.y, tx, ty);
        g.addColorStop(0,   `rgba(255,255,255,${this.opacity})`);
        g.addColorStop(0.25,`rgba(${this.c1},${this.opacity * 0.9})`);
        g.addColorStop(0.65,`rgba(${this.c2},${this.opacity * 0.5})`);
        g.addColorStop(1,   `rgba(${this.c2},0)`);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = g;
        ctx.lineWidth   = Math.random() * 2 + 1.8;
        ctx.stroke();
    }
}

// ── 4. Aurora wave ribbons ────────────────────────────────────────────
class AuroraWave {
    constructor() { this.reset(); }
    reset() {
        this.y      = Math.random() * canvas.height;
        this.height = Math.random() * 120 + 40;
        this.speed  = (Math.random() - 0.5) * 0.3;
        this.alpha  = Math.random() * 0.04 + 0.01;
        this.hue    = Math.random() * 360;
        this.hueSpeed = Math.random() * 0.4 + 0.1;
        this.waveOffset = Math.random() * Math.PI * 2;
        this.waveFreq   = Math.random() * 0.003 + 0.001;
        this.waveAmp    = Math.random() * 30 + 10;
    }
    update(t) {
        this.y    += this.speed;
        this.hue  += this.hueSpeed;
        if (this.y < -this.height) this.y = canvas.height + this.height;
        if (this.y > canvas.height + this.height) this.y = -this.height;
    }
    draw(t) {
        ctx.beginPath();
        for (let x = 0; x <= canvas.width; x += 4) {
            const wave = Math.sin(x * this.waveFreq + t * 0.0008 + this.waveOffset) * this.waveAmp;
            if (x === 0) ctx.moveTo(x, this.y + wave);
            else         ctx.lineTo(x, this.y + wave);
        }
        ctx.strokeStyle = `hsla(${this.hue % 360},100%,65%,${this.alpha})`;
        ctx.lineWidth   = this.height * 0.3;
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
            const dx   = particles[i].x - particles[j].x;
            const dy   = particles[i].y - particles[j].y;
            const dist = Math.hypot(dx, dy);
            if (dist < 135) {
                const op = (1 - dist / 135) * 0.14 * fadeMulti;
                if (op > 0) {
                    ctx.beginPath();
                    // Blend both node colours for rainbow lines
                    const idx = Math.floor(Math.random() * SPECTRUM.length);
                    ctx.strokeStyle = `rgba(${SPECTRUM[idx]},${op})`;
                    ctx.lineWidth   = 0.6;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
}

let frameTime = 0;
function animateParticles(ts = 0) {
    frameTime = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    scrollVelocity      += (targetScrollVelocity - scrollVelocity) * 0.12;
    targetScrollVelocity *= 0.85;

    // Aurora waves (drawn first — behind everything)
    auroraWaves.forEach(w => { w.update(ts); w.draw(ts); });

    // Stars
    twinklingStars.forEach(s => { s.update(); s.draw(); });

    // Nodes + connections
    particles.forEach(n => { n.update(); n.draw(); });
    connectParticles();

    // Shooting stars
    shootingStars = shootingStars.filter(s => s.active);
    shootingStars.forEach(s => { s.update(); s.draw(); });

    // Natural occasional shooting star
    if (Math.random() < 0.003 && shootingStars.length < 4)
        shootingStars.push(new ShootingStar(false));

    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

// ============================================
// CUSTOM CURSOR
// ============================================
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

if (cursor && cursorFollower) {
    let cx = 0, cy = 0, fx = 0, fy = 0;
    document.addEventListener('mousemove', e => { cx = e.clientX; cy = e.clientY; });

    function animateCursor() {
        cursor.style.left      = cx + 'px';
        cursor.style.top       = cy + 'px';
        cursor.style.transform = 'translate(-50%,-50%)';

        fx += (cx - fx) * 0.12;
        fy += (cy - fy) * 0.12;
        cursorFollower.style.left      = fx + 'px';
        cursorFollower.style.top       = fy + 'px';
        cursorFollower.style.transform = 'translate(-50%,-50%)';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    const hoverEls = document.querySelectorAll('a,button,.about-card,.portfolio-card,input,textarea');
    hoverEls.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('hover');
            cursor.style.transform = 'translate(-50%,-50%) scale(1.6)';
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('hover');
            cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        });
    });

    document.addEventListener('mouseleave', () => { cursor.style.opacity='0'; cursorFollower.style.opacity='0'; });
    document.addEventListener('mouseenter', () => { cursor.style.opacity='1'; cursorFollower.style.opacity='.6'; });
}

// ============================================
// CURSOR TRAIL
// ============================================
const trailCount = 14;
const trailDots  = [];
const trailPos   = [];

for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement('div');
    const col = SPECTRUM[i % SPECTRUM.length];
    dot.style.cssText = `
        position:fixed; pointer-events:none;
        width:${Math.max(3, 9-i*0.5)}px;
        height:${Math.max(3, 9-i*0.5)}px;
        background:rgba(${col},${1-i*0.065});
        border-radius:50%; z-index:9997;
        top:0; left:0; transition:opacity .3s ease;
        box-shadow:0 0 ${5-i*0.3}px rgba(${col},.55);
    `;
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
        trailDots[i].style.left      = trailPos[i].x + 'px';
        trailDots[i].style.top       = trailPos[i].y + 'px';
        trailDots[i].style.transform = 'translate(-50%,-50%)';
    }
    requestAnimationFrame(animateTrail);
}
animateTrail();
if ('ontouchstart' in window) trailDots.forEach(d => d.style.display = 'none');

// ============================================
// TYPED.JS
// ============================================
var typed = new Typed(".text", {
    strings: ["Banker","Coder","Web Developer","Android App Developer","AI Enthusiast","Entrepreneur"],
    typeSpeed: 70, backSpeed: 50, backDelay: 1500,
    loop: true, smartBackspace: true
});

// ============================================
// MOBILE MENU
// ============================================
const menuIcon = document.getElementById('menu-icon');
const navbar   = document.querySelector('.navbar');
if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('bx-x');
    });
    document.querySelectorAll('.navbar a').forEach(l => l.addEventListener('click', () => {
        navbar.classList.remove('active');
        menuIcon.classList.remove('bx-x');
    }));
    document.addEventListener('click', e => {
        if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
        }
    });
}

// ============================================
// STICKY HEADER + SCROLL-TO-TOP
// ============================================
const header      = document.querySelector('.header');
const scrollTopBtn= document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) header.classList.add('sticky');
    else                       header.classList.remove('sticky');

    if (scrollTopBtn) {
        if (window.scrollY > 500) scrollTopBtn.classList.add('active');
        else                       scrollTopBtn.classList.remove('active');
    }

    updateActiveNav();

    const curr = window.scrollY;
    const diff = curr - lastScrollY;
    targetScrollVelocity += diff * 0.15;
    lastScrollY = curr;

    if (diff > 12 && Math.random() < 0.38) shootingStars.push(new ShootingStar(true));
    if (diff > 35 && Math.random() < 0.65) shootingStars.push(new ShootingStar(true));

    if (blob1) blob1.style.transform = `translateY(${curr * 0.15}px)`;
    if (blob2) blob2.style.transform = `translateY(${curr * -0.12}px)`;
    if (blob3) blob3.style.transform = `translateY(${curr * 0.08}px)`;
    if (blob4) blob4.style.transform = `translateY(${curr * -0.10}px)`;
    if (blob5) blob5.style.transform = `translateY(${curr * 0.11}px)`;
    if (blob6) blob6.style.transform = `translateY(${curr * -0.07}px)`;
});

// ============================================
// ACTIVE NAV
// ============================================
function updateActiveNav() {
    const sections  = document.querySelectorAll('section');
    const navLinks  = document.querySelectorAll('.navbar a');
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 150 && window.scrollY < sec.offsetTop - 150 + sec.clientHeight)
            current = sec.getAttribute('id');
    });
    navLinks.forEach(l => {
        l.classList.remove('active');
        if (l.getAttribute('href') === '#' + current) l.classList.add('active');
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
    });
});

// ============================================
// SKILL BAR ANIMATION
// ============================================
const skillBars = document.querySelectorAll('.skill-progress');
const skillObs  = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.width = e.target.getAttribute('data-progress') + '%';
            skillObs.unobserve(e.target);
        }
    });
}, { threshold: 0.3 });
skillBars.forEach(b => { b.style.width = '0%'; skillObs.observe(b); });

// ============================================
// SCROLL REVEAL
// ============================================
const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

function setupReveal() {
    document.querySelectorAll('.about-card').forEach((c, i) => {
        c.classList.add('reveal-up'); c.style.transitionDelay = `${i * 0.1}s`; revealObs.observe(c);
    });
    document.querySelectorAll('.portfolio-card').forEach((c, i) => {
        c.classList.add('reveal-up'); c.style.transitionDelay = `${i * 0.14}s`; revealObs.observe(c);
    });
    document.querySelectorAll('.skill-category').forEach((c, i) => {
        c.classList.add('reveal-up'); c.style.transitionDelay = `${i * 0.1}s`; revealObs.observe(c);
    });
    document.querySelectorAll('.contact-item').forEach((c, i) => {
        c.classList.add('reveal-left'); c.style.transitionDelay = `${i * 0.1}s`; revealObs.observe(c);
    });
    const cs = document.querySelector('.contact-social');
    if (cs) { cs.classList.add('reveal-left'); cs.style.transitionDelay = '0.4s'; revealObs.observe(cs); }
    const cf = document.querySelector('.contact-form');
    if (cf) { cf.classList.add('reveal-right'); revealObs.observe(cf); }
    document.querySelectorAll('.heading').forEach(h => { h.classList.add('reveal-up'); revealObs.observe(h); });
}
setupReveal();

// ============================================
// TILT EFFECT
// ============================================
if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(el => {
        el.addEventListener('mousemove', e => {
            const r  = el.getBoundingClientRect();
            const rx = ((e.clientY - r.top)  / r.height - 0.5) * -6;
            const ry = ((e.clientX - r.left) / r.width  - 0.5) *  6;
            el.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// ============================================
// PERCENT COUNTER ANIMATION
// ============================================
const pctObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const end = parseInt(e.target.textContent);
            let cur   = 0;
            const inc = end / 50;
            const t   = setInterval(() => {
                cur += inc;
                if (cur >= end) { cur = end; clearInterval(t); }
                e.target.textContent = Math.round(cur) + '%';
            }, 30);
            pctObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.skill-percent').forEach(el => pctObs.observe(el));

// ============================================
// CONTACT FORM  —  Supabase backend
// Messages saved to DB + email sent to damodardhakal008@gmail.com
// ============================================
const SUPABASE_FUNC_URL = 'https://vhdnbximfxrucjfkzljd.supabase.co/functions/v1/send-contact';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZG5ieGltZnhydWNqZmt6bGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MjQ0ODcsImV4cCI6MjA5NTUwMDQ4N30.JGXBW2Eu2L7Wsu2qiMXnbgjYV83EmKcseHng1i_Ja9Y';

const contactForm = document.getElementById('contact-form');
const submitBtn   = document.getElementById('submit-btn');
const formStatus  = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async e => {
        e.preventDefault();

        const name    = document.getElementById('from_name').value.trim();
        const email   = document.getElementById('from_email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showStatus('⚠️ Please fill in all fields.', 'error'); return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showStatus('⚠️ Please enter a valid email address.', 'error'); return;
        }

        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            const res = await fetch(SUPABASE_FUNC_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({ name, email, subject, message }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                showStatus('✅ Message sent successfully! Damodar will get back to you soon.', 'success');
                contactForm.reset();
                // Confetti burst on success
                launchConfetti();
            } else {
                throw new Error(data.error || 'Submission failed');
            }
        } catch (err) {
            console.error('Contact form error:', err);
            showStatus('❌ Could not send message. Please try again or reach out on social media.', 'error');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

function showStatus(msg, type) {
    if (!formStatus) return;
    formStatus.textContent = msg;
    formStatus.className   = 'form-status ' + type;
    setTimeout(() => formStatus.className = 'form-status', 6000);
}

// Mini confetti burst on successful form submission
function launchConfetti() {
    const colors = ['#00f5ff','#ff00e5','#ffd700','#00ff9d','#c084fc','#fb7185'];
    for (let i = 0; i < 60; i++) {
        const dot = document.createElement('div');
        const col = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 8 + 4;
        const startX = window.innerWidth  * 0.5 + (Math.random() - 0.5) * 200;
        const startY = window.innerHeight * 0.6;
        dot.style.cssText = `
            position:fixed; left:${startX}px; top:${startY}px;
            width:${size}px; height:${size}px;
            background:${col}; border-radius:${Math.random() > 0.5 ? '50%' : '2px'};
            pointer-events:none; z-index:99999;
            box-shadow:0 0 6px ${col};
            animation: confettiFly${i} 1.8s ease-out forwards;
        `;
        const vx = (Math.random() - 0.5) * 300;
        const vy = -(Math.random() * 400 + 150);
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confettiFly${i} {
                0%   { transform: translate(0,0)         rotate(0deg)   scale(1);   opacity:1; }
                100% { transform: translate(${vx}px,${vy + 400}px) rotate(${Math.random()*720}deg) scale(0); opacity:0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(dot);
        setTimeout(() => { dot.remove(); style.remove(); }, 2000);
    }
}

// ============================================
// MAGNETIC BUTTON
// ============================================
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width  / 2;
        const y = e.clientY - r.top  - r.height / 2;
        btn.style.transform = `translate(${x*.22}px,${y*.22}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)');
});

// ============================================
// HOME PARALLAX
// ============================================
const homeSection = document.querySelector('.home');
const homeImg     = document.querySelector('.home-img');
if (homeSection && homeImg && window.matchMedia('(hover: hover)').matches) {
    homeSection.addEventListener('mousemove', e => {
        const r = homeSection.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        homeImg.style.transform = `translate(${x*22}px,${y*22}px)`;
    });
    homeSection.addEventListener('mouseleave', () => { homeImg.style.transform = 'translate(0,0)'; homeImg.style.transition = 'transform .5s ease'; });
    homeSection.addEventListener('mouseenter', () => { homeImg.style.transition = 'transform .1s ease'; });
}

// ============================================
// PERFORMANCE
// ============================================
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)
    particles = particles.slice(0, 20);

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    document.querySelectorAll('*').forEach(el => { el.style.animationDuration = '.01s'; el.style.transitionDuration = '.01s'; });

// resize
let rt;
window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resizeCanvas(); initParticles(); }, 250); });

// ============================================
// DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => { updateActiveNav(); document.body.classList.add('loaded'); });
