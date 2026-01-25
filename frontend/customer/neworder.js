// Get product details from URL parameters
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    
    const brand = params.get('brand');
    const model = params.get('model');
    const price = parseInt(params.get('price')) || 0;
    const description = params.get('description') || '';
    const mobileId = params.get('id');

    if (!brand || !model || price === 0) {
        alert('Product details missing. Please select a mobile again.');
        window.location.href = 'mobiles.html';
        return;
    }

    // Store product details
    window.productDetails = {
        brand,
        model,
        price,
        description,
        mobileId
    };

    // Display product summary
    document.getElementById('productInfo').textContent = `${brand} ${model} - ${description}`;
    document.getElementById('productPrice').textContent = `₹${price}`;
    document.getElementById('totalPrice').textContent = `₹${price}`;

    // Pre-fill email if available
    const savedEmail = localStorage.getItem('currentEmail');
    if (savedEmail) {
        document.getElementById('email').value = savedEmail;
    }

    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('fullName').value = userName;
    }
});

// Form submission
document.getElementById('orderForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous messages
    document.getElementById('formMessage').innerHTML = '';
    clearErrorMessages();

    // Validate form
    if (!validateForm()) {
        return;
    }

    // Collect form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim(),
        state: document.getElementById('state').value.trim(),
        pincode: document.getElementById('pincode').value.trim(),
        notes: document.getElementById('notes').value.trim()
    };

    // Store order data in sessionStorage for payment page
    sessionStorage.setItem('orderData', JSON.stringify({
        ...formData,
        ...window.productDetails
    }));

    // Redirect to payment page
    window.location.href = 'payment.html';
});

function validateForm() {
    let isValid = true;

    // Full Name
    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName || fullName.length < 2) {
        showError('fullNameError', 'Please enter a valid full name');
        isValid = false;
    }

    // Email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Phone
    const phone = document.getElementById('phone').value.trim();
    if (!phone || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
        showError('phoneError', 'Please enter a valid 10-digit mobile number');
        isValid = false;
    }

    // Address
    const address = document.getElementById('address').value.trim();
    if (!address || address.length < 5) {
        showError('addressError', 'Please enter a valid street address');
        isValid = false;
    }

    // City
    const city = document.getElementById('city').value.trim();
    if (!city || city.length < 2) {
        showError('cityError', 'Please enter your city');
        isValid = false;
    }

    // State
    const state = document.getElementById('state').value.trim();
    if (!state || state.length < 2) {
        showError('stateError', 'Please enter your state');
        isValid = false;
    }

    // Pincode
    const pincode = document.getElementById('pincode').value.trim();
    if (!pincode || pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
        showError('pincodeError', 'Please enter a valid 6-digit pincode');
        isValid = false;
    }

    return isValid;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearErrorMessages() {
    const errorElements = document.querySelectorAll('.error-msg');
    errorElements.forEach(el => el.textContent = '');
}
