// Offers Configuration - Initialize with sample offers
const defaultOffers = [
    {
        id: 1,
        title: "Summer Sale",
        description: "Get up to 30% discount on all phones",
        discount: "30%",
        icon: "🌞"
    },
    {
        id: 2,
        title: "Free Shipping",
        description: "Free shipping on orders above ₹5000",
        discount: "FREE",
        icon: "🚚"
    },
    {
        id: 3,
        title: "Warranty Extension",
        description: "Extend warranty to 6 months for just ₹999",
        discount: "50%",
        icon: "🛡️"
    }
];

// Initialize offers in localStorage if not present
function initializeOffers() {
    if (!localStorage.getItem('storeOffers')) {
        localStorage.setItem('storeOffers', JSON.stringify(defaultOffers));
    }
}

// Get all offers
function getOffers() {
    initializeOffers();
    return JSON.parse(localStorage.getItem('storeOffers')) || defaultOffers;
}

// Add new offer
function addOffer(offer) {
    const offers = getOffers();
    offer.id = offers.length > 0 ? Math.max(...offers.map(o => o.id)) + 1 : 1;
    offers.push(offer);
    localStorage.setItem('storeOffers', JSON.stringify(offers));
    return offer;
}

// Update offer
function updateOffer(id, updatedOffer) {
    const offers = getOffers();
    const index = offers.findIndex(o => o.id === id);
    if (index !== -1) {
        offers[index] = { ...offers[index], ...updatedOffer };
        localStorage.setItem('storeOffers', JSON.stringify(offers));
        return offers[index];
    }
    return null;
}

// Delete offer
function deleteOffer(id) {
    const offers = getOffers();
    const filtered = offers.filter(o => o.id !== id);
    localStorage.setItem('storeOffers', JSON.stringify(filtered));
}

// Initialize on page load
initializeOffers();
