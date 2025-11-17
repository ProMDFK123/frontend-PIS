import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { toast } from "sonner";

import { isSessionExpired } from "@/lib";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async config => {
  // Try to get the session only on the client side
  if (typeof window !== "undefined") {
    const session = await getSession();
    const token = session?.accessToken;

    // If there is a session, check if it's expired
    if (session && isSessionExpired(session)) {
      toast.error("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      await signOut({ redirect: false });
      return Promise.reject(new Error("Token expired"));
    }

    // If there is an active session, always add the authorization token
    if (token) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] =
        `Bearer ${token}`;
    }
  }

  return config;
});