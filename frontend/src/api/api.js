import axios from "axios";

const BASE_URL = import.meta.env.DEV ? "http://localhost:8000" : "";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];

    if (token) {
      config.headers["X-CSRFToken"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/login/") &&
      !originalRequest.url.includes("/api/logout/") &&
      !originalRequest.url.includes("/api/token/refresh/")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api.request(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/api/token/refresh/");

        processQueue(null);
        return api.request(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError);

        try {
          await api.post("/api/logout/");
        } catch (logoutError) {
          console.warn("Silent logout attempt failed during token refresh");
        }

        const currentPath = window.location.pathname;
        const isPublicPage =
          currentPath === "/" ||
          currentPath === "/login/" ||
          currentPath === "/register/" ||
          currentPath.startsWith("/anime/");

        if (!isPublicPage) {
          window.location.href = "/login/";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;