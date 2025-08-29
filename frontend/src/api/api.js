import axios from "axios";

const candidates = [
  import.meta?.env?.VITE_API_URL,
  "http://localhost:5000/api",
  "http://localhost:8000/api",
].filter(Boolean);

const api = axios.create({
  baseURL: candidates[0],
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach latest token on every request
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-handle 401s (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch {}
      // Optionally redirect to login
      // if (typeof window !== "undefined") window.location.href = "/login";
    }
    // Fallback: retry with next base URL if network error or server unreachable
    const config = error.config || {};
    const tried = config.__triedBases || [];
    const isNetworkError = !error.response;
    if ((isNetworkError || error?.response?.status >= 500) && tried.length < candidates.length) {
      const nextBase = candidates.find((b) => !tried.includes(b));
      if (nextBase) {
        config.__triedBases = [...tried, nextBase];
        config.baseURL = nextBase;
        return api.request(config);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
