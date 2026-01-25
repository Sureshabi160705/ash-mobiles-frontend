// Store Info Handler - Populate store details dynamically
document.addEventListener('DOMContentLoaded', function() {
    populateStoreInfo();
});

function populateStoreInfo() {
    // About Store Section
    const aboutSection = document.getElementById('aboutStoreDetails');
    if (aboutSection) {
        aboutSection.innerHTML = `
            <p><strong>Owner:</strong> ${STORE_INFO.ownerName}</p>
            <p><strong>Phone:</strong> <a href="tel:${STORE_INFO.ownerPhone}" class="store-link">${STORE_INFO.ownerPhone}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${STORE_INFO.ownerEmail}" class="store-link">${STORE_INFO.ownerEmail}</a></p>
            <p><strong>Address:</strong> ${STORE_INFO.shopAddress}</p>
        `;
    }

    // Shop Hours Section
    const weekdaysStatus = document.getElementById('weekdaysStatus');
    const saturdayStatus = document.getElementById('saturdayStatus');
    const sundayStatus = document.getElementById('sundayStatus');
    const hoursNote = document.getElementById('hoursNote');

    if (weekdaysStatus) weekdaysStatus.textContent = STORE_INFO.shopHours.weekdays;
    if (saturdayStatus) saturdayStatus.textContent = STORE_INFO.shopHours.saturday;
    if (sundayStatus) sundayStatus.textContent = STORE_INFO.shopHours.sunday;
    if (hoursNote) hoursNote.textContent = STORE_INFO.shopHours.note;

    // Store Map
    const mapIframe = document.getElementById('storeMap');
    if (mapIframe) {
        mapIframe.src = STORE_INFO.shopMapEmbed;
    }

    // Payment Details Section
    const paymentSection = document.getElementById('paymentDetails');
    if (paymentSection) {
        let upiHtml = '<div class="payment-item"><strong>Google Pay:</strong> ' + STORE_INFO.gpayNumber + '</div>';
        
        if (Array.isArray(STORE_INFO.upiIds)) {
            STORE_INFO.upiIds.forEach((upi, index) => {
                upiHtml += '<div class="payment-item"><strong>UPI ID ' + (index + 1) + ':</strong> <span style="font-family:monospace;">' + upi + '</span></div>';
            });
        }
        
        paymentSection.innerHTML = upiHtml;
    }

    // Courier Service Section
    const courierSection = document.getElementById('courierService');
    if (courierSection) {
        courierSection.textContent = STORE_INFO.courierService;
    }

    // Warranty Section
    const warrantySection = document.getElementById('warrantyDetails');
    if (warrantySection) {
        warrantySection.innerHTML = `
            <p><strong>${STORE_INFO.warranty}</strong></p>
            <p class="warranty-description">${STORE_INFO.warrantyDescription}</p>
        `;
    }
}

function openWhatsApp() {
    const phoneNumber = STORE_INFO.whatsapp.number;
    const message = encodeURIComponent(STORE_INFO.whatsapp.message);
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
}

function openInstagram() {
    window.open(STORE_INFO.instagram.url, '_blank');
}

function openWhatsAppGroup() {
    window.open(STORE_INFO.whatsappGroup.link, '_blank');
}
