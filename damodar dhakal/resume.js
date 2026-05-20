// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 1200);
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

        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
            this.x -= dx * 0.01;
            this.y -= dy * 0.01;
        }

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
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 20000));
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
                const opacity = (1 - dist / 120) * 0.12;
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
// CUSTOM CURSOR
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

    const hoverElements = document.querySelectorAll('a, button, .download-btn, .tag, .edu-card, .detail-item, .toolbar-btn');
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

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorFollower.style.opacity = '0.6';
    });
}

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

    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
            menuIcon.classList.remove('bx-x');
        });
    });

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
    if (window.scrollY > 100) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }

    if (scrollTopBtn) {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('active');
        } else {
            scrollTopBtn.classList.remove('active');
        }
    }
});

// ============================================
// SCROLL REVEAL FOR RESUME BLOCKS
// ============================================
const resumeBlocks = document.querySelectorAll('.resume-block');

const blockObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
            blockObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

resumeBlocks.forEach((block, index) => {
    block.style.transitionDelay = `${index * 0.1}s`;
    blockObserver.observe(block);
});

// ============================================
// WORD DOCUMENT GENERATION (DOCX)
// ============================================
const wordDownloadBtn = document.getElementById('word-download');

if (wordDownloadBtn) {
    wordDownloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        generateWordDocument();
    });
}

