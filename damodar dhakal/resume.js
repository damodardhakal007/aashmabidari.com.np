// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    const loaderRing = preloader.querySelector('.loader-ring');
    const fullText = "Resume Builder";
    let index = 1; // Start typing after the initial "R"
    
    function typeEffect() {
        if (index < fullText.length) {
            if (index === 1 && loaderRing) {
                loaderRing.classList.add('fade-out');
            }
            preloaderText.textContent += fullText.charAt(index);
            index++;
            setTimeout(typeEffect, 70); // Typing speed
        } else {
            // Once finished typing, fade out the preloader
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 800);
        }
    }
    
    // Allow the loader ring to spin around "R" first, then start typing
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
// NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    
    const icon = type === 'success' ? 'bx-check-circle' : (type === 'error' ? 'bx-error-circle' : 'bx-info-circle');
    const color = type === 'success' ? '#00c853' : (type === 'error' ? '#e74c3c' : '#2196f3');
    
    notification.innerHTML = `
        <i class='bx ${icon}'></i>
        <span>${message}</span>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '30px',
        left: '50%',
        transform: 'translateX(-50%) translateY(100px)',
        background: `rgba(${type === 'success' ? '0, 200, 83' : (type === 'error' ? '231, 76, 60' : '33, 150, 243')}, 0.15)`,
        border: `1px solid rgba(${type === 'success' ? '0, 200, 83' : (type === 'error' ? '231, 76, 60' : '33, 150, 243')}, 0.4)`,
        color: color,
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

    setTimeout(() => {
        notification.style.transform = 'translateX(-50%) translateY(0)';
    }, 10);

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
// RESUME BUILDER - STATE MANAGEMENT
// ============================================
let resumeData = null;
let resumeHTMLContent = null;
let photoDataURL = null; // Stores the photo as base64 data URL

// Check if there's saved resume data in localStorage
function loadSavedResume() {
    const saved = localStorage.getItem('savedResumeData');
    if (saved) {
        resumeData = JSON.parse(saved);
        enableViewDownloadButtons();
    }
    const savedPhoto = localStorage.getItem('savedResumePhoto');
    if (savedPhoto) {
        photoDataURL = savedPhoto;
    }
}

function enableViewDownloadButtons() {
    const viewBtn = document.getElementById('view-resume-btn');
    const downloadBtn = document.getElementById('download-resume-btn');
    if (viewBtn) {
        viewBtn.disabled = false;
        viewBtn.classList.add('enabled');
    }
    if (downloadBtn) {
        downloadBtn.disabled = false;
        downloadBtn.classList.add('enabled');
    }
}

function disableViewDownloadButtons() {
    const viewBtn = document.getElementById('view-resume-btn');
    const downloadBtn = document.getElementById('download-resume-btn');
    if (viewBtn) {
        viewBtn.disabled = true;
        viewBtn.classList.remove('enabled');
    }
    if (downloadBtn) {
        downloadBtn.disabled = true;
        downloadBtn.classList.remove('enabled');
    }
}

// ============================================
// PHOTO UPLOAD HANDLING
// ============================================
const photoInput = document.getElementById('rb-photo');
const photoPreview = document.getElementById('photo-preview');
const photoUploadBtn = document.getElementById('photo-upload-btn');
const photoRemoveBtn = document.getElementById('photo-remove-btn');

if (photoUploadBtn && photoInput) {
    photoUploadBtn.addEventListener('click', () => {
        photoInput.click();
    });

    photoPreview.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                showNotification('Photo size must be less than 5MB.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                photoDataURL = event.target.result;
                photoPreview.innerHTML = `<img src="${photoDataURL}" alt="Profile Photo">`;
                photoPreview.classList.add('has-photo');
                photoRemoveBtn.style.display = 'inline-flex';
                localStorage.setItem('savedResumePhoto', photoDataURL);
            };
            reader.readAsDataURL(file);
        }
    });
}

if (photoRemoveBtn) {
    photoRemoveBtn.addEventListener('click', () => {
        photoDataURL = null;
        photoPreview.innerHTML = `<i class='bx bx-camera'></i><span>Click to upload photo</span>`;
        photoPreview.classList.remove('has-photo');
        photoRemoveBtn.style.display = 'none';
        photoInput.value = '';
        localStorage.removeItem('savedResumePhoto');
    });
}

// Load saved photo on page load
function loadSavedPhoto() {
    const savedPhoto = localStorage.getItem('savedResumePhoto');
    if (savedPhoto && photoPreview) {
        photoDataURL = savedPhoto;
        photoPreview.innerHTML = `<img src="${photoDataURL}" alt="Profile Photo">`;
        photoPreview.classList.add('has-photo');
        if (photoRemoveBtn) photoRemoveBtn.style.display = 'inline-flex';
    }
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
const viewResumeBtn = document.getElementById('view-resume-btn');
const downloadResumeBtn = document.getElementById('download-resume-btn');
const downloadPreviewBtn = document.getElementById('download-preview-btn');
const editResumeBtn = document.getElementById('edit-resume-btn');

let currentStep = 1;
const totalSteps = 4;

// Open Modal
if (createResumeBtn) {
    createResumeBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (resumeData) {
            populateFormFromData(resumeData);
        }
    });
}

// View Resume Button
if (viewResumeBtn) {
    viewResumeBtn.addEventListener('click', () => {
        if (resumeData) {
            showResumePreview();
        } else {
            showNotification('Please create a resume first.', 'error');
        }
    });
}

// Download Resume Button (hero section)
if (downloadResumeBtn) {
    downloadResumeBtn.addEventListener('click', () => {
        if (resumeData) {
            downloadResumePDF();
        } else {
            showNotification('Please create a resume first.', 'error');
        }
    });
}

// Download from preview section
if (downloadPreviewBtn) {
    downloadPreviewBtn.addEventListener('click', () => {
        downloadResumePDF();
    });
}

// Edit Resume Button (from preview)
if (editResumeBtn) {
    editResumeBtn.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        if (resumeData) {
            populateFormFromData(resumeData);
        }
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
    document.querySelectorAll('.form-steps .step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        } else if (index + 1 < currentStep) {
            step.classList.add('completed');
        }
    });

    document.querySelectorAll('.form-step-content').forEach((content, index) => {
        content.classList.remove('active');
        if (index + 1 === currentStep) {
            content.classList.add('active');
        }
    });

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
                    <input type="text" class="edu-degree" placeholder="e.g. Master of Business Administration">
                </div>
                <div class="form-field">
                    <label>Institution</label>
                    <input type="text" class="edu-institution" placeholder="e.g. Harvard Business School">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Location</label>
                    <input type="text" class="edu-location" placeholder="e.g. Boston, MA">
                </div>
                <div class="form-field">
                    <label>Year / Status</label>
                    <input type="text" class="edu-year" placeholder="e.g. 2020 or Current">
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
                    <input type="text" class="exp-title" placeholder="e.g. Project Manager">
                </div>
                <div class="form-field">
                    <label>Company</label>
                    <input type="text" class="exp-company" placeholder="e.g. Google Inc.">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Start Date</label>
                    <input type="text" class="exp-start" placeholder="e.g. March 2021">
                </div>
                <div class="form-field">
                    <label>End Date</label>
                    <input type="text" class="exp-end" placeholder="e.g. Present">
                </div>
            </div>
            <div class="form-row full">
                <div class="form-field">
                    <label>Key Responsibilities (one per line)</label>
                    <textarea class="exp-responsibilities" rows="4" placeholder="e.g.&#10;Led cross-functional teams&#10;Managed project budgets"></textarea>
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
                    <input type="text" class="ref-name" placeholder="e.g. Prof. Michael Johnson">
                </div>
                <div class="form-field">
                    <label>Designation</label>
                    <input type="text" class="ref-designation" placeholder="e.g. Director">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Organization</label>
                    <input type="text" class="ref-org" placeholder="e.g. XYZ Corporation">
                </div>
                <div class="form-field">
                    <label>Contact Number</label>
                    <input type="text" class="ref-contact" placeholder="e.g. +1-555-000-1234">
                </div>
            </div>
            <div class="form-row full">
                <div class="form-field">
                    <label>Email</label>
                    <input type="email" class="ref-email" placeholder="e.g. contact@example.com">
                </div>
            </div>
        `;
        container.appendChild(newEntry);
    });
}

