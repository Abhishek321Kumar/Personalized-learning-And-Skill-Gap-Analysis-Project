const API_BASE_URL = "http://localhost:5000/api";

const getHeaders = (isJson = true) => {
  const token = window.localStorage.getItem("skillbridge-token");
  const headers = {};

  if (isJson) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

export const api = {
  getModules: () => request("/meta/modules"),
  register: (data) =>
    request("/auth/register", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }),
  login: (data) =>
    request("/auth/login", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }),
  getProfile: () =>
    request("/profile/me", {
      headers: getHeaders(false)
    }),
  updateProfile: (data) =>
    request("/profile/me", {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }),
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await fetch(`${API_BASE_URL}/profile/resume`, {
      method: "POST",
      headers: getHeaders(false),
      body: formData
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message || "Resume upload failed.");
    }

    return payload;
  },
  getJobs: () =>
    request("/jobs", {
      headers: getHeaders(false)
    }),
  runAnalysis: (data) =>
    request("/analysis/run", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }),
  getLatestAnalysis: () =>
    request("/analysis/latest", {
      headers: getHeaders(false)
    }),
  getQuizzes: () =>
    request("/assessment/quizzes", {
      headers: getHeaders(false)
    }),
  startQuiz: (quizId) =>
    request("/assessment/start", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ quizId })
    }),
  submitAnswer: (data) =>
    request("/assessment/answer", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    }),
  getAttempt: (attemptId) =>
    request(`/assessment/attempts/${attemptId}`, {
      headers: getHeaders(false)
    }),
  getDashboard: () =>
    request("/dashboard/overview", {
      headers: getHeaders(false)
    })
};

