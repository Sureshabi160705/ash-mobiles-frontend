document.addEventListener("DOMContentLoaded", async function () {

    const list = document.getElementById("mobileList");
    if (!list) return;

    try {
        const res = await fetch("http://127.0.0.1:5000/api/mobiles/");
        const mobiles = await res.json();

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
                    <p><strong>Condition:</strong> ${mobile.condition}</p>
                    <p><strong>Price:</strong> ₹${mobile.price}</p>
                    <button onclick="placeOrder(
                        '${mobile.brand}',
                        '${mobile.model}',
                        ${mobile.price},
                        '${mobile.description || ''}',
                        '${mobile._id}'
                    )">Buy Now</button>
                </div>
            `;
        });

    } catch (err) {
        console.error(err);
        list.innerHTML = "<p>Error loading mobiles</p>";
    }
});


function placeOrder(brand, model, price, description, mobileId) {
    // Redirect to new order page with product details in URL
    const params = new URLSearchParams({
        brand,
        model,
        price,
        description,
        id: mobileId
    });
    window.location.href = `neworder.html?${params.toString()}`;
}
