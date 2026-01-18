const API_BASE = 'http://127.0.0.1:5000/api/mobiles';

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

const mobileId = getQueryParam('id');
if (!mobileId) {
    alert('No mobile id provided');
    window.location.href = 'manage-mobiles.html';
}

async function loadMobile() {
    try {
        const res = await fetch(`${API_BASE}/${mobileId}`);
        if (!res.ok) throw new Error('Not found');
        const mobile = await res.json();

        document.getElementById('brand').value = mobile.brand || '';
        document.getElementById('model').value = mobile.model || '';
        document.getElementById('price').value = mobile.price || '';
        document.getElementById('condition').value = mobile.condition || '';
        document.getElementById('description').value = mobile.description || '';
        document.getElementById('image').value = mobile.image || '';
        
        // show image preview if exists
        const preview = document.getElementById('preview');
        if (mobile.image) {
            preview.innerHTML = `<img src="${mobile.image}" alt="preview" style="max-width:100%;border-radius:6px;">`;
        }
    } catch (err) {
        alert('Mobile not found');
        window.location.href = 'manage-mobiles.html';
    }
}

async function updateMobile() {
    const payload = {
        brand: document.getElementById('brand').value,
        model: document.getElementById('model').value,
        price: document.getElementById('price').value,
        condition: document.getElementById('condition').value,
        description: document.getElementById('description').value,
        image: document.getElementById('image').value
    };

    try {
        const res = await fetch(`${API_BASE}/${mobileId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const data = await res.json();
        alert(data.message || 'Updated');
        window.location.href = 'manage-mobiles.html';
    } catch (err) {
        alert('Error updating mobile');
        console.error(err);
    }
}

window.addEventListener('load', loadMobile);
