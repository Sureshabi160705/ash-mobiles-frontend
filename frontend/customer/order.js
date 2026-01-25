document.addEventListener("DOMContentLoaded", async function () {
  const list = document.getElementById("orderList");
  if (!list) {
    console.error("orderList div not found");
    return;
  }

  const email = localStorage.getItem("customer_email");
  console.log("Fetching orders for:", email);

  if (!email) {
    list.innerHTML = "<p>Please login again</p>";
    return;
  }

  try {
    const res = await fetch(
      `http://127.0.0.1:5000/api/orders/my-orders/${email}`
    );

    const orders = await res.json();
    console.log("Orders from API:", orders);

    list.innerHTML = "";

    if (!orders || orders.length === 0) {
      list.innerHTML = "<p>No orders found</p>";
      return;
    }

    // Sort by order_id (newest first)
    orders.sort((a, b) => b.order_id - a.order_id);

    orders.forEach((order) => {
      // Format date
      let createdDate = 'N/A';
      if (order.created_date) {
        const date = new Date(order.created_date);
        createdDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
      }

      // Determine status color
      let statusColor = '#ff9800';
      if (order.status === 'Confirmed') statusColor = '#4caf50';
      else if (order.status === 'Shipped') statusColor = '#2196f3';
      else if (order.status === 'Delivered') statusColor = '#4caf50';
      else if (order.status === 'Cancelled') statusColor = '#f44336';

      // Determine payment status color
      let paymentColor = '#ff9800';
      if (order.payment_status === 'Completed') paymentColor = '#4caf50';
      else if (order.payment_status === 'Failed') paymentColor = '#f44336';

      list.innerHTML += `
                <div class="card" style="border-left: 4px solid ${statusColor};">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                        <div>
                            <h3 style="margin: 0 0 8px 0;">📱 ${order.brand} ${order.model}</h3>
                            <p style="margin: 0; color: #666; font-size: 13px;"><strong>Order #${order.order_id}</strong></p>
                        </div>
                        <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: 600; white-space: nowrap;">
                            ${order.status || 'Pending'}
                        </span>
                    </div>
                    <p class="desc" style="color: #666; margin: 8px 0;">${order.description || 'N/A'}</p>
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; margin: 10px 0;">
                        <p style="margin: 4px 0; font-size: 14px;"><strong>Price:</strong> <span style="color: #ff9800; font-weight: 600;">₹${order.price}</span></p>
                        <p style="margin: 4px 0; font-size: 14px;"><strong>Order Date:</strong> ${createdDate}</p>
                        <p style="margin: 4px 0; font-size: 14px;"><strong>Payment Status:</strong> <span style="background: ${paymentColor}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px; font-weight: 600;">${order.payment_status || 'N/A'}</span></p>
                    </div>
                </div>
            `;
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    list.innerHTML = "<p>Error loading orders</p>";
  }
});

