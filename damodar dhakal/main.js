// ============================================
// PRELOADER & IMAGE ENTRY ANIMATION
// ============================================
const imgBox = document.querySelector('.img-box');
if (imgBox) {
    const setupInitialImagePosition = () => {
        const rect = imgBox.getBoundingClientRect();
        // Position at bottom center of the viewport
        const startX = window.innerWidth / 2 - (rect.left + rect.width / 2);
        const startY = window.innerHeight - 50 - (rect.top + rect.height / 2);
        
        imgBox.style.transition = 'none';
        imgBox.style.transform = `translate(${startX}px, ${startY}px) scale(0.2)`;
        imgBox.style.opacity = '0.25';
    };
    
    // Position immediately
    setupInitialImagePosition();
    
    // Ensure position stays correct if resized during loading
    window.addEventListener('resize', () => {
        if (!imgBox.classList.contains('floating')) {
            setupInitialImagePosition();
        }
    });
}

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    const loaderRing = preloader.querySelector('.loader-ring');
    const fullText = "Damodar Dhakal";
    let index = 1; // Start typing after the initial "D"
    
    function typeEffect() {
        if (index < fullText.length) {
            if (index === 1 && loaderRing) {
                loaderRing.classList.add('fade-out');
            }
            preloaderText.textContent += fullText.charAt(index);
            index++;
            setTimeout(typeEffect, 80); // Typing speed
        } else {
            // Once finished typing, fade out the preloader and fly in the image
            setTimeout(() => {
                preloader.classList.add('hidden');
                
                if (imgBox) {
                    imgBox.style.transition = 'transform 1.6s cubic-bezier(0.25, 1, 0.30, 1), opacity 1.6s ease-out';
                    imgBox.style.transform = 'translate(0, 0) scale(1)';
                    imgBox.style.opacity = '1';
                    
                    // Enable hover and float animations after the entrance transition ends
                    setTimeout(() => {
                        imgBox.classList.add('floating');
                        imgBox.style.transform = '';
                        imgBox.style.transition = '';
                    }, 1600);
                }
            }, 800);
        }
    }
    
    // Allow the loader ring to spin around "D" first, then start typing
    setTimeout(typeEffect, 1000);
});

// ============================================
// PARTICLE BACKGROUND
// ============================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '0, 238, 255' : '168, 85, 247';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
        }

        // Wrap around
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                const opacity = (1 - dist / 120) * 0.15;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 238, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// ============================================
// CUSTOM CURSOR WITH TRAILING DOTS
// ============================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

if (cursor && cursorFollower) {
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function animateCursor() {
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        cursor.style.transform = 'translate(-50%, -50%)';

        followerX += (cursorX - followerX) * 0.12;
        followerY += (cursorY - followerY) * 0.12;
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        cursorFollower.style.transform = 'translate(-50%, -50%)';

        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Hover effects on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .about-card, .portfolio-card, input, textarea');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('hover');
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('hover');
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
        trailDots.forEach(dot => dot.style.opacity = '0');
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '0.6';
        trailDots.forEach(dot => dot.style.opacity = '1');
    });
}

// ============================================
// CURSOR TRAIL - SMALL DOTS FOLLOWING CURSOR
// ============================================
const trailCount = 12;
const trailDots = [];
const trailPositions = [];

for (let i = 0; i < trailCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail-dot';
    dot.style.cssText = `
        position: fixed;
        pointer-events: none;
        width: ${Math.max(3, 8 - i * 0.5)}px;
        height: ${Math.max(3, 8 - i * 0.5)}px;
        background: rgba(0, 238, 255, ${1 - i * 0.07});
        border-radius: 50%;
        z-index: 9997;
        top: 0;
        left: 0;
        transition: opacity 0.3s ease;
        box-shadow: 0 0 ${4 - i * 0.3}px rgba(0, 238, 255, ${0.5 - i * 0.04});
    `;
    document.body.appendChild(dot);
    trailDots.push(dot);
    trailPositions.push({ x: 0, y: 0 });
}

