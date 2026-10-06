import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_API || "http://localhost:8000",
});

// Request Interceptor: Automatically attach JWT Bearer token and custom Gemini x-api-key
API.interceptors.request.use(
  (config) => {
    // Attach JWT Bearer token
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Attach custom Gemini key if configured by the user
    const userKey = localStorage.getItem("gemini_user_key");
    if (userKey) {
      config.headers["x-api-key"] = userKey;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized responses
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized due to expired token (and not on login/register endpoints)
      const url = error.config ? error.config.url : "";
      if (!url.includes("/api/auth/login") && !url.includes("/api/auth/register")) {
        // Clear stored token
        localStorage.removeItem("token");
        // Dispatch custom event so AuthContext can update state
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }
    return Promise.reject(error);
  }
);

// ==========================================
// Authentication APIs
// ==========================================
export const registerApi = async (userData) => {
  return await API.post("/api/auth/register", userData);
};

export const loginApi = async (credentials) => {
  return await API.post("/api/auth/login", credentials);
};

export const getMeApi = async () => {
  return await API.get("/api/auth/me");
};

// ==========================================
// AI Trigger APIs (Authenticated & Persisted)
// ==========================================
export const getConvertedCode = async (code, fromLanguage, toLanguage) => {
  return await API.post("/convert", {
    code,
    fromLanguage,
    toLanguage,
  });
};

export const getDebugResponse = async (code, language = "javascript") => {
  return await API.post("/debug", { code, language });
};

export const getQualityCheck = async (code, language = "javascript") => {
  return await API.post("/codeQuality", { code, language });
};

// ==========================================
// User Review History & Statistics APIs
// ==========================================
export const getMyReviewsApi = async () => {
  return await API.get("/api/reviews/my");
};

export const getMyStatsApi = async () => {
  return await API.get("/api/reviews/stats");
};

export const getReviewByIdApi = async (id) => {
  return await API.get(`/api/reviews/${id}`);
};

export const deleteReviewApi = async (id) => {
  return await API.delete(`/api/reviews/${id}`);
};

// ==========================================
// Admin APIs (Restricted to Admin Role)
// ==========================================
export const getAdminStatsApi = async () => {
  return await API.get("/api/admin/stats");
};

export const getAdminUsersApi = async () => {
  return await API.get("/api/admin/users");
};

export const getAdminReviewsApi = async () => {
  return await API.get("/api/admin/reviews");
};

export default API;
