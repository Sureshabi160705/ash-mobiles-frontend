function addMobile() {
    let mobiles = JSON.parse(localStorage.getItem("mobiles")) || [];

    let mobile = {
        id: Date.now(),
        brand: document.getElementById("brand").value,
        model: document.getElementById("model").value,
        price: document.getElementById("price").value,
        condition: document.getElementById("condition").value,
        description: document.getElementById("description").value
    };

    mobiles.push(mobile);
    localStorage.setItem("mobiles", JSON.stringify(mobiles));

    alert("Mobile added successfully");

    window.location.href = "dashboard.html";
}
