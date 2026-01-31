// Base URL for API requests
const API_URL = "http://localhost:3000/api";

// DOM elements
const authContainer = document.getElementById("auth-container");
const inventoryContainer = document.getElementById("inventory-container");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const showRegisterLink = document.getElementById("show-register");
const showLoginLink = document.getElementById("show-login");
const userInfo = document.getElementById("user-info");
const logoutBtn = document.getElementById("logout-btn");

// Check if user is logged in
function checkAuth() {
  const token = localStorage.getItem("token");

  if (token) {
    // Fetch user info
    fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        "x-auth-token": token,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Authentication failed");
        }
        return response.json();
      })
      .then((user) => {
        // Show user info
        if (userInfo) {
          userInfo.innerHTML = `<p>Welcome, <span>${user.username}</span></p>`;
        }

        // Show inventory container, hide auth container
        if (authContainer) authContainer.style.display = "none";
        if (inventoryContainer) inventoryContainer.style.display = "block";

        // Load inventory items if function exists
        if (typeof loadItems === "function") {
          loadItems();
        }
      })
      .catch((error) => {
        console.error("Error checking authentication:", error);
        localStorage.removeItem("token");
        if (authContainer) authContainer.style.display = "block";
        if (inventoryContainer) inventoryContainer.style.display = "none";
      });
  } else {
    // Not logged in, show auth container
    if (authContainer) authContainer.style.display = "block";
    if (inventoryContainer) inventoryContainer.style.display = "none";
  }
}

// Register new user
function register(username, password) {
  fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.msg || "Registration failed");
        });
      }
      return response.json();
    })
    .then((data) => {
      // Save token
      localStorage.setItem("token", data.token);

      // Show success message
      alert("Registration successful! Redirecting to dashboard...");

      // Redirect to dashboard or main page
      window.location.href = "index.html"; // Change to your dashboard page

      // Clear form if it exists
      if (registerForm) registerForm.reset();
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Login user
function login(username, password) {
  fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          throw new Error(data.msg || "Login failed");
        });
      }
      return response.json();
    })
    .then((data) => {
      // Save token
      localStorage.setItem("token", data.token);

      // Show success message
      alert("Login successful! Redirecting to dashboard...");

      // Redirect to dashboard
      window.location.href = "index.html"; // Change to your dashboard page

      // Clear form if it exists
      if (loginForm) loginForm.reset();
    })
    .catch((error) => {
      alert(error.message);
    });
}

// Logout user
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Event Listeners (only add if elements exist)
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    login(username, password);
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    register(username, password);
  });
}

if (showRegisterLink) {
  showRegisterLink.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.style.display = "none";
    registerContainer.style.display = "block";
  });
}

if (showLoginLink) {
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    registerContainer.style.display = "none";
    loginContainer.style.display = "block";
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}
