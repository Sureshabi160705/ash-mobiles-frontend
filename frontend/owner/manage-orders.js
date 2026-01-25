let allOrders = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadAllOrders();
});

async function loadAllOrders() {
    try {
        const res = await fetch("https://ash-mobiles-backend.onrender.com/api/orders/all");
        allOrders = await res.json();
        displayOrders(allOrders);
    } catch (error) {
        console.error("Error loading orders:", error);
        document.getElementById('orderList').innerHTML = '<tr><td colspan="7" class="no-data-message">Error loading orders</td></tr>';
    }
}

function displayOrders(orders) {
    const orderListEl = document.getElementById('orderList');
    
    if (!orders || orders.length === 0) {
        orderListEl.innerHTML = '<tr><td colspan="7" class="no-data-message">No orders found</td></tr>';
        return;
    }

    // Sort orders by order_id (newest first)
    const sortedOrders = [...orders].sort((a, b) => b.order_id - a.order_id);

    orderListEl.innerHTML = '';
    
    sortedOrders.forEach((order, index) => {
        const row = document.createElement('tr');
        
        // Format dates
        let createdDate = 'N/A';
        if (order.created_date) {
            const date = new Date(order.created_date);
            createdDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        // Determine status color
        let statusClass = 'status-pending';
        if (order.status === 'Confirmed') statusClass = 'status-confirmed';
        else if (order.status === 'Shipped') statusClass = 'status-shipped';
        else if (order.status === 'Delivered') statusClass = 'status-delivered';
        else if (order.status === 'Cancelled') statusClass = 'status-cancelled';

        // Determine payment color
        let paymentClass = 'payment-pending';
        if (order.payment_status === 'Completed') paymentClass = 'payment-completed';
        else if (order.payment_status === 'Failed') paymentClass = 'payment-failed';

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <a class="order-id-link" onclick="openOrderDetails(${order.order_id})" title="Order #${order.order_id}">
                    #${order.order_id}
                </a>
            </td>
            <td>
                <strong>${order.customer_name || 'N/A'}</strong><br>
                <small style="color: #999;">${order.customer_email || 'N/A'}</small>
            </td>
            <td>
                <strong>${order.brand} ${order.model}</strong><br>
                <small style="color: #999;">${order.description || 'N/A'}</small>
            </td>
            <td><strong>₹${order.price}</strong></td>
            <td><span class="status-badge ${statusClass}">${order.status || 'N/A'}</span></td>
            <td><span class="payment-badge ${paymentClass}">${order.payment_status || 'N/A'}</span></td>
        `;
        
        orderListEl.appendChild(row);
    });
}

function openOrderDetails(orderId) {
    const order = allOrders.find(o => o.order_id === orderId);
    if (!order) {
        alert('Order not found');
        return;
    }

    // Format dates
    let createdDate = 'N/A';
    if (order.created_date) {
        const date = new Date(order.created_date);
        createdDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    let paymentSubmittedDate = 'N/A';
    if (order.payment_screenshot_submitted) {
        const date = new Date(order.payment_screenshot_submitted);
        paymentSubmittedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    let screenshotHtml = '';
    if (order.payment_screenshot) {
        screenshotHtml = `
            <div class="payment-screenshot">
                <h3 style="margin: 0 0 10px 0;">📸 Payment Screenshot:</h3>
                <img src="${order.payment_screenshot}" alt="Payment Screenshot" onclick="viewImage('${order.payment_screenshot}')">
            </div>
        `;
    }

    const detailsHTML = `
        <div class="detail-section">
            <h3>📦 Order Information</h3>
            <div class="detail-row">
                <strong>Order ID:</strong>
                <span><strong style="color: #ff9800; font-size: 18px;">#${order.order_id}</strong></span>
            </div>
            <div class="detail-row">
                <strong>Order Date:</strong>
                <span>${createdDate}</span>
            </div>
            <div class="detail-row">
                <strong>Order Status:</strong>
                <span>
                    <span class="status-badge" style="background: ${order.status === 'Delivered' ? '#a5d6a7' : order.status === 'Shipped' ? '#bbdefb' : order.status === 'Cancelled' ? '#ffcdd2' : order.status === 'Confirmed' ? '#c8e6c9' : '#fff3e0'}; color: ${order.status === 'Delivered' ? '#1b5e20' : order.status === 'Shipped' ? '#1565c0' : order.status === 'Cancelled' ? '#c62828' : order.status === 'Confirmed' ? '#2e7d32' : '#e65100'};">
                        ${order.status || 'N/A'}
                    </span>
                </span>
            </div>
        </div>

        <div class="detail-section">
            <h3>👤 Customer Details</h3>
            <div class="detail-row">
                <strong>Name:</strong>
                <span>${order.customer_name || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <strong>Email:</strong>
                <span>${order.customer_email || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <strong>Phone:</strong>
                <span>${order.customer_phone || 'N/A'}</span>
            </div>
        </div>

        <div class="detail-section">
            <h3>📱 Product Details</h3>
            <div class="detail-row">
                <strong>Brand & Model:</strong>
                <span>${order.brand} ${order.model}</span>
            </div>
            <div class="detail-row">
                <strong>Description:</strong>
                <span>${order.description || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <strong>Price:</strong>
                <span><strong style="color: #ff9800;">₹${order.price}</strong></span>
            </div>
        </div>

        <div class="detail-section">
            <h3>🏠 Shipping Address</h3>
            <div class="detail-row">
                <strong>Address:</strong>
                <span>${order.shipping_address || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <strong>City:</strong>
                <span>${order.shipping_city || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <strong>State:</strong>
                <span>${order.shipping_state || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <strong>Pincode:</strong>
                <span>${order.shipping_pincode || 'N/A'}</span>
            </div>
            ${order.shipping_notes ? `
            <div class="detail-row">
                <strong>Notes:</strong>
                <span>${order.shipping_notes}</span>
            </div>
            ` : ''}
        </div>

        <div class="detail-section">
            <h3>💳 Payment Details</h3>
            <div class="detail-row">
                <strong>Method:</strong>
                <span>${order.payment_method ? order.payment_method.toUpperCase() : 'N/A'}</span>
            </div>
            <div class="detail-row">
                <strong>Payment Status:</strong>
                <span>
                    <span class="payment-badge" style="background: ${order.payment_status === 'Completed' ? '#4caf50' : order.payment_status === 'Pending Verification' ? '#ff9800' : '#f44336'}; color: white;">
                        ${order.payment_status || 'N/A'}
                    </span>
                </span>
            </div>
            <div class="detail-row">
                <strong>Screenshot Submitted:</strong>
                <span>${paymentSubmittedDate}</span>
            </div>
        </div>

        ${screenshotHtml}

        <div class="action-buttons">
            <select id="orderStatusSelect" style="flex: 1; min-width: 150px; padding: 10px; border: 2px solid #ff9800; border-radius: 4px; cursor: pointer; font-size: 13px; background: white;">
                <option disabled>Change Order Status</option>
                <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="Confirmed" ${order.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
            <select id="paymentStatusSelect" style="flex: 1; min-width: 150px; padding: 10px; border: 2px solid #2196f3; border-radius: 4px; cursor: pointer; font-size: 13px; background: white;">
                <option disabled>Change Payment Status</option>
                <option value="Pending Verification" ${order.payment_status === 'Pending Verification' ? 'selected' : ''}>Pending Verification</option>
                <option value="Completed" ${order.payment_status === 'Completed' ? 'selected' : ''}>Completed</option>
                <option value="Failed" ${order.payment_status === 'Failed' ? 'selected' : ''}>Failed</option>
            </select>
            <button onclick="deleteOrder(${order.order_id})" class="btn-delete">Delete Order</button>
        </div>
    `;

    document.getElementById('orderDetailsContent').innerHTML = detailsHTML;
    document.getElementById('orderModal').classList.add('active');

    // Attach event listeners
    document.getElementById('orderStatusSelect').addEventListener('change', function() {
        if (this.value) {
            updateOrderStatus(order.order_id, this.value);
        }
    });

    document.getElementById('paymentStatusSelect').addEventListener('change', function() {
        if (this.value) {
            updatePaymentStatus(order.order_id, this.value);
        }
    });
}

function updateOrderStatus(id, status) {
    fetch("https://ash-mobiles-backend.onrender.com/api/orders/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: String(id), status })
    })
    .then(res => res.json())
    .then(data => {
        alert('Order status updated successfully');
        loadAllOrders();
        // Refresh the modal
        const order = allOrders.find(o => o.order_id === id);
        if (order) {
            openOrderDetails(id);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Error updating order status');
    });
}

function updatePaymentStatus(id, status) {
    fetch("https://ash-mobiles-backend.onrender.com/api/orders/update-payment-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: String(id), payment_status: status })
    })
    .then(res => res.json())
    .then(data => {
        alert('Payment status updated successfully');
        loadAllOrders();
        // Refresh the modal
        const order = allOrders.find(o => o.order_id === id);
        if (order) {
            openOrderDetails(id);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Error updating payment status');
    });
}

function deleteOrder(id) {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
    
    fetch(`https://ash-mobiles-backend.onrender.com/api/orders/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
    })
    .then(res => res.json())
    .then(data => {
        alert('Order deleted successfully');
        loadAllOrders();
        document.getElementById('orderModal').classList.remove('active');
    })
    .catch(err => {
        console.error(err);
        alert('Error deleting order');
    });
}

function viewImage(imageSrc) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 8px;
        border: 3px solid #ff9800;
    `;
    
    modal.appendChild(img);
    modal.onclick = () => modal.remove();
    document.body.appendChild(modal);
}

function searchOrders() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm.trim()) {
        displayOrders(allOrders);
        return;
    }

    const filteredOrders = allOrders.filter(order => {
        return (
            (String(order.order_id).includes(searchTerm)) ||
            (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm)) ||
            (order.customer_email && order.customer_email.toLowerCase().includes(searchTerm)) ||
            (order.customer_phone && order.customer_phone.includes(searchTerm))
        );
    });

    displayOrders(filteredOrders);
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    displayOrders(allOrders);
}

// Allow search on Enter key
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchOrders();
        }
    });
});