// ============================================
// COLLECT FORM DATA
// ============================================
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
            religion: document.getElementById('rb-religion')?.value || '',
            citizen: document.getElementById('rb-citizen')?.value || '',
            careerStatement: document.getElementById('rb-career-statement')?.value || '',
            objective: document.getElementById('rb-objective')?.value || ''
        },
        education: [],
        experience: [],
        skills: document.getElementById('rb-skills')?.value || '',
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
            contact: card.querySelector('.ref-contact')?.value || '',
            email: card.querySelector('.ref-email')?.value || ''
        };
        if (ref.name) {
            data.references.push(ref);
        }
    });

    return data;
}

// ============================================
// POPULATE FORM FROM SAVED DATA
// ============================================
function populateFormFromData(data) {
    if (!data) return;

    // Personal info
    const fields = {
        'rb-fullname': data.personal.fullName,
        'rb-title': data.personal.title,
        'rb-email': data.personal.email,
        'rb-phone': data.personal.phone,
        'rb-address': data.personal.address,
        'rb-dob': data.personal.dob,
        'rb-father': data.personal.father,
        'rb-marital': data.personal.marital,
        'rb-religion': data.personal.religion || '',
        'rb-citizen': data.personal.citizen || '',
        'rb-career-statement': data.personal.careerStatement || '',
        'rb-objective': data.personal.objective,
        'rb-skills': data.skills || ''
    };

    for (const [id, value] of Object.entries(fields)) {
        const el = document.getElementById(id);
        if (el && value) {
            el.value = value;
        }
    }

    // Populate education entries
    const eduContainer = document.getElementById('education-entries');
    if (data.education.length > 0) {
        eduContainer.innerHTML = '';
        data.education.forEach((edu, index) => {
            const card = document.createElement('div');
            card.className = 'entry-card';
            card.dataset.entry = 'education';
            card.innerHTML = `
                <div class="entry-header">
                    <span class="entry-label">Education #${index + 1}</span>
                    ${index > 0 ? `<button type="button" class="remove-entry-btn" onclick="this.closest('.entry-card').remove()"><i class='bx bx-x'></i></button>` : ''}
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label>Degree / Program</label>
                        <input type="text" class="edu-degree" value="${edu.degree || ''}" placeholder="e.g. Bachelor of Science">
                    </div>
                    <div class="form-field">
                        <label>Institution</label>
                        <input type="text" class="edu-institution" value="${edu.institution || ''}" placeholder="e.g. MIT University">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label>Location</label>
                        <input type="text" class="edu-location" value="${edu.location || ''}" placeholder="e.g. Boston, MA">
                    </div>
                    <div class="form-field">
                        <label>Year / Status</label>
                        <input type="text" class="edu-year" value="${edu.year || ''}" placeholder="e.g. 2017 or Current">
                    </div>
                </div>
            `;
            eduContainer.appendChild(card);
        });
        educationCount = data.education.length;
    }

    // Populate experience entries
    const expContainer = document.getElementById('experience-entries');
    if (data.experience.length > 0) {
        expContainer.innerHTML = '';
        data.experience.forEach((exp, index) => {
            const card = document.createElement('div');
            card.className = 'entry-card';
            card.dataset.entry = 'experience';
            card.innerHTML = `
                <div class="entry-header">
                    <span class="entry-label">Experience #${index + 1}</span>
                    ${index > 0 ? `<button type="button" class="remove-entry-btn" onclick="this.closest('.entry-card').remove()"><i class='bx bx-x'></i></button>` : ''}
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label>Job Title</label>
                        <input type="text" class="exp-title" value="${exp.title || ''}" placeholder="e.g. Software Developer">
                    </div>
                    <div class="form-field">
                        <label>Company</label>
                        <input type="text" class="exp-company" value="${exp.company || ''}" placeholder="e.g. Tech Corp Inc.">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label>Start Date</label>
                        <input type="text" class="exp-start" value="${exp.start || ''}" placeholder="e.g. Jan 2020">
                    </div>
                    <div class="form-field">
                        <label>End Date</label>
                        <input type="text" class="exp-end" value="${exp.end || ''}" placeholder="e.g. Present">
                    </div>
                </div>
                <div class="form-row full">
                    <div class="form-field">
                        <label>Key Responsibilities (one per line)</label>
                        <textarea class="exp-responsibilities" rows="4" placeholder="e.g.&#10;Developed web applications">${exp.responsibilities || ''}</textarea>
                    </div>
                </div>
            `;
            expContainer.appendChild(card);
        });
        experienceCount = data.experience.length;
    }

    // Populate reference entries
    const refContainer = document.getElementById('reference-entries');
    if (data.references.length > 0) {
        refContainer.innerHTML = '';
        data.references.forEach((ref, index) => {
            const card = document.createElement('div');
            card.className = 'entry-card';
            card.dataset.entry = 'reference';
            card.innerHTML = `
                <div class="entry-header">
                    <span class="entry-label">Reference #${index + 1}</span>
                    ${index > 0 ? `<button type="button" class="remove-entry-btn" onclick="this.closest('.entry-card').remove()"><i class='bx bx-x'></i></button>` : ''}
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label>Name</label>
                        <input type="text" class="ref-name" value="${ref.name || ''}" placeholder="e.g. Dr. Jane Smith">
                    </div>
                    <div class="form-field">
                        <label>Designation</label>
                        <input type="text" class="ref-designation" value="${ref.designation || ''}" placeholder="e.g. Department Head">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-field">
                        <label>Organization</label>
                        <input type="text" class="ref-org" value="${ref.org || ''}" placeholder="e.g. ABC University">
                    </div>
                    <div class="form-field">
                        <label>Contact Number</label>
                        <input type="text" class="ref-contact" value="${ref.contact || ''}" placeholder="e.g. +1-555-987-6543">
                    </div>
                </div>
                <div class="form-row full">
                    <div class="form-field">
                        <label>Email</label>
                        <input type="email" class="ref-email" value="${ref.email || ''}" placeholder="e.g. contact@example.com">
                    </div>
                </div>
            `;
            refContainer.appendChild(card);
        });
        referenceCount = data.references.length;
    }

    // Load photo preview
    loadSavedPhoto();
}

