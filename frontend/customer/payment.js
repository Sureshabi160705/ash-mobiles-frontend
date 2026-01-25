// Load order data from sessionStorage
document.addEventListener('DOMContentLoaded', function() {
    const orderData = sessionStorage.getItem('orderData');
    
    if (!orderData) {
        alert('Order data not found. Please start over.');
        window.location.href = 'mobiles.html';
        return;
    }

    const order = JSON.parse(orderData);
    window.orderData = order;

    // Display order summary
    const orderSummary = document.getElementById('orderSummary');
    orderSummary.innerHTML = `
        <h3>Order Details</h3>
        <p><strong>${order.brand} ${order.model}</strong></p>
        <p>Name: ${order.fullName}</p>
        <p>Shipping to: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
    `;

    // Display payment amount
    document.getElementById('paymentAmount').textContent = `₹${order.price}`;

    // Setup file upload
    setupFileUpload();
});

function setupFileUpload() {
    const fileInput = document.getElementById('paymentScreenshot');
    const uploadBox = document.querySelector('.upload-box');

    fileInput.addEventListener('change', handleFileSelect);
    
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.style.backgroundColor = '#fffbf0';
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.style.backgroundColor = 'white';
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.style.backgroundColor = 'white';
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            handleFileSelect();
        }
    });
}

function handleFileSelect() {
    const fileInput = document.getElementById('paymentScreenshot');
    const file = fileInput.files[0];

    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        fileInput.value = '';
        return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        fileInput.value = '';
        return;
    }

    // Read file and display preview
    const reader = new FileReader();
    reader.onload = (e) => {
        const previewContainer = document.getElementById('previewContainer');
        previewContainer.innerHTML = `
            <div style="text-align: center; margin-top: 15px;">
                <img src="${e.target.result}" alt="Payment Screenshot Preview">
                <p style="color: #666; font-size: 12px; margin-top: 10px;">✓ Image selected</p>
            </div>
        `;
        
        // Enable submit button
        document.getElementById('submitButton').disabled = false;
        
        // Store image data
        window.screenshotData = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Process payment
async function processPayment() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const order = window.orderData;

    if (!order) {
        alert('Order data missing. Please start over.');
        return;
    }

    // Hide payment method and buttons
    document.getElementById('paymentMethodSection').style.display = 'none';
    document.getElementById('payButton').style.display = 'none';
    document.getElementById('cancelButton').style.display = 'none';

    // Show timer and QR/upload sections
    document.getElementById('timerDisplay').style.display = 'block';
    document.getElementById('qrSection').style.display = 'block';
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('submitSection').style.display = 'block';

    // Store payment method
    window.paymentMethod = paymentMethod;

    // Start timer (4:59 = 299 seconds)
    startTimer(299);
}

function startTimer(duration) {
    let remaining = duration;
    const timerDisplay = document.getElementById('timerValue');

    const timerInterval = setInterval(() => {
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (remaining <= 10) {
            timerDisplay.style.color = '#d32f2f';
        }

        remaining--;

        if (remaining < 0) {
            clearInterval(timerInterval);
            handleTimerExpired();
        }
    }, 1000);

    // Store interval ID for potential cleanup
    window.timerInterval = timerInterval;
}

function handleTimerExpired() {
    document.getElementById('timerDisplay').style.display = 'none';
    document.getElementById('qrSection').style.display = 'none';
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('submitSection').style.display = 'none';
    
    alert('Payment time expired. Please start over.');
    goBack();
}

async function submitPayment() {
    const fileInput = document.getElementById('paymentScreenshot');
    const screenshotData = window.screenshotData;
    const order = window.orderData;
    const paymentMethod = window.paymentMethod;

    if (!fileInput.files[0] || !screenshotData) {
        alert('Please upload a screenshot');
        return;
    }

    // Disable submit button
    document.getElementById('submitButton').disabled = true;

    // Stop timer
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }

    try {
        // Hide payment sections
        document.getElementById('timerDisplay').style.display = 'none';
        document.getElementById('qrSection').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('submitSection').style.display = 'none';

        // Show wait message
        document.getElementById('waitMessage').style.display = 'block';

        // Create order with payment screenshot
        const orderResponse = await fetch('https://ash-mobiles-backend.onrender.com/api/orders/place', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_email: order.email,
                customer_name: order.fullName,
                customer_phone: order.phone,
                shipping_address: order.address,
                shipping_city: order.city,
                shipping_state: order.state,
                shipping_pincode: order.pincode,
                shipping_notes: order.notes,
                brand: order.brand,
                model: order.model,
                price: order.price,
                description: order.description,
                payment_method: paymentMethod,
                payment_status: 'Pending Verification',
                payment_screenshot: screenshotData,
                status: 'Pending Verification'
            })
        });

        const response = await orderResponse.json();

        if (!orderResponse.ok) {
            throw new Error(response.message || 'Order creation failed');
        }

        // Clear sessionStorage
        sessionStorage.removeItem('orderData');

        // Redirect to orders page after 4 seconds
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 4000);

    } catch (error) {
        console.error('Payment error:', error);
        document.getElementById('waitMessage').style.display = 'none';
        document.getElementById('submitSection').style.display = 'block';
        document.getElementById('submitButton').disabled = false;
        alert('Payment failed: ' + error.message);
    }
}

function goBack() {
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }
    window.history.back();
}
