async function loadMobiles() {
    const res = await fetch("https://ash-mobiles-backend.onrender.com/api/mobiles/");
    const mobiles = await res.json();

    const list = document.getElementById("mobileList");
    list.innerHTML = "";

    if (!mobiles || mobiles.length === 0) {
        list.innerHTML = '<p>No mobiles available</p>';
        return;
    }

    mobiles.forEach(mobile => {
        list.innerHTML += `
            <div class="card">
                ${mobile.image ? `<img src="${mobile.image}" alt="${mobile.brand} ${mobile.model}" style="width:100%;height:200px;object-fit:cover;border-radius:6px;margin-bottom:12px;">` : ''}
                <h3>${mobile.brand} ${mobile.model}</h3>
                <p class="desc">${mobile.description || ''}</p>
                <p>Condition: ${mobile.condition || ''}</p>
                <p>₹${mobile.price}</p>
                <button onclick="buyMobile('${mobile.brand}', '${mobile.model}', ${mobile.price}, '${mobile.description || ''}')">Buy</button>
            </div>
        `;
    });
}

function buyMobile(brand, model, price, desc) {
    const email = localStorage.getItem('customer_email');
    if (!email) {
        alert('Please login first');
        window.location.href = '../customer-login.html';
        return;
    }

    fetch('https://ash-mobiles-backend.onrender.com/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            customer_email: email,
            brand,
            model,
            price,
            description: desc
        })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || 'Order placed');
        window.location.href = 'orders.html';
    })
    .catch(err => {
        console.error(err);
        alert('Error placing order');
    });
}

window.onload = loadMobiles;
