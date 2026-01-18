var orders = JSON.parse(localStorage.getItem("orders")) || [];
var orderDiv = document.getElementById("orders");

if (orders.length === 0) {
    orderDiv.innerHTML = "<p>No orders found</p>";
}

orders.forEach(function(order, index) {
    orderDiv.innerHTML += `
        <p>
            <strong>${order.mobile}</strong> - ${order.status}
            <button onclick="updateStatus(${index})">Mark Delivered</button>
        </p>
    `;
});

function updateStatus(index) {
    orders[index].status = "Delivered";
    localStorage.setItem("orders", JSON.stringify(orders));
    location.reload();
}
