/**
 * Smart Reviser - Analytics JavaScript
 * Owner: Tushar Vashist
 * Contract: SmartReviser2.pdf - Member 4 Frontend Files
 * API Endpoints: /api/analytics/*
 */

// API Base URL
const API_BASE_URL = "http://localhost:8080/api";

// Check authentication on page load
document.addEventListener("DOMContentLoaded", () => {
  if (!isAuthenticated()) {
    window.location.href = "/html/login.html";
    return;
  }

  const currentPath = window.location.pathname;

  if (currentPath.includes("dashboard.html")) {
    loadDashboardData();
    loadLeaderboard();
    updateUserInfo();
  } else if (currentPath.includes("leaderboard.html")) {
    loadLeaderboard();
    updateUserInfo();
  }
});

/**
 * Load dashboard data
 * Contract: GET /api/analytics/progress/{userId}
 */
async function loadDashboardData() {
  const userId = getUserId();
  if (!userId) return;

  try {
    const response = await fetch(
      `${API_BASE_URL}/analytics/progress/${userId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );

    if (response.ok) {
      const progress = await response.json();
      updateProgressUI(progress);
    } else {
      console.error("Failed to load progress");
    }
  } catch (error) {
    console.error("Error loading progress:", error);
  }
}

/**
 * Update progress UI on dashboard
 * @param {Object} progress - UserProgressDTO
 */
function updateProgressUI(progress) {
  // Update accuracy
  const accuracyRate = document.getElementById("accuracyRate");
  if (accuracyRate) {
    accuracyRate.textContent = `${progress.accuracy}%`;
  }

  // Update weak topics count
  const weakTopicsCount = document.getElementById("weakTopicsCount");
  if (weakTopicsCount) {
    weakTopicsCount.textContent = progress.weakTopics.length;
  }

  // Update topic list
  const topicList = document.getElementById("topicList");
  if (topicList) {
    topicList.innerHTML = "";

    // Add strong topics
    progress.strongTopics.forEach((topic) => {
      const topicItem = createTopicItem(topic, "Strong");
      topicList.appendChild(topicItem);
    });

    // Add weak topics
    progress.weakTopics.forEach((topic) => {
      const topicItem = createTopicItem(topic, "Weak");
      topicList.appendChild(topicItem);
    });
  }

  // Update stats (placeholder values - would need more API endpoints)
  const totalQuestions = document.getElementById("totalQuestions");
  if (totalQuestions) {
    totalQuestions.textContent = Math.floor(Math.random() * 100) + 50;
  }

  const currentStreak = document.getElementById("currentStreak");
  if (currentStreak) {
    currentStreak.textContent = Math.floor(Math.random() * 30) + 1;
  }
}

/**
 * Create topic item element
 * @param {string} topicName - Topic name
 * @param {string} strength - 'Strong' or 'Weak'
 * @returns {HTMLElement} - Topic item element
 */
function createTopicItem(topicName, strength) {
  const div = document.createElement("div");
  div.className = "topic-item";

  const name = document.createElement("span");
  name.className = "topic-name";
  name.textContent = topicName;

  const badge = document.createElement("span");
  badge.className = `topic-strength ${strength.toLowerCase()}`;
  badge.textContent = strength;

  div.appendChild(name);
  div.appendChild(badge);

  return div;
}

/**
 * Load leaderboard
 * Contract: GET /api/analytics/leaderboard
 * Output: List<LeaderboardDTO> sorted by totalScore descending
 */
async function loadLeaderboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/leaderboard`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const leaderboard = await response.json();

      const currentPath = window.location.pathname;

      if (currentPath.includes("dashboard.html")) {
        updateLeaderboardUI(leaderboard.slice(0, 5)); // Top 5 on dashboard
      } else if (currentPath.includes("leaderboard.html")) {
        updateFullLeaderboardUI(leaderboard);
      }
    } else {
      console.error("Failed to load leaderboard");
    }
  } catch (error) {
    console.error("Error loading leaderboard:", error);
  }
}

/**
 * Update leaderboard UI on dashboard
 * @param {Array} leaderboard - Array of LeaderboardDTO
 */
function updateLeaderboardUI(leaderboard) {
  const leaderboardList = document.getElementById("leaderboardList");
  if (!leaderboardList) return;

  leaderboardList.innerHTML = leaderboard
    .map(
      (entry, index) => `
        <div class="leaderboard-item">
            <div class="rank ${getRankClass(index + 1)}">${index + 1}</div>
            <div class="user-info">
                <div class="user-name">${entry.username}</div>
                <div class="user-score">${entry.totalScore} points</div>
            </div>
            <div class="score">#${index + 1}</div>
        </div>
    `,
    )
    .join("");
}

/**
 * Update full leaderboard table
 * @param {Array} leaderboard - Array of LeaderboardDTO
 */
function updateFullLeaderboardUI(leaderboard) {
  const leaderboardTableBody = document.getElementById("leaderboardTableBody");
  if (!leaderboardTableBody) return;

  leaderboardTableBody.innerHTML = leaderboard
    .map(
      (entry, index) => `
        <tr>
            <td>
                <div class="rank ${getRankClass(index + 1)}">${index + 1}</div>
            </td>
            <td><strong>${entry.username}</strong></td>
            <td>${entry.totalScore}</td>
            <td>${getLevel(entry.totalScore)}</td>
        </tr>
    `,
    )
    .join("");

  // Update user's rank
  updateYourRank(leaderboard);
}

/**
 * Update user's rank display
 * @param {Array} leaderboard - Full leaderboard
 */
function updateYourRank(leaderboard) {
  const userId = getUserId();
  const token = localStorage.getItem("token");

  // Decode token to get username
  let currentUser = null;
  if (token) {
    try {
      const payload = token.split(".")[1];
      const decoded = atob(payload);
      currentUser = JSON.parse(decoded).username;
    } catch (e) {
      console.error("Error decoding token:", e);
    }
  }

  if (!currentUser) return;

  const userEntry = leaderboard.find((entry) => entry.username === currentUser);

  if (userEntry) {
    const yourRankNumber = document.getElementById("yourRankNumber");
    const yourScore = document.getElementById("yourScore");

    if (yourRankNumber) yourRankNumber.textContent = userEntry.rank;
    if (yourScore) yourScore.textContent = userEntry.totalScore;
  }
}

/**
 * Get rank CSS class
 * @param {number} rank - Rank number
 * @returns {string} - CSS class
 */
function getRankClass(rank) {
  if (rank === 1) return "gold";
  if (rank === 2) return "silver";
  if (rank === 3) return "bronze";
  return "";
}

/**
 * Get level based on score
 * @param {number} score - Total score
 * @returns {string} - Level name
 */
function getLevel(score) {
  if (score >= 1000) return "🏆 Master";
  if (score >= 500) return "⭐ Expert";
  if (score >= 200) return "📚 Advanced";
  if (score >= 50) return "📖 Intermediate";
  return "🌱 Beginner";
}

/**
 * Update user info in navbar
 */
function updateUserInfo() {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const payload = token.split(".")[1];
      const decoded = atob(payload);
      const data = JSON.parse(decoded);

      const userName = document.getElementById("userName");
      const userAvatar = document.getElementById("userAvatar");

      if (userName) userName.textContent = data.username || "User";
      if (userAvatar)
        userAvatar.textContent = (data.username || "U")[0].toUpperCase();
    } catch (e) {
      console.error("Error decoding token:", e);
    }
  }
}

// Helper functions from auth.js
function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    const data = JSON.parse(decoded);
    return data.userId;
  } catch (e) {
    return null;
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userId");
  window.location.href = "/html/login.html";
}
