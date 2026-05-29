// Login Form Handler
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.querySelector('input[name="remember"]').checked;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Password validation (at least 6 characters)
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Store credentials locally (for demo purposes)
    if (rememberMe) {
        localStorage.setItem('userEmail', email);
        localStorage.setItem('rememberMe', true);
    } else {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('rememberMe');
    }
    
    // Simulate login process
    console.log('Login attempt:', {
        email: email,
        password: '***',
        rememberMe: rememberMe
    });
    
    // Show success message
    alert('Sign in successful! Welcome ' + email);
    
    // Clear form
    loginForm.reset();
    
    // Redirect to home after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});

// Load saved email if "Remember Me" was checked
window.addEventListener('load', function() {
    const savedEmail = localStorage.getItem('userEmail');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (savedEmail && rememberMe) {
        document.getElementById('email').value = savedEmail;
        document.querySelector('input[name="remember"]').checked = true;
    }
});

// Social Login Handlers
document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const platform = this.classList[1];
        
        if (platform === 'facebook') {
            console.log('Facebook login clicked');
            alert('Facebook login will redirect to Facebook OAuth');
            // window.location.href = 'https://www.facebook.com/';
        } else if (platform === 'instagram') {
            console.log('Instagram login clicked');
            alert('Instagram login will redirect to Instagram OAuth');
            // window.location.href = 'https://www.instagram.com/';
        } else if (platform === 'google') {
            console.log('Google login clicked');
            alert('Google login will redirect to Google OAuth');
            // window.location.href = 'https://accounts.google.com/';
        }
    });
});

// Forgot Password Handler
document.querySelector('.forgot-password').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Password reset link would be sent to your email');
});

// Real-time validation
document.getElementById('email').addEventListener('blur', function() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.value && !emailRegex.test(this.value)) {
        this.style.borderColor = '#ff6b6b';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});

document.getElementById('password').addEventListener('blur', function() {
    if (this.value && this.value.length < 6) {
        this.style.borderColor = '#ff6b6b';
    } else {
        this.style.borderColor = '#e0e0e0';
    }
});