function animateTrail() {
    // First dot follows the cursor directly
    trailPositions[0].x += (mouseX - trailPositions[0].x) * 0.3;
    trailPositions[0].y += (mouseY - trailPositions[0].y) * 0.3;

    // Each subsequent dot follows the one before it
    for (let i = 1; i < trailCount; i++) {
        trailPositions[i].x += (trailPositions[i - 1].x - trailPositions[i].x) * 0.25;
        trailPositions[i].y += (trailPositions[i - 1].y - trailPositions[i].y) * 0.25;
    }

    // Update dot positions
    for (let i = 0; i < trailCount; i++) {
        trailDots[i].style.left = trailPositions[i].x + 'px';
        trailDots[i].style.top = trailPositions[i].y + 'px';
        trailDots[i].style.transform = 'translate(-50%, -50%)';
    }

    requestAnimationFrame(animateTrail);
}

animateTrail();

// Hide trail dots on touch devices
if ('ontouchstart' in window) {
    trailDots.forEach(dot => dot.style.display = 'none');
}

// ============================================
// TYPED.JS INITIALIZATION
// ============================================
var typed = new Typed(".text", {
    strings: ["Banker", "Coder", "Web Developer", "Android App Developer", "AI Enthusiast", "Entrepreneur"],
    typeSpeed: 70,
    backSpeed: 50,
    backDelay: 1500,
    loop: true,
    smartBackspace: true
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
    menuIcon.addEventListener('click', () => {
        navbar.classList.toggle('active');
        menuIcon.classList.toggle('bx-x');
    });

    // Close menu when a nav link is clicked
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && !menuIcon.contains(e.target)) {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
        }
    });
}

// ============================================
// STICKY HEADER & SCROLL TO TOP
// ============================================
const header = document.querySelector('.header');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
    // Sticky header
    if (window.scrollY > 100) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }

    // Scroll to top button visibility
    if (scrollTopBtn) {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    }

    // Active nav link based on scroll position
    updateActiveNav();
});

// ============================================
// ACTIVE NAVIGATION
// ============================================
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.clientHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SKILL BARS ANIMATION (Intersection Observer)
// ============================================
const skillBars = document.querySelectorAll('.skill-progress');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.width = progress + '%';
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(bar => {
    bar.style.width = '0%';
    skillObserver.observe(bar);
});

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

// Apply reveal animations to various elements
function setupRevealAnimations() {
    // About cards - staggered
    document.querySelectorAll('.about-card').forEach((card, index) => {
        card.classList.add('reveal-up');
        card.style.transitionDelay = `${index * 0.1}s`;
        revealObserver.observe(card);
    });

    // Portfolio cards - staggered
    document.querySelectorAll('.portfolio-card').forEach((card, index) => {
        card.classList.add('reveal-up');
        card.style.transitionDelay = `${index * 0.15}s`;
        revealObserver.observe(card);
    });

    // Skill categories
    document.querySelectorAll('.skill-category').forEach((cat, index) => {
        cat.classList.add('reveal-up');
        cat.style.transitionDelay = `${index * 0.1}s`;
        revealObserver.observe(cat);
    });

    // Contact items
    document.querySelectorAll('.contact-item').forEach((item, index) => {
        item.classList.add('reveal-left');
        item.style.transitionDelay = `${index * 0.1}s`;
        revealObserver.observe(item);
    });

    // Contact social
    const contactSocial = document.querySelector('.contact-social');
    if (contactSocial) {
        contactSocial.classList.add('reveal-left');
        contactSocial.style.transitionDelay = '0.4s';
        revealObserver.observe(contactSocial);
    }

    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.classList.add('reveal-right');
        revealObserver.observe(contactForm);
    }

    // Headings
    document.querySelectorAll('.heading').forEach(heading => {
        heading.classList.add('reveal-up');
        revealObserver.observe(heading);
    });
}

setupRevealAnimations();

// ============================================
// TILT EFFECT ON CARDS
// ============================================
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Only init tilt on non-touch devices
if (window.matchMedia('(hover: hover)').matches) {
    initTiltEffect();
}

