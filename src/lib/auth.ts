// frontend-PIS/src/lib/auth.ts

import Cookies from "js-cookie";

import { jwtDecode } from "jwt-decode";

import { JwtClaims } from "public/src/models/generics";

export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  return Cookies.get("token") ?? null;
}

export function isLoggedIn(): boolean {
  return !!getTokenFromCookie();
}

export function getUserFromToken():
  | { name?: string; email?: string; sub?: string }
  | null {
  const token = getTokenFromCookie();
  if (!token) return null;
  try {
    const json = extractUserFromJwt(token);
    if (!json) return null;

    // Claims comunes en ASP.NET
    const GIVEN_URI = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname";
    const SURNAME_URI = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname";
    const EMAIL_URI = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";

    const given = json[GIVEN_URI] || json.given_name || undefined;
    const surname = json[SURNAME_URI] || json.family_name || undefined;

    const rawName = json.name || json.unique_name || (given && surname ? `${given} ${surname}` : given || undefined);

    const email = json.email || json.emails || json[EMAIL_URI] || undefined;
    const sub = json.sub || undefined;

    // nombre que mostramos en la UI
    const displayName = rawName || (email ? String(email).split("@")[0] : undefined);

    return { name: displayName, email, sub };
  } catch {
    return null;
  }
}

export function logoutAndRedirect(path = "/") {
  Cookies.remove("token", { path: "/" });
  if (typeof window !== "undefined") window.location.href = path;
}

export function buildLoginUrl(returnTo: string = "/", msg?: string): string {
  const q = new URLSearchParams({ returnTo });
  if (msg) q.set("msg", msg);
  return `/auth/login?${q.toString()}`;
}

export function extractUserFromJwt(token: string): JwtClaims | null {
  try {
    // La importación dinámica evita errores en el servidor (Server-Side Rendering)
    const jwtDecode = require("jwt-decode") as (token: string) => JwtClaims;
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
}

export function isTokenExpired(
  token: { customExp?: number } | null | undefined
): boolean {
  if (!token || !token.customExp) return true;
  const now = Math.floor(Date.now() / 1000);
  return token.customExp < now;
}

export function isSessionExpired(
  session: { customExp?: number } | null | undefined
): boolean {
  if (!session?.customExp) return true;

  const nowUTC = Math.floor(Date.now() / 1000);
  const expired = nowUTC >= session.customExp;

  return expired;
}
