// src/services/Service.ts
import axios from "axios";
import Cookies from "js-cookie";
import { buildLoginUrl } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5185/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
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

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    const isOnLoginPage =
      typeof window !== "undefined" &&
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
