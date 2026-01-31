// API Configuration
const API_URL = "http://localhost:3000/api";

// Helper function for API calls
async function apiCall(endpoint, method = "GET", data = null) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  // Add token if exists (for authenticated requests)
  const token = localStorage.getItem("token");
  if (token) {
    options.headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Something went wrong");
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// User API functions
const userAPI = {
  register: (userData) => apiCall("/users/register", "POST", userData),
  login: (credentials) => apiCall("/users/login", "POST", credentials),
  getProfile: () => apiCall("/users/profile", "GET"),
  getAllUsers: () => apiCall("/users", "GET"),
};

// Categories API functions
const categoryAPI = {
  getAll: () => apiCall("/categories", "GET"),
  create: (categoryData) => apiCall("/categories", "POST", categoryData),
  update: (id, categoryData) =>
    apiCall(`/categories/${id}`, "PUT", categoryData),
  delete: (id) => apiCall(`/categories/${id}`, "DELETE"),
};

// Books API functions
const bookAPI = {
  getAll: () => apiCall("/books", "GET"),
  getById: (id) => apiCall(`/books/${id}`, "GET"),
  create: (bookData) => apiCall("/books", "POST", bookData),
  update: (id, bookData) => apiCall(`/books/${id}`, "PUT", bookData),
  delete: (id) => apiCall(`/books/${id}`, "DELETE"),
};