// ============================================
// COUNTER ANIMATION FOR SKILL PERCENTAGES
// ============================================
const percentObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = entry.target;
            const endValue = parseInt(target.textContent);
            let current = 0;
            const increment = endValue / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= endValue) {
                    current = endValue;
                    clearInterval(timer);
                }
                target.textContent = Math.round(current) + '%';
            }, 30);
            percentObserver.unobserve(target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill-percent').forEach(el => {
    percentObserver.observe(el);
});

// ============================================
// CONTACT FORM HANDLER
// ============================================
const contactForm = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('from_name').value.trim();
        const email = document.getElementById('from_email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        // Basic validation
        if (!name || !email || !subject || !message) {
            showFormStatus('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormStatus('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Method 1: Try EmailJS if configured
            if (typeof emailjs !== 'undefined' && window.EMAILJS_SERVICE_ID) {
                await emailjs.send(
                    window.EMAILJS_SERVICE_ID,
                    window.EMAILJS_TEMPLATE_ID,
                    {
                        from_name: name,
                        from_email: email,
                        subject: subject,
                        message: message,
                        to_name: 'Damodar Dhakal'
                    }
                );
                showFormStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
            } else {
                // Method 2: Use Formspree or mailto fallback
                const formData = new FormData();
                formData.append('name', name);
                formData.append('email', email);
                formData.append('subject', subject);
                formData.append('message', message);
                formData.append('_replyto', email);

                // Try Formspree (replace with actual endpoint if available)
                try {
                    const response = await fetch('https://formspree.io/f/xwpkvpba', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });

                    if (response.ok) {
                        showFormStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                        contactForm.reset();
                    } else {
                        throw new Error('Form submission failed');
                    }
                } catch (fetchError) {
                    // Fallback: Open mail client
                    const mailtoLink = `mailto:damodardhakal007@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
                    window.location.href = mailtoLink;
                    showFormStatus('✅ Opening your email client to send the message.', 'success');
                    contactForm.reset();
                }
            }
        } catch (error) {
            showFormStatus('❌ Failed to send message. Please try again or contact me directly on social media.', 'error');
            console.error('Form error:', error);
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

function showFormStatus(message, type) {
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.className = 'form-status';
        }, 5000);
    }
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================
const magneticBtns = document.querySelectorAll('.magnetic-btn');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ============================================
// TEXT REVEAL ANIMATION
// ============================================
function initTextReveal() {
    const textElements = document.querySelectorAll('.reveal-text');
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                textObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    textElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        textObserver.observe(el);
    });
}

// Don't override home section built-in animations
// initTextReveal(); -- disabled since home has CSS animations already

// ============================================
// PARALLAX EFFECT ON HOME SECTION
// ============================================
const homeSection = document.querySelector('.home');
const homeImg = document.querySelector('.home-img');

if (homeSection && homeImg && window.matchMedia('(hover: hover)').matches) {
    homeSection.addEventListener('mousemove', (e) => {
        const rect = homeSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        homeImg.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    });

    homeSection.addEventListener('mouseleave', () => {
        homeImg.style.transform = 'translate(0, 0)';
        homeImg.style.transition = 'transform 0.5s ease';
    });

    homeSection.addEventListener('mouseenter', () => {
        homeImg.style.transition = 'transform 0.1s ease';
    });
}

// ============================================
// SMOOTH PAGE TRANSITIONS
// ============================================
document.querySelectorAll('section').forEach(section => {
    section.style.position = 'relative';
    section.style.zIndex = '1';
});

// ============================================
// PERFORMANCE: REDUCE ANIMATIONS ON LOW-END DEVICES
// ============================================
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    // Reduce particles for low-end devices
    particles = particles.slice(0, 20);
}

// Reduce motion for users who prefer it
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animationDuration = '0.01s';
        el.style.transitionDuration = '0.01s';
    });
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        resizeCanvas();
        initParticles();
    }, 250);
});

// ============================================
// INITIALIZE ON DOM READY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Trigger initial scroll check
    updateActiveNav();
    
    // Add loaded class to body for initial animations
    document.body.classList.add('loaded');
});
