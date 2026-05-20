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
// RESUME BUILDER - MODAL FUNCTIONALITY
// ============================================
const createResumeBtn = document.getElementById('create-resume-btn');
const modalOverlay = document.getElementById('resume-modal-overlay');
const modalCloseBtn = document.getElementById('modal-close');
const prevStepBtn = document.getElementById('prev-step');
const nextStepBtn = document.getElementById('next-step');
const generateResumeBtn = document.getElementById('generate-resume');

let currentStep = 1;
const totalSteps = 4;

// Open Modal
if (createResumeBtn) {
    createResumeBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Close Modal
function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
}

if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

// Step Navigation
function updateStepUI() {
    // Update step indicators
    document.querySelectorAll('.form-steps .step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.add('completed');
        }
    });

    // Show/hide step content
    document.querySelectorAll('.form-step-content').forEach((content, index) => {
        content.classList.remove('active');
        if (index + 1 === currentStep) {
            content.classList.add('active');
        }
    });

    // Show/hide navigation buttons
    if (prevStepBtn) {
        prevStepBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
    }
    if (nextStepBtn) {
        nextStepBtn.style.display = currentStep === totalSteps ? 'none' : 'inline-flex';
    }
    if (generateResumeBtn) {
        generateResumeBtn.style.display = currentStep === totalSteps ? 'inline-flex' : 'none';
    }
}

if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepUI();
        }
    });
}

if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateStepUI();
        }
    });
}

// ============================================
// ADD ENTRY BUTTONS (Education, Experience, References)
// ============================================
let educationCount = 1;
let experienceCount = 1;
let referenceCount = 1;

const addEducationBtn = document.getElementById('add-education');
const addExperienceBtn = document.getElementById('add-experience');
const addReferenceBtn = document.getElementById('add-reference');

if (addEducationBtn) {
    addEducationBtn.addEventListener('click', () => {
        educationCount++;
        const container = document.getElementById('education-entries');
        const newEntry = document.createElement('div');
        newEntry.className = 'entry-card';
        newEntry.dataset.entry = 'education';
        newEntry.innerHTML = `
            <div class="entry-header">
                <span class="entry-label">Education #${educationCount}</span>
                <button type="button" class="remove-entry-btn" onclick="this.closest('.entry-card').remove()">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Degree / Program</label>
                    <input type="text" class="edu-degree" placeholder="e.g. Bachelor in Business Studies">
                </div>
                <div class="form-field">
                    <label>Institution</label>
                    <input type="text" class="edu-institution" placeholder="e.g. Shanker Dev Campus">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Location</label>
                    <input type="text" class="edu-location" placeholder="e.g. Kathmandu, Nepal">
                </div>
                <div class="form-field">
                    <label>Year / Status</label>
                    <input type="text" class="edu-year" placeholder="e.g. 2017 or Current">
                </div>
            </div>
        `;
        container.appendChild(newEntry);
    });
}

if (addExperienceBtn) {
    addExperienceBtn.addEventListener('click', () => {
        experienceCount++;
        const container = document.getElementById('experience-entries');
        const newEntry = document.createElement('div');
        newEntry.className = 'entry-card';
        newEntry.dataset.entry = 'experience';
        newEntry.innerHTML = `
            <div class="entry-header">
                <span class="entry-label">Experience #${experienceCount}</span>
                <button type="button" class="remove-entry-btn" onclick="this.closest('.entry-card').remove()">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Job Title</label>
                    <input type="text" class="exp-title" placeholder="e.g. Junior Assistant">
                </div>
                <div class="form-field">
                    <label>Company</label>
                    <input type="text" class="exp-company" placeholder="e.g. Sunrise Bank Limited">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Start Date</label>
                    <input type="text" class="exp-start" placeholder="e.g. April 2018">
                </div>
                <div class="form-field">
                    <label>End Date</label>
                    <input type="text" class="exp-end" placeholder="e.g. Present">
                </div>
            </div>
            <div class="form-row full">
                <div class="form-field">
                    <label>Key Responsibilities (one per line)</label>
                    <textarea class="exp-responsibilities" rows="4" placeholder="e.g.&#10;Core Banking Operations&#10;Credit Risk Management"></textarea>
                </div>
            </div>
        `;
        container.appendChild(newEntry);
    });
}

