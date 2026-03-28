/**
 * Smart Reviser - Submission JavaScript
 * Owner: Mohit Singh Khatri
 * Contract: SmartReviser2.pdf - Member 3 Frontend Files
 * API Endpoints: /api/evaluation/*
 */

// API Base URL
const API_BASE_URL = "http://localhost:8080/api";

// Current state
let currentQuestionId = null;
let currentQuestionIndex = 0;
let dailyQuestions = [];
let selectedAnswer = null;

// Check authentication on page load
document.addEventListener("DOMContentLoaded", () => {
  if (!isAuthenticated()) {
    window.location.href = "/html/login.html";
    return;
  }

  const currentPath = window.location.pathname;

  if (currentPath.includes("daily_task.html")) {
    loadDailyQuestions();
  } else if (currentPath.includes("submission.html")) {
    loadSubmissionQuestion();
  }
});

/**
 * Load daily questions for user
 * Contract: GET /api/evaluation/daily/{userId}
 */
async function loadDailyQuestions() {
  const userId = getUserId();
  if (!userId) {
    alert("User not authenticated");
    window.location.href = "/html/login.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/evaluation/daily/${userId}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      dailyQuestions = await response.json();
      displayDailyQuestions(dailyQuestions);
      updateProgress(0, dailyQuestions.length);
    } else {
      console.error("Failed to load daily questions");
    }
  } catch (error) {
    console.error("Error loading daily questions:", error);
  }
}

/**
 * Display daily questions
 * @param {Array} questions - Array of QuestionDTO
 */
function displayDailyQuestions(questions) {
  const questionsSection = document.getElementById("questionsSection");
  const completionMessage = document.getElementById("completionMessage");

  if (!questionsSection) return;

  if (questions.length === 0) {
    questionsSection.innerHTML =
      "<p>No daily questions available. Check back tomorrow!</p>";
    return;
  }

  questionsSection.innerHTML = questions
    .map(
      (q, index) => `
        <div class="question-card" id="question-${index}">
            <div class="question-header">
                <h3>Question ${index + 1}</h3>
                <div class="question-meta">
                    <span class="badge topic">${q.topic}</span>
                    <span class="badge difficulty ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                </div>
            </div>
            <div class="question-text">${q.questionText}</div>
            <div class="options-list">
                ${q.options
                  .map(
                    (opt, i) => `
                    <label class="option-item">
                        <input type="radio" name="question-${index}" value="${opt}" onchange="selectAnswer(${index}, '${opt}')">
                        <span class="option-text">${opt}</span>
                    </label>
                `,
                  )
                  .join("")}
            </div>
            <button class="btn-primary" onclick="submitDailyAnswer(${index}, ${q.id})">
                Submit Answer
            </button>
            <div class="result-message" id="result-${index}" style="display: none;"></div>
        </div>
    `,
    )
    .join("");
}

/**
 * Select answer for a question
 * @param {number} questionIndex - Question index
 * @param {string} answer - Selected answer
 */
function selectAnswer(questionIndex, answer) {
  selectedAnswer = answer;
}

/**
 * Submit answer for daily question
 * Contract: POST /api/evaluation/submit
 * Input: { questionId, answer, userId }
 * Output: EvaluationResultDTO { isCorrect, score, message }
 */
async function submitDailyAnswer(questionIndex, questionId) {
  const userId = getUserId();
  const answer = selectedAnswer;

  if (!answer) {
    alert("Please select an answer");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/evaluation/submit`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        questionId,
        answer,
        userId,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      displayResult(questionIndex, result);

      // Update progress
      const completed =
        document.querySelectorAll('.result-message[style*="display: block"]')
          .length + 1;
      updateProgress(completed, dailyQuestions.length);

      // Check if all completed
      if (completed === dailyQuestions.length) {
        showCompletionMessage();
      }
    } else {
      alert("Failed to submit answer");
    }
  } catch (error) {
    console.error("Error submitting answer:", error);
    alert("Network error. Please try again.");
  }
}

/**
 * Display result for a question
 * @param {number} questionIndex - Question index
 * @param {Object} result - EvaluationResultDTO
 */
function displayResult(questionIndex, result) {
  const resultDiv = document.getElementById(`result-${questionIndex}`);
  if (!resultDiv) return;

  resultDiv.style.display = "block";
  resultDiv.className = `result-message ${result.isCorrect ? "correct" : "incorrect"}`;
  resultDiv.innerHTML = `
        <div class="result-icon">${result.isCorrect ? "✅" : "❌"}</div>
        <div class="result-text">${result.message}</div>
        <div class="result-score">+${result.score} points</div>
    `;
}

/**
 * Update progress bar
 * @param {number} completed - Number of completed questions
 * @param {number} total - Total questions
 */
function updateProgress(completed, total) {
  const completedCount = document.getElementById("completedCount");
  const totalCount = document.getElementById("totalCount");
  const progressFill = document.getElementById("progressFill");

  if (completedCount) completedCount.textContent = completed;
  if (totalCount) totalCount.textContent = total;

  if (progressFill) {
    const percentage = (completed / total) * 100;
    progressFill.style.width = `${percentage}%`;
  }
}

/**
 * Show completion message
 */
function showCompletionMessage() {
  const completionMessage = document.getElementById("completionMessage");
  const questionsSection = document.getElementById("questionsSection");

  if (completionMessage) {
    completionMessage.style.display = "block";
  }

  if (questionsSection) {
    questionsSection.style.display = "none";
  }
}

/**
 * Load question for submission page
 */
async function loadSubmissionQuestion() {
  const urlParams = new URLSearchParams(window.location.search);
  currentQuestionId = urlParams.get("questionId");

  if (!currentQuestionId) {
    alert("No question selected");
    window.location.href = "/html/daily_task.html";
    return;
  }

  // Load question details (would need a GET /api/questions/{id} endpoint)
  // For now, this is a placeholder
  document.getElementById("questionNumber").textContent = currentQuestionId;
}

/**
 * Submit answer from submission page
 */
async function submitAnswer() {
  const userId = getUserId();
  const answer = selectedAnswer;

  if (!answer) {
    alert("Please select an answer");
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/evaluation/submit`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        questionId: currentQuestionId,
        answer,
        userId,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      displaySubmissionResult(result);
    } else {
      alert("Failed to submit answer");
    }
  } catch (error) {
    console.error("Error submitting answer:", error);
    alert("Network error. Please try again.");
  }
}

/**
 * Display result on submission page
 * @param {Object} result - EvaluationResultDTO
 */
function displaySubmissionResult(result) {
  const resultCard = document.getElementById("resultCard");
  const resultContent = document.getElementById("resultContent");

  if (resultCard) resultCard.style.display = "block";

  if (resultContent) {
    resultContent.innerHTML = `
            <div class="result-icon-large">${result.isCorrect ? "🎉" : "😔"}</div>
            <h3>${result.isCorrect ? "Correct!" : "Incorrect"}</h3>
            <p>${result.message}</p>
            <div class="score-display">+${result.score} points</div>
        `;
  }
}

/**
 * Go to next question
 */
function nextQuestion() {
  window.location.href = "/html/daily_task.html";
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