function generateWordDocument() {
    // Create a simple HTML-based .doc file (compatible with MS Word)
    const resumeHTML = `
<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset="utf-8">
<title>Damodar Dhakal - Resume</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
</w:WordDocument>
</xml>
<![endif]-->
<style>
    body { font-family: 'Calibri', sans-serif; font-size: 11pt; line-height: 1.6; color: #333; margin: 40px; }
    h1 { font-size: 24pt; color: #1a5276; text-align: center; margin-bottom: 5px; }
    h2 { font-size: 14pt; color: #1a5276; border-bottom: 2px solid #0ef; padding-bottom: 5px; margin-top: 20px; }
    h3 { font-size: 12pt; color: #333; margin-bottom: 3px; }
    .contact-info { text-align: center; color: #555; font-size: 10pt; margin-bottom: 15px; }
    .section { margin-bottom: 15px; }
    ul { margin: 5px 0; padding-left: 20px; }
    li { margin-bottom: 3px; }
    .company { color: #1a5276; font-weight: bold; }
    .date { color: #777; font-style: italic; font-size: 10pt; }
    table { width: 100%; border-collapse: collapse; }
    td { padding: 5px; vertical-align: top; }
    .ref-table td { border: 1px solid #ddd; padding: 8px; }
</style>
</head>
<body>
    <h1>DAMODAR DHAKAL</h1>
    <div class="contact-info">
        <p>Kavresthali-1, Kathmandu | Phone: 9849353443 | Email: damodardhakal007@gmail.com | DOB: 1994-06-14</p>
    </div>

    <div class="section">
        <h2>Career Statement</h2>
        <p>I am an Account professional seeking to gain practical knowledge in this field. I would like to utilize my knowledge and skill for the growth of the company. I am an enthusiast in accounts and currently working in a commercial Bank with extensive experience. I want to implement my knowledge and skill for the growth of the organization.</p>
    </div>

    <div class="section">
        <h2>Personal Details</h2>
        <table>
            <tr><td><strong>Father's Name:</strong> Shukdev Dhakal</td><td><strong>Religion:</strong> Hindu</td></tr>
            <tr><td><strong>Marital Status:</strong> Married</td><td><strong>Citizenship No.:</strong> 27-1033/96851</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Personal Objective</h2>
        <p>I am honest, hardworking and loyal and I want to utilize these characteristics for the betterment of the organization.</p>
    </div>

    <div class="section">
        <h2>Academic Qualifications</h2>
        <p><strong>Association of Chartered Certified Accountants (ACCA)</strong><br>
        National College of Accountancy, Battisputali, Gausala<br>
        <span class="date">Current Level: Skill Level</span></p>
        
        <p><strong>Institute of Chartered Accountant of India (ICAI)</strong><br>
        CAI, Putalisadak, Kathmandu<br>
        <span class="date">Current Level: IPCC</span></p>
        
        <p><strong>Bachelor in Business Studies (BBS)</strong><br>
        Shanker Dev Campus, Putalishadak, Kathmandu</p>
        
        <p><strong>+2 Science (Biology)</strong><br>
        Himalayan White House International College</p>
        
        <p><strong>SLC</strong><br>
        Green Hills Academy</p>
    </div>

    <div class="section">
        <h2>Experience</h2>
        <p><strong>Junior Assistant</strong> - <span class="company">Sunrise Bank Limited</span><br>
        <span class="date">April 2018 - Present</span></p>
        <ul>
            <li>Core Banking Operations using Finacle System</li>
            <li>Credit Risk Management & NPL Analysis</li>
            <li>Customer Account Management & Services</li>
            <li>Financial Reporting & Compliance</li>
            <li>CRR Management & Loan Processing</li>
        </ul>
        
        <p><strong>Right Share Management</strong> - <span class="company">Mega Bank Nepal Limited</span><br>
        <span class="date">September 2017 - October 2017</span></p>
        <ul>
            <li>Managed right share issuance processes</li>
            <li>Investor communication & documentation</li>
            <li>Share allotment coordination</li>
        </ul>
    </div>

    <div class="section">
        <h2>Skills</h2>
        <p><strong>Banking Skills:</strong> Core Banking (Finacle), Inventory Management (RIGO), Credit Risk Management, NPL Analysis, CRR Management, Loan Pricing</p>
        <p><strong>Technical Skills:</strong> HTML/CSS/JavaScript, Python Programming, Android Development, Website Development, AI & Prompt Engineering, Computer Hardware</p>
        <p><strong>Research Skills:</strong> Data Collection, Interpretation and Analysis, Financial Forecasting, Market Analysis</p>
        <p><strong>Soft Skills:</strong> Leadership, Interpersonal Communication, Team Management, Problem Solving</p>
    </div>

    <div class="section">
        <h2>References</h2>
        <table class="ref-table">
            <tr>
                <td>
                    <strong>Rameshwor Prasad Yadav</strong><br>
                    Designation: Principal<br>
                    Organization: Green Hills Academy<br>
                    Contact: 015106358<br>
                    Email: greenhills1@gmail.com
                </td>
                <td>
                    <strong>Sandip Babu Poudel</strong><br>
                    Designation: Head Mega Account<br>
                    Organization: Mega Bank Limited<br>
                    Contact: 9851145884<br>
                    Email: sandip.poudel@megabank.com.np
                </td>
            </tr>
        </table>
    </div>
</body>
</html>`;

    // Convert to blob and download as .doc
    const blob = new Blob(['\ufeff', resumeHTML], {
        type: 'application/msword'
    });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Damodar_Dhakal_Resume.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    // Show download notification
    showNotification('Word document downloaded successfully!');
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.innerHTML = `
        <i class='bx bx-check-circle'></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%) translateY(100px)',
        background: 'rgba(0, 200, 83, 0.15)',
        border: '1px solid rgba(0, 200, 83, 0.4)',
        color: '#00c853',
        padding: '15px 25px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '14px',
        fontFamily: "'Poppins', sans-serif",
        zIndex: '10000',
        backdropFilter: 'blur(10px)',
        transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 400);
    }, 3000);
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
// PERFORMANCE: REDUCE ANIMATIONS ON LOW-END DEVICES
// ============================================
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
    particles = particles.slice(0, 15);
}

if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('*').forEach(el => {
        el.style.animationDuration = '0.01s';
        el.style.transitionDuration = '0.01s';
    });
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
    
    // Trigger initial visibility check for blocks already in viewport
    setTimeout(() => {
        resumeBlocks.forEach(block => {
            const rect = block.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                block.classList.add('visible');
            }
        });
    }, 500);
});
