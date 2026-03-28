/**
 * Smart Reviser - Questions JavaScript
 * Owner: Mohit Singh
 * Contract: SmartReviser2.pdf - Member 2 Frontend Files
 * API Endpoints: /api/questions/*
 */

// API Base URL
const API_BASE_URL = "http://localhost:8080/api";

// Check authentication on page load
document.addEventListener("DOMContentLoaded", () => {
  if (!isAuthenticated()) {
    window.location.href = "/html/login.html";
    return;
  }

  // Load questions if on practice or admin page
  const currentPath = window.location.pathname;
  if (currentPath.includes("practice_list.html")) {
    loadQuestions();
  } else if (currentPath.includes("admin_questions.html")) {
    loadQuestions();
  }
});

/**
 * Load all questions with optional filters
 * Contract: GET /api/questions/?topic=&difficulty=
 */
async function loadQuestions(topic = "", difficulty = "") {
  try {
    let url = `${API_BASE_URL}/questions/`;
    const params = new URLSearchParams();

    if (topic) params.append("topic", topic);
    if (difficulty) params.append("difficulty", difficulty);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      const questions = await response.json();
      displayQuestions(questions);
    } else {
      console.error("Failed to load questions");
    }
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

/**
 * Display questions in the grid
 * @param {Array} questions - Array of QuestionDTO
 */
function displayQuestions(questions) {
  const questionsGrid = document.getElementById("questionsGrid");
  const questionList = document.getElementById("questionList");

  if (!questionsGrid && !questionList) return;

  if (questions.length === 0) {
    if (questionsGrid) {
      questionsGrid.innerHTML =
        '<p class="no-questions">No questions found</p>';
    }
    return;
  }

  if (questionsGrid) {
    questionsGrid.innerHTML = questions
      .map(
        (q) => `
            <div class="question-card">
                <div class="question-header">
                    <span class="badge topic">${q.topic}</span>
                    <span class="badge difficulty ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                </div>
                <div class="question-text">${q.questionText}</div>
                <div class="question-options">
                    ${q.options
                      .map(
                        (opt, i) => `
                        <div class="option">
                            <span class="option-letter">${String.fromCharCode(65 + i)}</span>
                            <span class="option-text">${opt}</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
                <div class="question-footer">
                    <span class="language">${q.language}</span>
                    <button class="btn-outline" onclick="practiceQuestion(${q.id})">Practice</button>
                </div>
            </div>
        `,
      )
      .join("");
  }

  if (questionList) {
    questionList.innerHTML = questions
      .map(
        (q) => `
            <div class="question-item">
                <div class="question-info">
                    <div class="question-text-short">${q.questionText.substring(0, 100)}...</div>
                    <div class="question-meta">
                        <span class="badge topic">${q.topic}</span>
                        <span class="badge difficulty ${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                    </div>
                </div>
                <div class="question-actions">
                    <button class="btn-outline" onclick="editQuestion(${q.id})">Edit</button>
                    <button class="btn-danger" onclick="deleteQuestion(${q.id})">Delete</button>
                </div>
            </div>
        `,
      )
      .join("");
  }
}

/**
 * Filter questions by topic and difficulty
 */
function filterQuestions() {
  const topic = document.getElementById("filterTopic")?.value || "";
  const difficulty = document.getElementById("filterDifficulty")?.value || "";
  loadQuestions(topic, difficulty);
}

/**
 * Add new question (Admin only)
 * Contract: POST /api/questions/ (via QuestionService)
 */
if (document.getElementById("addQuestionForm")) {
  document
    .getElementById("addQuestionForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const questionText = document.getElementById("questionText").value;
      const topic = document.getElementById("topic").value;
      const difficulty = document.getElementById("difficulty").value;
      const language = document.getElementById("language").value;
      const correctAnswerIndex = document.getElementById("correctAnswer").value;

      // Get all options
      const optionInputs = document.querySelectorAll(".option-input");
      const options = Array.from(optionInputs).map((input) => input.value);

      if (options.length !== 4) {
        alert("Please provide all 4 options");
        return;
      }

      const questionDTO = {
        questionText,
        options,
        topic,
        difficulty,
        language,
        // correctAnswer is NOT sent (handled by service)
      };

      try {
        const response = await fetch(`${API_BASE_URL}/questions/`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(questionDTO),
        });

        if (response.ok) {
          alert("Question added successfully!");
          document.getElementById("addQuestionForm").reset();
          loadQuestions();
        } else {
          const error = await response.json();
          alert("Failed to add question: " + error.message);
        }
      } catch (error) {
        console.error("Error adding question:", error);
        alert("Network error. Please try again.");
      }
    });
}

/**
 * Delete question
 * @param {number} questionId - Question ID to delete
 */
async function deleteQuestion(questionId) {
  if (!confirm("Are you sure you want to delete this question?")) return;

  try {
    const response = await fetch(`${API_BASE_URL}/questions/${questionId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (response.ok) {
      alert("Question deleted successfully");
      loadQuestions();
    } else {
      alert("Failed to delete question");
    }
  } catch (error) {
    console.error("Error deleting question:", error);
    alert("Network error. Please try again.");
  }
}

/**
 * Practice a specific question
 * @param {number} questionId - Question ID to practice
 */
function practiceQuestion(questionId) {
  window.location.href = `/html/submission.html?questionId=${questionId}`;
}

/**
 * Edit question (Admin only)
 * @param {number} questionId - Question ID to edit
 */
function editQuestion(questionId) {
  window.location.href = `/html/admin_questions.html?editId=${questionId}`;
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
