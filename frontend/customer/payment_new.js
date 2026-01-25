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
    if (orderSummary) {
        orderSummary.innerHTML = `
            <h3>Order Details</h3>
            <p><strong>${order.brand} ${order.model}</strong></p>
            <p>Name: ${order.fullName}</p>
            <p>Shipping to: ${order.address}, ${order.city}, ${order.state} - ${order.pincode}</p>
        `;
    }

    // Display payment amount
    const paymentAmount = document.getElementById('paymentAmount');
    if (paymentAmount) {
        paymentAmount.textContent = `₹${order.price}`;
    }

    // Setup file upload
    setupFileUpload();
});

function setupFileUpload() {
    const fileInput = document.getElementById('paymentScreenshot');
    const uploadBox = document.querySelector('.upload-box');

    if (!fileInput || !uploadBox) return;

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
        if (previewContainer) {
            previewContainer.innerHTML = `
                <div style="text-align: center; margin-top: 15px;">
                    <img src="${e.target.result}" alt="Payment Screenshot Preview">
                    <p style="color: #666; font-size: 12px; margin-top: 10px;">✓ Image selected</p>
                </div>
            `;
        }
        
        // Enable submit button
        const submitButton = document.getElementById('submitButton');
        if (submitButton) {
            submitButton.disabled = false;
        }
        
        // Store image data
        window.screenshotData = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Process payment - MAIN FUNCTION
function processPayment() {
    console.log('processPayment() called');

    const paymentMethodInput = document.querySelector('input[name="paymentMethod"]:checked');
    if (!paymentMethodInput) {
        alert('Please select a payment method');
        return;
    }

    const paymentMethod = paymentMethodInput.value;
    const order = window.orderData;

    if (!order) {
        alert('Order data missing. Please start over.');
        return;
    }

    console.log('Payment method:', paymentMethod);
    console.log('Starting payment flow...');

    // Hide payment method section and buttons
    const paymentMethodSection = document.getElementById('paymentMethodSection');
    if (paymentMethodSection) {
        paymentMethodSection.style.display = 'none';
        console.log('Payment method section hidden');
    }

    const payButton = document.getElementById('payButton');
    if (payButton) {
        payButton.style.display = 'none';
        console.log('Pay button hidden');
    }

    const cancelButton = document.getElementById('cancelButton');
    if (cancelButton) {
        cancelButton.style.display = 'none';
        console.log('Cancel button hidden');
    }

    // Show timer display
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) {
        timerDisplay.style.display = 'block';
        console.log('Timer display shown');
    } else {
        console.error('Timer display element not found!');
    }

    // Show QR section
    const qrSection = document.getElementById('qrSection');
    if (qrSection) {
        qrSection.style.display = 'block';
        console.log('QR section shown');
    } else {
        console.error('QR section element not found!');
    }

    // Show upload section
    const uploadSection = document.getElementById('uploadSection');
    if (uploadSection) {
        uploadSection.style.display = 'block';
        console.log('Upload section shown');
    } else {
        console.error('Upload section element not found!');
    }

    // Show submit section
    const submitSection = document.getElementById('submitSection');
    if (submitSection) {
        submitSection.style.display = 'block';
        console.log('Submit section shown');
    } else {
        console.error('Submit section element not found!');
    }

    // Store payment method
    window.paymentMethod = paymentMethod;

    // Start timer
    console.log('Starting timer for 299 seconds (4:59)');
    startTimer(299);
}

function startTimer(duration) {
    console.log('startTimer() called with duration:', duration);
    
    let remaining = duration;
    const timerValue = document.getElementById('timerValue');

    if (!timerValue) {
        console.error('timerValue element not found!');
        return;
    }

    // Set initial display
    timerValue.textContent = '4:59';
    timerValue.style.color = '#ff9800';

    const timerInterval = setInterval(() => {
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        timerValue.textContent = timeString;

        if (remaining <= 10) {
            timerValue.style.color = '#d32f2f';
        }

        remaining--;

        if (remaining < 0) {
            clearInterval(timerInterval);
            console.log('Timer expired');
            handleTimerExpired();
        }
    }, 1000);

    window.timerInterval = timerInterval;
}

function handleTimerExpired() {
    console.log('Timer expired');

    // Hide all payment sections
    const timerDisplay = document.getElementById('timerDisplay');
    if (timerDisplay) timerDisplay.style.display = 'none';

    const qrSection = document.getElementById('qrSection');
    if (qrSection) qrSection.style.display = 'none';

    const uploadSection = document.getElementById('uploadSection');
    if (uploadSection) uploadSection.style.display = 'none';

    const submitSection = document.getElementById('submitSection');
    if (submitSection) submitSection.style.display = 'none';
    
    alert('Payment time expired. Please start over.');
    goBack();
}

async function submitPayment() {
    console.log('submitPayment() called');

    const fileInput = document.getElementById('paymentScreenshot');
    const screenshotData = window.screenshotData;
    const order = window.orderData;
    const paymentMethod = window.paymentMethod;

    if (!fileInput.files[0] || !screenshotData) {
        alert('Please upload a screenshot');
        return;
    }

    console.log('Screenshot selected, preparing to submit...');

    // Disable submit button
    const submitButton = document.getElementById('submitButton');
    if (submitButton) {
        submitButton.disabled = true;
    }

    // Stop timer
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }

    try {
        // Hide payment sections
        const timerDisplay = document.getElementById('timerDisplay');
        if (timerDisplay) timerDisplay.style.display = 'none';

        const qrSection = document.getElementById('qrSection');
        if (qrSection) qrSection.style.display = 'none';

        const uploadSection = document.getElementById('uploadSection');
        if (uploadSection) uploadSection.style.display = 'none';

        const submitSection = document.getElementById('submitSection');
        if (submitSection) submitSection.style.display = 'none';

        // Show wait message
        const waitMessage = document.getElementById('waitMessage');
        if (waitMessage) {
            waitMessage.style.display = 'block';
            console.log('Wait message shown');
        }

        console.log('Sending order to backend...');

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
        console.log('Backend response:', response);

        if (!orderResponse.ok) {
            throw new Error(response.message || 'Order creation failed');
        }

        console.log('Order created successfully');

        // Clear sessionStorage
        sessionStorage.removeItem('orderData');

        // Redirect to orders page after 4 seconds
        console.log('Redirecting to orders page in 4 seconds...');
        setTimeout(() => {
            window.location.href = 'orders.html';
        }, 4000);

    } catch (error) {
        console.error('Payment error:', error);
        
        const waitMessage = document.getElementById('waitMessage');
        if (waitMessage) {
            waitMessage.style.display = 'none';
        }

        const submitSection = document.getElementById('submitSection');
        if (submitSection) {
            submitSection.style.display = 'block';
        }

        const submitButton = document.getElementById('submitButton');
        if (submitButton) {
            submitButton.disabled = false;
        }

        alert('Payment failed: ' + error.message);
    }
}

function goBack() {
    if (window.timerInterval) {
        clearInterval(window.timerInterval);
    }
    window.history.back();
}
