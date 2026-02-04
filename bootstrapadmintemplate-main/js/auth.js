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

// Add this to the userAPI object in auth.js
const userAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || data.message);
    return data;
  },

  login: async (credentials) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.msg || data.message);
    return data;
  },

  getMe: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    console.log("Getting user profile with token:", token); // Debug

    const response = await fetch(`${API_URL}/users/me`, {
      method: "GET",
      headers: {
        "x-auth-token": token,
      },
    });

    console.log("Get profile response status:", response.status); // Debug

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.msg);
    return data;
  },

  deleteAccount: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found. Please login again.");
    }

    console.log("Deleting account with token:", token); // Debug

    const response = await fetch(`${API_URL}/users/me`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    });

    console.log("Delete response status:", response.status); // Debug
    console.log(
      "Delete response headers:",
      response.headers.get("content-type"),
    ); // Debug

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      console.error("Non-JSON response:", text); // Debug
      throw new Error("Server returned an error. Please check the console.");
    }

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || data.msg);
    return data;
  },
};

// Book API functions (add these at the end of auth.js)
const bookAPI = {
  getAll: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/books`, {
      method: "GET",
      headers: {
        "x-auth-token": token,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  create: async (bookData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(bookData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  update: async (id, bookData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(bookData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  delete: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/books/${id}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
};

// Category API functions (add to auth.js)
const categoryAPI = {
  getAll: async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/categories`, {
      method: "GET",
      headers: {
        "x-auth-token": token,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  create: async (categoryData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  update: async (id, categoryData) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(categoryData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },

  delete: async (id) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  },
};

module.exports = auth;
