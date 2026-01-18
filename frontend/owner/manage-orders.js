document.addEventListener("DOMContentLoaded", async () => {

    const list = document.getElementById("orderList");

    const res = await fetch("http://127.0.0.1:5000/api/orders/all");
    const orders = await res.json();

    list.innerHTML = "";

    // group orders by customer email
    const groups = {};
    orders.forEach(o => {
        const email = o.customer_email || 'unknown';
        if (!groups[email]) groups[email] = [];
        groups[email].push(o);
    });

    if (Object.keys(groups).length === 0) {
        list.innerHTML = '<p>No orders found</p>';
        return;
    }

    for (const [email, items] of Object.entries(groups)) {
        list.innerHTML += `
            <div class="orders-group">
                <div class="group-header">
                    <h3>Customer: ${email}</h3>
                    <small>${items.length} order(s)</small>
                </div>
                <div class="orders-list" id="group-${email}"></div>
            </div>
        `;

        const groupEl = document.getElementById(`group-${email}`);
        items.forEach(order => {
            const card = document.createElement('div');
            card.className = 'card order-card';
            card.innerHTML = `
                <h4>${order.brand} ${order.model}</h4>
                <p class="desc">${order.description || ''}</p>
                <p>Price: ₹${order.price}</p>
                <p>Status: <strong>${order.status}</strong></p>
                <div style="margin-top:12px;">
                    <select data-id="${order.id}">
                        <option disabled selected>Change Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                    <button onclick="deleteOrder('${order.id}')" style="margin-left:8px;padding:8px 12px;background:#d32f2f;color:#fff;border:none;border-radius:4px;cursor:pointer;">Delete</button>
                </div>
            `;
            groupEl.appendChild(card);
        });
    }

    // attach change handlers
    document.querySelectorAll('.order-card select').forEach(sel => {
        sel.addEventListener('change', function () {
            const id = this.dataset.id;
            const status = this.value;
            updateStatus(id, status);
        });
    });
});

function updateStatus(id, status) {
    fetch("http://127.0.0.1:5000/api/orders/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        location.reload();
    });
}

function deleteOrder(id) {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    fetch(`http://127.0.0.1:5000/api/orders/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        location.reload();
    })
    .catch(err => {
        console.error(err);
        alert('Error deleting order');
    });
}
