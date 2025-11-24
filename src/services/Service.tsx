// src/services/Service.ts
import axios from "axios";
import Cookies from "js-cookie";
import { buildLoginUrl } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5185/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  },
});

// Attach JWT token from cookie to every request (if present)
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Centralized response handling: usually redirect on 401, but allow requests
// to opt-out by sending header `X-Skip-Redirect: 1`.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const config = error?.config ?? {};

    const skipHeader = config.headers && (config.headers["x-skip-redirect"] || config.headers["X-Skip-Redirect"]);

    const isOnLoginPage = typeof window !== "undefined" && window.location.pathname.includes("/auth/login");

    if (status === 401 && !isOnLoginPage && !skipHeader) {
      Cookies.remove("token");

      const currentPath = window.location.pathname + window.location.search;
      window.location.href = buildLoginUrl(currentPath, "login_required");
    }

    return Promise.reject(error);
  }
);


export default api;