// ============================================
// GENERATE RESUME
// ============================================
if (generateResumeBtn) {
    generateResumeBtn.addEventListener('click', () => {
        generateResume();
    });
}

function generateResume() {
    const data = collectFormData();

    // Validate required fields
    if (!data.personal.fullName || !data.personal.email || !data.personal.phone) {
        showNotification('Please fill in Full Name, Email, and Phone.', 'error');
        currentStep = 1;
        updateStepUI();
        return;
    }

    if (!data.personal.careerStatement) {
        showNotification('Please add a career statement.', 'error');
        currentStep = 1;
        updateStepUI();
        return;
    }

    // Save data
    resumeData = data;
    localStorage.setItem('savedResumeData', JSON.stringify(data));

    // Generate HTML
    resumeHTMLContent = buildResumeHTML(data);

    // Enable view and download buttons
    enableViewDownloadButtons();

    // Close modal
    closeModal();

    // Show preview
    showResumePreview();

    showNotification('Resume created successfully! You can now view and download it.', 'success');
}

// ============================================
// SHOW RESUME PREVIEW
// ============================================
function showResumePreview() {
    const previewSection = document.getElementById('resume-preview-section');
    const previewContainer = document.getElementById('resume-preview-container');

    if (!resumeData) return;

    // Generate HTML if not already done
    if (!resumeHTMLContent) {
        resumeHTMLContent = buildResumeHTML(resumeData);
    }

    previewContainer.innerHTML = resumeHTMLContent;
    previewSection.style.display = 'block';

    // Scroll to preview
    setTimeout(() => {
        previewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
}

// ============================================
// DOWNLOAD RESUME AS PDF
// ============================================
function downloadResumePDF() {
    if (!resumeData) {
        showNotification('No resume data found. Please create a resume first.', 'error');
        return;
    }

    const html = buildResumeHTML(resumeData);

    // Create a temporary container
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '0';
    document.body.appendChild(tempDiv);

    const element = tempDiv.querySelector('.resume-pdf-content');

    const opt = {
        margin: 0,
        filename: `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
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
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    showNotification('Generating your resume PDF...', 'info');

    html2pdf().set(opt).from(element).save().then(() => {
        document.body.removeChild(tempDiv);
        showNotification('Resume PDF downloaded successfully!', 'success');
    }).catch((err) => {
        console.error('PDF generation error:', err);
        document.body.removeChild(tempDiv);
        showNotification('Error generating PDF. Please try again.', 'error');
    });
}

// ============================================
// BUILD GREEN-THEMED CV HTML TEMPLATE
// ============================================
function buildResumeHTML(data) {
    const greenColor = '#2eb82e';
    const darkGreen = '#239023';
    
    // Photo section
    const photoHTML = photoDataURL 
        ? `<img src="${photoDataURL}" style="width: 130px; height: 150px; object-fit: cover; border: 3px solid ${greenColor}; display: block;">`
        : `<div style="width: 130px; height: 150px; background: #e0e0e0; border: 3px solid ${greenColor}; display: flex; align-items: center; justify-content: center; color: #999; font-size: 40px;">&#128100;</div>`;

    // Format DOB
    let dobFormatted = '';
    if (data.personal.dob) {
        dobFormatted = data.personal.dob;
    }

    // Personal Detail section
    let personalDetailHTML = '';
    const personalItems = [];
    if (data.personal.father) personalItems.push(`Fathers Name:.&nbsp; ${data.personal.father}`);
    if (data.personal.religion) personalItems.push(`Religion:. ${data.personal.religion}.`);
    if (data.personal.marital) personalItems.push(`Marital status:. ${data.personal.marital}.`);
    if (data.personal.citizen) personalItems.push(`Citizen number:.${data.personal.citizen}`);
    
    if (personalItems.length > 0) {
        personalDetailHTML = `
            <div style="margin-top: 20px;">
                <div style="background: ${greenColor}; color: #fff; padding: 6px 15px; font-weight: 700; font-size: 14px; margin-bottom: 12px; display: inline-block; border-left: 4px solid ${darkGreen};">Personal Detail</div>
                <div style="padding: 0 15px;">
                    ${personalItems.map(item => `<p style="margin: 4px 0; font-size: 13px; color: #333;">${item}</p>`).join('')}
                </div>
            </div>
        `;
    }

    // Personal Objective section
    let objectiveHTML = '';
    if (data.personal.objective) {
        objectiveHTML = `
            <div style="margin-top: 20px;">
                <div style="background: ${greenColor}; color: #fff; padding: 6px 15px; font-weight: 700; font-size: 14px; margin-bottom: 12px; display: inline-block; border-left: 4px solid ${darkGreen};">&nbsp;Personal objective</div>
                <p style="padding: 0 15px; font-size: 13px; color: #333; line-height: 1.7; margin: 0;">${data.personal.objective}</p>
            </div>
        `;
    }

    // Academic Qualifications
    let educationHTML = '';
    if (data.education.length > 0) {
        let eduItems = '';
        data.education.forEach(edu => {
            eduItems += `
                <div style="margin-bottom: 10px;">
                    <p style="margin: 0; font-size: 13px; color: #333;">&#9632;&nbsp;&nbsp;&nbsp;${edu.degree}</p>
                    <p style="margin: 2px 0 2px 16px; font-size: 13px; color: #333;">${edu.institution}</p>
                    ${edu.location ? `<p style="margin: 2px 0 2px 16px; font-size: 13px; color: #333;">${edu.location}</p>` : ''}
                    ${edu.year ? `<p style="margin: 2px 0 2px 16px; font-size: 13px; color: #333;">Current Level : ${edu.year}</p>` : ''}
                </div>
            `;
        });
        educationHTML = `
            <div style="margin-top: 20px;">
                <div style="background: ${greenColor}; color: #fff; padding: 6px 15px; font-weight: 700; font-size: 14px; margin-bottom: 12px; display: inline-block; border-left: 4px solid ${darkGreen};">&nbsp;Academic Qualifications</div>
                <div style="padding: 0 15px;">
                    ${eduItems}
                </div>
            </div>
        `;
    }

    // Experience
    let experienceHTML = '';
    if (data.experience.length > 0) {
        let expItems = '';
        data.experience.forEach((exp, index) => {
            const dateRange = `${exp.start}${exp.end ? ' to ' + exp.end : ''}`;
            const isCurrent = exp.end && exp.end.toLowerCase() === 'present';
            expItems += `
                <p style="margin: 6px 0; font-size: 13px; color: #333; ${isCurrent ? 'font-weight: 700;' : ''}">&#9632;&nbsp;&nbsp;&nbsp;${isCurrent ? '<strong>' : ''}${exp.title} at ${exp.company} from ${dateRange}${isCurrent ? '</strong>' : ''}</p>
            `;
        });
        experienceHTML = `
            <div style="margin-top: 20px;">
                <div style="background: ${greenColor}; color: #fff; padding: 6px 15px; font-weight: 700; font-size: 14px; margin-bottom: 12px; display: inline-block; border-left: 4px solid ${darkGreen};">Experience</div>
                <div style="padding: 0 15px;">
                    ${expItems}
                </div>
            </div>
        `;
    }

    // Skills
    let skillsHTML = '';
    if (data.skills && data.skills.trim()) {
        const skillLines = data.skills.split('\n').filter(s => s.trim());
        let skillItems = '';
        skillLines.forEach(skill => {
            skillItems += `<p style="margin: 5px 0; font-size: 13px; color: #333;">&#9632;&nbsp;&nbsp;&nbsp;${skill.trim()}</p>`;
        });
        skillsHTML = `
            <div style="margin-top: 20px;">
                <div style="background: ${greenColor}; color: #fff; padding: 6px 15px; font-weight: 700; font-size: 14px; margin-bottom: 12px; display: inline-block; border-left: 4px solid ${darkGreen};">&nbsp;Skills</div>
                <div style="padding: 0 15px;">
                    ${skillItems}
                </div>
            </div>
        `;
    }

    // References
    let referencesHTML = '';
    if (data.references.length > 0) {
        let refColumns = '<div style="display: flex; gap: 40px; padding: 0 15px; flex-wrap: wrap;">';
        data.references.forEach((ref, index) => {
            refColumns += `
                <div style="flex: 1; min-width: 220px;">
                    <p style="margin: 0 0 4px 0; font-size: 13px; color: #333;"><strong>${index + 1}. ${ref.name}</strong></p>
                    ${ref.contact ? `<p style="margin: 2px 0; font-size: 12px; color: #333;">&nbsp;Contact no: ${ref.contact}</p>` : ''}
                    ${ref.designation ? `<p style="margin: 2px 0; font-size: 12px; color: #333;">&nbsp;Designation:. ${ref.designation}</p>` : ''}
                    ${ref.org ? `<p style="margin: 2px 0; font-size: 12px; color: #333;">&nbsp;Organization:. ${ref.org}</p>` : ''}
                    ${ref.email ? `<p style="margin: 2px 0; font-size: 12px; color: #333;">&nbsp;Email:.${ref.email}</p>` : ''}
                </div>
            `;
        });
        refColumns += '</div>';
        referencesHTML = `
            <div style="margin-top: 20px;">
                <div style="background: ${greenColor}; color: #fff; padding: 6px 15px; font-weight: 700; font-size: 14px; margin-bottom: 12px; display: inline-block; border-left: 4px solid ${darkGreen};">&nbsp;References</div>
                ${refColumns}
            </div>
        `;
    }

    return `
        <div class="resume-pdf-content" style="width: 210mm; min-height: 297mm; padding: 0; font-family: 'Times New Roman', Times, serif; color: #333; background: #fff; box-sizing: border-box;">
            <!-- Green top border -->
            <div style="width: 100%; height: 6px; background: ${greenColor};"></div>
            
            <!-- Header Section with Photo and Contact -->
            <div style="padding: 25px 30px 20px; display: flex; align-items: flex-start; gap: 25px;">
                <!-- Photo -->
                <div style="flex-shrink: 0;">
                    ${photoHTML}
                </div>
                
                <!-- Name and Contact Details -->
                <div style="flex: 1;">
                    <!-- Contact info row -->
                    <div style="display: flex; justify-content: flex-end; gap: 20px; margin-bottom: 10px; flex-wrap: wrap;">
                        ${data.personal.phone ? `
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="width: 22px; height: 22px; background: ${greenColor}; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 12px;">&#9742;</span>
                            <span style="font-size: 12px; color: #333;">${data.personal.phone}</span>
                        </div>` : ''}
                        ${data.personal.address ? `
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="width: 22px; height: 22px; background: ${greenColor}; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 12px;">&#127968;</span>
                            <span style="font-size: 12px; color: #333; text-transform: uppercase;">${data.personal.address}</span>
                        </div>` : ''}
                    </div>
                    
                    <!-- Name -->
                    <h1 style="margin: 8px 0 12px; font-size: 28px; color: ${greenColor}; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">${data.personal.fullName}</h1>
                    
                    <!-- Second contact row -->
                    <div style="display: flex; justify-content: flex-end; gap: 20px; flex-wrap: wrap;">
                        ${dobFormatted ? `
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="width: 22px; height: 22px; background: ${greenColor}; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 11px;">&#128197;</span>
                            <span style="font-size: 12px; color: #333;">${dobFormatted}</span>
                        </div>` : ''}
                        ${data.personal.email ? `
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <span style="width: 22px; height: 22px; background: ${greenColor}; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: #fff; font-size: 11px;">&#9993;</span>
                            <span style="font-size: 12px; color: #333;">${data.personal.email}</span>
                        </div>` : ''}
                    </div>
                </div>
            </div>

            <!-- Green divider line -->
            <div style="width: 100%; height: 4px; background: ${greenColor}; margin-bottom: 5px;"></div>

            <!-- Body Content -->
            <div style="padding: 15px 30px 30px;">
                
                <!-- Career Statement -->
                <div>
                    <div style="background: ${greenColor}; color: #fff; padding: 6px 15px; font-weight: 700; font-size: 14px; margin-bottom: 12px; display: inline-block; border-left: 4px solid ${darkGreen};">Career statement</div>
                    <p style="padding: 0 15px; font-size: 13px; color: #333; line-height: 1.7; margin: 0;">${data.personal.careerStatement}</p>
                </div>

                <!-- Personal Detail -->
                ${personalDetailHTML}

                <!-- Personal Objective -->
                ${objectiveHTML}

                <!-- Academic Qualifications -->
                ${educationHTML}

                <!-- Experience -->
                ${experienceHTML}

                <!-- Skills -->
                ${skillsHTML}

                <!-- References -->
                ${referencesHTML}
            </div>
        </div>
    `;
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
    
    // Load saved resume data
    loadSavedResume();
    
    // Load saved photo
    loadSavedPhoto();
});
