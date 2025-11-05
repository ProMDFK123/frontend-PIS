// src/services/Service.ts
import axios from "axios";
import Cookies from "js-cookie";
import { buildLoginUrl } from "@/lib/auth";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 1) Adjuntar token JWT en cada request del cliente
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

// ✅ 2) Manejo centralizado de errores 401 (token inválido o expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (typeof window !== "undefined" && status === 401) {
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = buildLoginUrl(currentPath, "login_required");
    }

    // Propaga el error para que sea manejado por los catch individuales
    return Promise.reject(error);
  }
);

export default api;
