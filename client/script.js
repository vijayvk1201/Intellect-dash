// Use the relative path to the API (since it's hosted as part of the same static web app)
const API_URL = "/api";  // Now pointing to the API endpoint of the Azure Static Web App

// Elements
const authForm = document.getElementById("authForm");
const signupForm = document.getElementById("signupForm");
const signupSection = document.getElementById("signupSection");
const authContainer = document.getElementById("authContainer");
const dashboardSection = document.getElementById("dashboardSection");
const employeeForm = document.getElementById("employeeForm");
const errorMessage = document.getElementById("errorMessage");
const passwordError = document.getElementById("passwordError");
const employeeTable = document.getElementById("employeeTable");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");

// Toggle to signup form
signupBtn.addEventListener("click", () => {
    authContainer.style.display = "none";
    signupSection.style.display = "block";
});

// Toggle back to login form
document.getElementById("changePassword").addEventListener("click", () => {
    signupSection.style.display = "none";
    authContainer.style.display = "block";
});

// Login Functionality
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        localStorage.setItem("token", data.token);  // Store the token in localStorage
        authContainer.style.display = "none";
        dashboardSection.style.display = "block";
        fetchEmployeeData();
    } else {
        errorMessage.textContent = data.message;
        errorMessage.style.display = "block";
    }
});

// Signup Functionality
signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        passwordError.style.display = "block";
        return;
    }

    const response = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
        alert("Signup successful! Please log in.");
        signupSection.style.display = "none";
        authContainer.style.display = "block";
    } else {
        alert(data.message);
    }
});

// Employee Form Submission (to add an employee)
employeeForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("Please log in first.");
        return;
    }

    const employeeData = {
        employee_name: document.getElementById("employeeName").value,
        company_name: document.getElementById("companyName").value,
        job_title: document.getElementById("jobTitle").value,
        status: document.getElementById("status").value,
        salary: document.getElementById("salary").value,
        joining_date: document.getElementById("joiningDate").value,
        leaving_date: document.getElementById("leavingDate").value,
    };

    const response = await fetch(`${API_URL}/add_employee`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,  // Include JWT in request header
        },
        body: JSON.stringify(employeeData),
    });

    const data = await response.json();
    if (response.ok) {
        alert("Employee added successfully!");
        fetchEmployeeData();  // Refresh employee data
    } else {
        alert(data.message);
    }
});

// Fetch employee data from backend
async function fetchEmployeeData() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/get_employees`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (response.ok) {
        const employees = data.employees;
        const rows = employees.map(employee => {
            return `
                <tr>
                    <td>${employee.employee_name}</td>
                    <td>${employee.company_name}</td>
                    <td>${employee.job_title}</td>
                    <td>${employee.status}</td>
                    <td>${employee.salary}</td>
                    <td>${employee.joining_date}</td>
                    <td>${employee.leaving_date}</td>
                </tr>
            `;
        }).join('');
        employeeTable.innerHTML = rows;
    }
}

// Logout functionality
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    dashboardSection.style.display = "none";
    authContainer.style.display = "block";
});
