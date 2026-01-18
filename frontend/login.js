function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://127.0.0.1:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(res => res.json())
    .then(data => {

        if (!data.token) {
            alert(data.message || "Login failed");
            return;
        }

        // ✅ SAVE ALL REQUIRED DATA
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        // 🔥 THIS WAS MISSING — ROOT CAUSE
        localStorage.setItem(
            "customer_email",
            email.trim().toLowerCase()
        );

        // ✅ REDIRECT
        window.location.href = "customer/dashboard.html";
    })
    .catch(err => {
        console.error(err);
        alert("Server error");
    });
}