if (addReferenceBtn) {
    addReferenceBtn.addEventListener('click', () => {
        referenceCount++;
        const container = document.getElementById('reference-entries');
        const newEntry = document.createElement('div');
        newEntry.className = 'entry-card';
        newEntry.dataset.entry = 'reference';
        newEntry.innerHTML = `
            <div class="entry-header">
                <span class="entry-label">Reference #${referenceCount}</span>
                <button type="button" class="remove-entry-btn" onclick="this.closest('.entry-card').remove()">
                    <i class='bx bx-x'></i>
                </button>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Name</label>
                    <input type="text" class="ref-name" placeholder="e.g. Rameshwor Prasad Yadav">
                </div>
                <div class="form-field">
                    <label>Designation</label>
                    <input type="text" class="ref-designation" placeholder="e.g. Principal">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Organization</label>
                    <input type="text" class="ref-org" placeholder="e.g. Green Hills Academy">
                </div>
                <div class="form-field">
                    <label>Contact</label>
                    <input type="text" class="ref-contact" placeholder="e.g. 015106358">
                </div>
            </div>
        `;
        container.appendChild(newEntry);
    });
}

// ============================================
// GENERATE RESUME AS PDF
// ============================================
if (generateResumeBtn) {
    generateResumeBtn.addEventListener('click', () => {
        generateResumePDF();
    });
}

function collectFormData() {
    const data = {
        personal: {
            fullName: document.getElementById('rb-fullname')?.value || '',
            title: document.getElementById('rb-title')?.value || '',
            email: document.getElementById('rb-email')?.value || '',
            phone: document.getElementById('rb-phone')?.value || '',
            address: document.getElementById('rb-address')?.value || '',
            dob: document.getElementById('rb-dob')?.value || '',
            father: document.getElementById('rb-father')?.value || '',
            marital: document.getElementById('rb-marital')?.value || '',
            objective: document.getElementById('rb-objective')?.value || ''
        },
        education: [],
        experience: [],
        skills: {
            technical: document.getElementById('rb-technical-skills')?.value || '',
            soft: document.getElementById('rb-soft-skills')?.value || '',
            languages: document.getElementById('rb-languages')?.value || ''
        },
        references: []
    };

    // Collect education entries
    document.querySelectorAll('#education-entries .entry-card').forEach(card => {
        const edu = {
            degree: card.querySelector('.edu-degree')?.value || '',
            institution: card.querySelector('.edu-institution')?.value || '',
            location: card.querySelector('.edu-location')?.value || '',
            year: card.querySelector('.edu-year')?.value || ''
        };
        if (edu.degree || edu.institution) {
            data.education.push(edu);
        }
    });

    // Collect experience entries
    document.querySelectorAll('#experience-entries .entry-card').forEach(card => {
        const exp = {
            title: card.querySelector('.exp-title')?.value || '',
            company: card.querySelector('.exp-company')?.value || '',
            start: card.querySelector('.exp-start')?.value || '',
            end: card.querySelector('.exp-end')?.value || '',
            responsibilities: card.querySelector('.exp-responsibilities')?.value || ''
        };
        if (exp.title || exp.company) {
            data.experience.push(exp);
        }
    });

    // Collect reference entries
    document.querySelectorAll('#reference-entries .entry-card').forEach(card => {
        const ref = {
            name: card.querySelector('.ref-name')?.value || '',
            designation: card.querySelector('.ref-designation')?.value || '',
            org: card.querySelector('.ref-org')?.value || '',
            contact: card.querySelector('.ref-contact')?.value || ''
        };
        if (ref.name) {
            data.references.push(ref);
        }
    });

    return data;
}

function generateResumePDF() {
    const data = collectFormData();

    // Validate required fields
    if (!data.personal.fullName || !data.personal.title || !data.personal.email || !data.personal.phone) {
        showNotification('Please fill in all required personal information fields.');
        currentStep = 1;
        updateStepUI();
        return;
    }

    if (!data.personal.objective) {
        showNotification('Please add a career objective / summary.');
        currentStep = 1;
        updateStepUI();
        return;
    }

    // Build the resume HTML content
    const resumeHTML = buildResumeHTML(data);

    // Create a temporary container for the resume
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = resumeHTML;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    document.body.appendChild(tempDiv);

    // Generate PDF using html2pdf
    const element = tempDiv.querySelector('.resume-pdf-content');

    const opt = {
        margin: 0,
        filename: 'Resume Final.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    // Show loading notification
    showNotification('Generating your resume PDF...');

    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(tempDiv);
        showNotification('Resume Final.pdf downloaded successfully!');
        closeModal();
    }).catch((err) => {
        console.error('PDF generation error:', err);
        document.body.removeChild(tempDiv);
        showNotification('Error generating PDF. Please try again.');
    });
}

