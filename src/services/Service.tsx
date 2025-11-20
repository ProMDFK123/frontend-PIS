// src/services/Service.ts
import axios from "axios";
import Cookies from "js-cookie";
import { buildLoginUrl } from "public/src/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5185/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json"
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    const isOnLoginPage = typeof window !== "undefined" &&
      window.location.pathname.includes("/auth/login");

    if (status === 401 && !isOnLoginPage) {
      Cookies.remove("token");

      const currentPath = window.location.pathname + window.location.search;
      window.location.href = buildLoginUrl(currentPath, "login_required");
    }

    return Promise.reject(error);
  }
);


export default api;
