const API_BASE = 'https://ash-mobiles-backend.onrender.com/api/mobiles';

async function loadMobiles() {
    const list = document.getElementById("mobileList");
    list.innerHTML = "Loading...";
    try {
        const res = await fetch(API_BASE + '/');
        const mobiles = await res.json();

        list.innerHTML = "";
        if (!mobiles || mobiles.length === 0) {
            list.innerHTML = "<p>No mobiles added</p>";
            return;
        }

        mobiles.forEach((mobile) => {
            list.innerHTML += `
                <div class="card">
                    ${mobile.image ? `<img src="${mobile.image}" alt="${mobile.brand} ${mobile.model}" style="width:100%;height:200px;object-fit:cover;border-radius:6px;margin-bottom:12px;">` : ''}
                    <h3>${mobile.brand} ${mobile.model}</h3>
                    <p class="desc">${mobile.description || ''}</p>
                    <p>₹${mobile.price}</p>
                    <p>${mobile.condition || ''}</p>

                    <div style="margin-top:12px">
                        <button onclick="editMobile('${mobile.id}')">Edit</button>
                        <button onclick="deleteMobile('${mobile.id}')">Delete</button>
                    </div>
                </div>
            `;
        });
    } catch (err) {
        list.innerHTML = '<p>Error loading mobiles</p>';
        console.error(err);
    }
}

async function deleteMobile(id) {
    if (!confirm('Delete this mobile?')) return;
    try {
        const res = await fetch(API_BASE + '/' + id, { method: 'DELETE' });
        const data = await res.json();
        alert(data.message || 'Deleted');
        loadMobiles();
    } catch (err) {
        alert('Error deleting mobile');
        console.error(err);
    }
}

function editMobile(id) {
    // pass id via query param
    window.location.href = `edit-mobile.html?id=${id}`;
}

window.addEventListener('load', loadMobiles);
