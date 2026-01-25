function register() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("https://ash-mobiles-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("msg").innerText = data.message;
    })
    .catch(error => {
        document.getElementById("msg").innerText = "Error occurred";
    });
}
