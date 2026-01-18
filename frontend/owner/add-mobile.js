function addMobile() {
    const mobile = {
        brand: document.getElementById("brand").value,
        model: document.getElementById("model").value,
        price: document.getElementById("price").value,
        condition: document.getElementById("condition").value,
        description: document.getElementById("description").value,
        image: document.getElementById("image").value
    };

    fetch("http://127.0.0.1:5000/api/mobiles/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(mobile)
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("msg").innerText = data.message;
        if (data.id) setTimeout(() => window.location.href = "manage-mobiles.html", 1000);
    })
    .catch(() => {
        document.getElementById("msg").innerText = "Error adding mobile";
    });
}
