document.addEventListener("DOMContentLoaded", () => {
    const authForm = document.getElementById("authForm");
    const errorMessage = document.getElementById("errorMessage");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const API_URL = "http://127.0.0.1:5000";
    const tokenKey = "authToken";

    function showError(message) {
        errorMessage.style.display = "block";
        errorMessage.textContent = message;
    }

    function showDashboard() {
        document.getElementById("authContainer").style.display = "none";
        document.getElementById("dashboardSection").style.display = "block";
        fetchEmployees();
    }

    authForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem(tokenKey, data.token);
                showDashboard();
            } else {
                showError(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            showError("Server error. Please try again later.");
        }
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem(tokenKey);
        location.reload();
    });

    if (localStorage.getItem(tokenKey)) {
        showDashboard();
    }
});
