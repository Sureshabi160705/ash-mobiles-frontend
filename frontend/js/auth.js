const API_BASE = 'http://127.0.0.1:5000/api/auth';

function showMsg(msg, isError = true) {
    const el = document.getElementById('msg');
    if (!el) return;
    el.textContent = msg;
    el.style.color = isError ? 'crimson' : 'green';
}

async function registerCustomer() {
    const name = document.getElementById('name') && document.getElementById('name').value.trim();
    const email = document.getElementById('email') && document.getElementById('email').value.trim();
    const password = document.getElementById('password') && document.getElementById('password').value;
    if (!name || !email || !password) {
        showMsg('Please fill all fields');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role: 'customer' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        showMsg(data.message || 'Registered', false);
        setTimeout(() => window.location.href = 'customer-login.html', 800);
    } catch (err) {
        showMsg(err.message || 'Registration error');
    }
}

async function registerOwner() {
    const shop = document.getElementById('shop_name') && document.getElementById('shop_name').value.trim();
    const email = document.getElementById('email') && document.getElementById('email').value.trim();
    const password = document.getElementById('password') && document.getElementById('password').value;
    const gst = document.getElementById('gst') && document.getElementById('gst').value.trim();
    if (!shop || !email || !password) {
        showMsg('Please fill all fields');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: shop, email, password, gst, role: 'owner' })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        showMsg(data.message || 'Owner registered', false);
        setTimeout(() => window.location.href = 'owner-login.html', 800);
    } catch (err) {
        showMsg(err.message || 'Registration error');
    }
}

async function loginCustomer() {
    const email = document.getElementById('email') && document.getElementById('email').value.trim();
    const password = document.getElementById('password') && document.getElementById('password').value;
    if (!email || !password) {
        showMsg('Please enter email and password');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        // save token+role
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || 'customer');
        localStorage.setItem('userName', data.name || 'User');
        if (data.email) {
            localStorage.setItem('currentEmail', data.email);
            // legacy key used across older pages
            localStorage.setItem('customer_email', data.email);
        }
        showMsg('Login successful', false);
        playSuccessAnimation('customer/dashboard.html');
    } catch (err) {
        showMsg(err.message || 'Login error');
    }
}

async function loginOwner() {
    const email = document.getElementById('owner_email') && document.getElementById('owner_email').value.trim();
    const password = document.getElementById('owner_password') && document.getElementById('owner_password').value;
    if (!email || !password) {
        showMsg('Please enter email and password');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role || 'owner');
        localStorage.setItem('userName', data.name || 'User');
        if (data.email) {
            localStorage.setItem('currentEmail', data.email);
            // legacy key used across older pages
            localStorage.setItem('customer_email', data.email);
        }
        showMsg('Login successful', false);
        playSuccessAnimation('owner/dashboard.html');
    } catch (err) {
        showMsg(err.message || 'Login error');
    }
}

// FORM SUBMISSION HANDLERS (with Enter key support)
function handleLoginSubmit(event) {
    event.preventDefault();
    loginCustomer();
}

function handleRegisterSubmit(event) {
    event.preventDefault();
    registerCustomer();
}

function handleOwnerLoginSubmit(event) {
    event.preventDefault();
    loginOwner();
}

function handleOwnerRegisterSubmit(event) {
    event.preventDefault();
    registerOwner();
}

// SUCCESS ANIMATION AFTER LOGIN
function playSuccessAnimation(redirectUrl) {
    const animContainer = document.getElementById('animationContainer');
    if (!animContainer) return setTimeout(() => window.location.href = redirectUrl, 400);
    
    animContainer.style.display = 'flex';
    animContainer.style.flexDirection = 'column';
    animContainer.style.gap = '20px';
    
    // Create a simple loading animation with checkmark
    const animContent = document.createElement('div');
    animContent.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
    `;
    
    // Load Lottie player
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@dotlottie/player@latest';
    document.head.appendChild(script);
    
    script.onload = () => {
        try {
            // Create dotlottie-player element
            const player = document.createElement('dotlottie-player');
            player.id = 'lottieAnimation';
            player.setAttribute('src', 'assets/animations/Ax2k12jKRd/manifest.json');
            player.setAttribute('background', 'transparent');
            player.setAttribute('speed', '1');
            player.setAttribute('autoplay', 'true');
            player.setAttribute('loop', 'false');
            player.style.width = '300px';
            player.style.height = '300px';
            
            animContent.innerHTML = '';
            animContent.appendChild(player);
            animContainer.innerHTML = '';
            animContainer.appendChild(animContent);
            
            // Add message
            const message = document.createElement('div');
            message.textContent = 'Login Successful!';
            message.style.cssText = 'font-size: 24px; color: #ff9800; font-weight: bold; text-align: center;';
            animContainer.appendChild(message);
        } catch (e) {
            console.error('Animation error:', e);
            // Fallback to simple checkmark
            animContent.innerHTML = `
                <div style="font-size: 80px; animation: scaleIn 0.6s ease-out;">✓</div>
                <div style="font-size: 24px; color: #ff9800; font-weight: bold;">Login Successful!</div>
            `;
            animContainer.innerHTML = '';
            animContainer.appendChild(animContent);
        }
        
        // Navigate after animation completes
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 3000);
    };
    
    script.onerror = () => {
        console.error('Failed to load Lottie');
        // Fallback to simple checkmark
        animContent.innerHTML = `
            <div style="font-size: 80px; animation: scaleIn 0.6s ease-out;">✓</div>
            <div style="font-size: 24px; color: #ff9800; font-weight: bold;">Login Successful!</div>
        `;
        animContainer.innerHTML = '';
        animContainer.appendChild(animContent);
        
        // Navigate after animation completes
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, 2000);
    };
}