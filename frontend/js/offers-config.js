// Offers API Configuration
const OFFERS_API_URL = 'https://ash-mobiles-backend.onrender.com/api/offers';

// Default offers for fallback
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

// Get all offers from database
async function getOffers() {
    try {
        const response = await fetch(OFFERS_API_URL + '/');
        if (!response.ok) throw new Error('Failed to fetch offers');
        const data = await response.json();
        return data.offers || defaultOffers;
    } catch (error) {
        console.error('Error fetching offers:', error);
        return defaultOffers;
    }
}

// Add new offer to database
async function addOffer(offer) {
    try {
        const response = await fetch(OFFERS_API_URL + '/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(offer)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to add offer: ${response.status}`);
        }
        const data = await response.json();
        return data.offer;
    } catch (error) {
        console.error('Error adding offer:', error);
        alert('Failed to add offer: ' + error.message);
        return null;
    }
}

// Update offer in database
async function updateOffer(id, updatedOffer) {
    try {
        const response = await fetch(`${OFFERS_API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedOffer)
        });
        if (!response.ok) throw new Error('Failed to update offer');
        const data = await response.json();
        return data.offer;
    } catch (error) {
        console.error('Error updating offer:', error);
        return null;
    }
}

// Delete offer from database
async function deleteOffer(id) {
    try {
        const response = await fetch(`${OFFERS_API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Failed to delete offer: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.error('Error deleting offer:', error);
        alert('Failed to delete offer: ' + error.message);
        return false;
    }
}

// Initialize offers (will fetch from database on first load)
async function initializeOffers() {
    return await getOffers();
}