function buildResumeHTML(data) {
    // Format education section
    let educationHTML = '';
    data.education.forEach(edu => {
        educationHTML += `
            <div style="margin-bottom: 12px; padding-left: 15px; border-left: 3px solid #0ef;">
                <p style="margin: 0; font-weight: 600; font-size: 14px; color: #1a5276;">${edu.degree}</p>
                <p style="margin: 2px 0; font-size: 13px; color: #333;">${edu.institution}</p>
                ${edu.location ? `<p style="margin: 2px 0; font-size: 12px; color: #666;">${edu.location}</p>` : ''}
                ${edu.year ? `<p style="margin: 2px 0; font-size: 12px; color: #888; font-style: italic;">${edu.year}</p>` : ''}
            </div>
        `;
    });

    // Format experience section
    let experienceHTML = '';
    data.experience.forEach(exp => {
        const responsibilities = exp.responsibilities.split('\n').filter(r => r.trim());
        let respHTML = '';
        if (responsibilities.length > 0) {
            respHTML = '<ul style="margin: 8px 0 0 20px; padding: 0;">';
            responsibilities.forEach(r => {
                respHTML += `<li style="font-size: 12px; color: #444; margin-bottom: 4px; line-height: 1.5;">${r.trim()}</li>`;
            });
            respHTML += '</ul>';
        }
        experienceHTML += `
            <div style="margin-bottom: 15px; padding-left: 15px; border-left: 3px solid #a855f7;">
                <p style="margin: 0; font-weight: 600; font-size: 14px; color: #1a5276;">${exp.title}</p>
                <p style="margin: 2px 0; font-size: 13px; color: #333; font-weight: 500;">${exp.company}</p>
                <p style="margin: 2px 0; font-size: 12px; color: #888; font-style: italic;">${exp.start}${exp.end ? ' - ' + exp.end : ''}</p>
                ${respHTML}
            </div>
        `;
    });

    // Format skills
    const technicalSkills = data.skills.technical.split(',').map(s => s.trim()).filter(s => s);
    const softSkills = data.skills.soft.split(',').map(s => s.trim()).filter(s => s);
    const languages = data.skills.languages.split(',').map(s => s.trim()).filter(s => s);

    let skillsHTML = '';
    if (technicalSkills.length > 0) {
        skillsHTML += `<div style="margin-bottom: 10px;">
            <p style="font-weight: 600; font-size: 13px; color: #1a5276; margin-bottom: 5px;">Technical Skills</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${technicalSkills.map(s => `<span style="padding: 4px 12px; background: #e8f8f5; border: 1px solid #0ef; border-radius: 15px; font-size: 11px; color: #006064;">${s}</span>`).join('')}
            </div>
        </div>`;
    }
    if (softSkills.length > 0) {
        skillsHTML += `<div style="margin-bottom: 10px;">
            <p style="font-weight: 600; font-size: 13px; color: #1a5276; margin-bottom: 5px;">Soft Skills</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${softSkills.map(s => `<span style="padding: 4px 12px; background: #f4ecfb; border: 1px solid #a855f7; border-radius: 15px; font-size: 11px; color: #6b21a8;">${s}</span>`).join('')}
            </div>
        </div>`;
    }
    if (languages.length > 0) {
        skillsHTML += `<div style="margin-bottom: 10px;">
            <p style="font-weight: 600; font-size: 13px; color: #1a5276; margin-bottom: 5px;">Languages</p>
            <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                ${languages.map(s => `<span style="padding: 4px 12px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 15px; font-size: 11px; color: #92400e;">${s}</span>`).join('')}
            </div>
        </div>`;
    }

    // Format references
    let referencesHTML = '';
    if (data.references.length > 0) {
        data.references.forEach(ref => {
            referencesHTML += `
                <div style="display: inline-block; width: 48%; vertical-align: top; padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px; margin-right: 2%; margin-bottom: 10px;">
                    <p style="margin: 0; font-weight: 600; font-size: 13px; color: #1a5276;">${ref.name}</p>
                    ${ref.designation ? `<p style="margin: 2px 0; font-size: 12px; color: #555;">${ref.designation}</p>` : ''}
                    ${ref.org ? `<p style="margin: 2px 0; font-size: 12px; color: #666;">${ref.org}</p>` : ''}
                    ${ref.contact ? `<p style="margin: 2px 0; font-size: 11px; color: #888;">Contact: ${ref.contact}</p>` : ''}
                </div>
            `;
        });
    }

    // Personal details section
    let personalDetailsHTML = '';
    if (data.personal.father || data.personal.marital || data.personal.dob) {
        personalDetailsHTML = `
            <div style="margin-top: 20px;">
                <h2 style="font-size: 16px; color: #1a5276; border-bottom: 2px solid #0ef; padding-bottom: 5px; margin-bottom: 12px;">Personal Details</h2>
                <table style="width: 100%; font-size: 13px; color: #444;">
                    ${data.personal.father ? `<tr><td style="padding: 4px 0; font-weight: 500;">Father's Name:</td><td style="padding: 4px 0;">${data.personal.father}</td></tr>` : ''}
                    ${data.personal.dob ? `<tr><td style="padding: 4px 0; font-weight: 500;">Date of Birth:</td><td style="padding: 4px 0;">${data.personal.dob}</td></tr>` : ''}
                    ${data.personal.marital ? `<tr><td style="padding: 4px 0; font-weight: 500;">Marital Status:</td><td style="padding: 4px 0;">${data.personal.marital}</td></tr>` : ''}
                </table>
            </div>
        `;
    }

    return `
        <div class="resume-pdf-content" style="width: 210mm; min-height: 297mm; padding: 25mm 20mm; font-family: 'Segoe UI', 'Calibri', Arial, sans-serif; color: #333; background: #fff; box-sizing: border-box;">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #1a5276;">
                <h1 style="font-size: 28px; color: #1a5276; margin: 0 0 5px 0; text-transform: uppercase; letter-spacing: 2px;">${data.personal.fullName}</h1>
                <p style="font-size: 14px; color: #0ef; margin: 0 0 10px 0; font-weight: 500;">${data.personal.title}</p>
                <div style="font-size: 12px; color: #555; display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                    ${data.personal.email ? `<span>✉ ${data.personal.email}</span>` : ''}
                    ${data.personal.phone ? `<span>☎ ${data.personal.phone}</span>` : ''}
                    ${data.personal.address ? `<span>📍 ${data.personal.address}</span>` : ''}
                </div>
            </div>

            <!-- Career Objective -->
            <div style="margin-bottom: 20px;">
                <h2 style="font-size: 16px; color: #1a5276; border-bottom: 2px solid #0ef; padding-bottom: 5px; margin-bottom: 12px;">Career Objective</h2>
                <p style="font-size: 13px; color: #444; line-height: 1.7; padding: 10px 15px; background: #f8fffe; border-left: 3px solid #0ef; border-radius: 0 5px 5px 0;">${data.personal.objective}</p>
            </div>

            <!-- Education -->
            ${data.education.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <h2 style="font-size: 16px; color: #1a5276; border-bottom: 2px solid #0ef; padding-bottom: 5px; margin-bottom: 12px;">Education</h2>
                    ${educationHTML}
                </div>
            ` : ''}

            <!-- Experience -->
            ${data.experience.length > 0 ? `
                <div style="margin-bottom: 20px;">
                    <h2 style="font-size: 16px; color: #1a5276; border-bottom: 2px solid #a855f7; padding-bottom: 5px; margin-bottom: 12px;">Work Experience</h2>
                    ${experienceHTML}
                </div>
            ` : ''}

            <!-- Skills -->
            ${skillsHTML ? `
                <div style="margin-bottom: 20px;">
                    <h2 style="font-size: 16px; color: #1a5276; border-bottom: 2px solid #0ef; padding-bottom: 5px; margin-bottom: 12px;">Skills</h2>
                    ${skillsHTML}
                </div>
            ` : ''}

            <!-- Personal Details -->
            ${personalDetailsHTML}

            <!-- References -->
            ${data.references.length > 0 ? `
                <div style="margin-top: 20px;">
                    <h2 style="font-size: 16px; color: #1a5276; border-bottom: 2px solid #0ef; padding-bottom: 5px; margin-bottom: 12px;">References</h2>
                    ${referencesHTML}
                </div>
            ` : ''}
        </div>
    `;
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
