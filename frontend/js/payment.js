var mobile = JSON.parse(localStorage.getItem("selectedMobile"));
var paymentBox = document.getElementById("paymentBox");

if (!mobile) {
    paymentBox.innerHTML = "<p>No mobile selected</p>";
} else {
    paymentBox.innerHTML = `
        <h3>${mobile.brand} ${mobile.model}</h3>
        <p>Price: ₹${mobile.price}</p>
        <input type="text" placeholder="Card Number"><br><br>
        <input type="text" placeholder="Expiry"><br><br>
        <input type="password" placeholder="CVV"><br><br>
        <button onclick="placeOrder()">Pay & Order</button>
    `;
}

function placeOrder() {
    const customer_email = localStorage.getItem('currentEmail') || '';
    if (!customer_email) {
        alert('Please login before placing an order');
        window.location.href = 'customer-login.html';
        return;
    }

    const payload = {
        customer_email,
        brand: mobile.brand,
        model: mobile.model,
        price: mobile.price,
        description: mobile.description || ''
    };

    fetch('http://127.0.0.1:5000/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message || 'Order placed');
        localStorage.removeItem('selectedMobile');
        window.location.href = 'orders.html';
    })
    .catch(err => {
        console.error(err);
        alert('Error placing order');
    });
}
