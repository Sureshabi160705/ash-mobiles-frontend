var orders = JSON.parse(localStorage.getItem("orders")) || [];
var orderList = document.getElementById("orderList");

if (orders.length === 0) {
    orderList.innerHTML = "<p>No orders yet</p>";
}

orders.forEach(function(order) {
    orderList.innerHTML += `
        <p>
            <strong>${order.mobile}</strong><br>
            Price: ₹${order.price}<br>
            Status: ${order.status}
        </p><hr>
    `;
});
