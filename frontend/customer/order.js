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

    orders.forEach((order) => {
      list.innerHTML += `
                <div class="card">
                    <h3>${order.brand} ${order.model}</h3>
                    <p class="desc">${order.description || ''}</p>
                    <p><strong>Price:</strong> ₹${order.price}</p>
                    <p><strong>Status:</strong> ${order.status}</p>
                </div>
            `;
    });
  } catch (error) {
    console.error("Orders fetch error:", error);
    list.innerHTML = "<p>Error loading orders</p>";
  }
});
