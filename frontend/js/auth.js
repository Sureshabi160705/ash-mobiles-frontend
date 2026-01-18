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
        setTimeout(() => window.location.href = 'customer/dashboard.html', 400);
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
        setTimeout(() => window.location.href = 'owner/dashboard.html', 400);
    } catch (err) {
        showMsg(err.message || 'Login error');
    }
}