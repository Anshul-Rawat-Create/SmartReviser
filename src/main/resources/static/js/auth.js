/**
 * Smart Reviser - Authentication JavaScript
 * Handles login, registration, and token management
 * Contract: SmartReviser2.pdf - Member 1 Frontend Files
 */

// API Base URL
const API_BASE_URL = "http://localhost:8080/api";

// DOM Elements
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
      errorMessage.style.display = "none";
    }, 5000);
  }
}

/**
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccess(message) {
  if (successMessage) {
    successMessage.textContent = message;
    successMessage.style.display = "block";
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 3000);
  }
}

/**
 * Hide all messages
 */
function hideMessages() {
  if (errorMessage) errorMessage.style.display = "none";
  if (successMessage) successMessage.style.display = "none";
}

/**
 * Set loading state on button
 * @param {HTMLButtonElement} button - Button element
 * @param {boolean} isLoading - Loading state
 */
function setLoadingState(button, isLoading) {
  if (isLoading) {
    button.classList.add("loading");
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = '<span class="spinner"></span> Processing...';
    button.disabled = true;
  } else {
    button.classList.remove("loading");
    button.innerHTML = button.dataset.originalText || "Submit";
    button.disabled = false;
  }
}

/**
 * Login Form Handler
 * Contract: POST /api/auth/login
 */
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMessages();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');

    // Validation
    if (!email || !password) {
      showError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }

    try {
      setLoadingState(submitBtn, true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const token = await response.text();

        // Store token in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);

        showSuccess("Login successful! Redirecting...");

        // Redirect to dashboard after 1 second
        setTimeout(() => {
          window.location.href = "/html/dashboard.html";
        }, 1000);
      } else {
        let errorMsg = "Invalid credentials";

        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          // If response is not JSON, use status text
          if (response.status === 404) {
            errorMsg = "User not found";
          } else if (response.status === 401) {
            errorMsg = "Incorrect password";
          }
        }

        showError(errorMsg);
      }
    } catch (error) {
      console.error("Login error:", error);
      showError("Network error. Please check your connection and try again.");
    } finally {
      setLoadingState(submitBtn, false);
    }
  });
}

/**
 * Register Form Handler
 * Contract: POST /api/auth/register
 */
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMessages();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const submitBtn = registerForm.querySelector('button[type="submit"]');

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      showError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      showError("Passwords do not match");
      return;
    }

    try {
      setLoadingState(submitBtn, true);

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const userData = await response.json();

        showSuccess(
          `Account created successfully! Welcome, ${userData.username}`,
        );

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          window.location.href = "/html/login.html";
        }, 2000);
      } else {
        let errorMsg = "Registration failed";

        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          if (response.status === 409) {
            errorMsg = "Email or username already exists";
          }
        }

        showError(errorMsg);
      }
    } catch (error) {
      console.error("Registration error:", error);
      showError("Network error. Please check your connection and try again.");
    } finally {
      setLoadingState(submitBtn, false);
    }
  });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if user is authenticated
 * @returns {boolean} - True if token exists
 */
function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

/**
 * Logout user
 */
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userId");
  window.location.href = "/html/login.html";
}

/**
 * Get authentication headers for API calls
 * @returns {Object} - Headers object with Authorization token
 */
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

/**
 * Get user email from storage
 * @returns {string|null} - User email or null
 */
function getUserEmail() {
  return localStorage.getItem("userEmail");
}

/**
 * Decode JWT token to get payload
 * @returns {Object|null} - Token payload or null
 */
function getTokenPayload() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (e) {
    console.error("Error decoding token:", e);
    return null;
  }
}

/**
 * Get user ID from token
 * @returns {number|null} - User ID or null
 */
function getUserId() {
  const payload = getTokenPayload();
  return payload ? payload.userId : null;
}

/**
 * Auto-redirect if already logged in
 * Only applies to login and register pages
 */
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;

  if (
    (currentPath.includes("login.html") ||
      currentPath.includes("register.html")) &&
    isAuthenticated()
  ) {
    // User is already logged in, redirect to dashboard
    window.location.href = "/html/dashboard.html";
  }

  // Protect dashboard and other authenticated pages
  if (
    currentPath.includes("dashboard.html") ||
    currentPath.includes("practice") ||
    currentPath.includes("daily_task") ||
    currentPath.includes("leaderboard") ||
    currentPath.includes("analytics")
  ) {
    if (!isAuthenticated()) {
      // User is not logged in, redirect to login
      window.location.href = "/html/login.html";
    }
  }
});

/**
 * Handle token expiration
 * Call this when API returns 401 Unauthorized
 */
function handleTokenExpiration() {
  localStorage.removeItem("token");
  showError("Your session has expired. Please login again.");
  setTimeout(() => {
    window.location.href = "/html/login.html";
  }, 2000);
}

// Export functions for use in other scripts
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    isAuthenticated,
    logout,
    getAuthHeaders,
    getUserId,
    getTokenPayload,
    handleTokenExpiration,
  };
}