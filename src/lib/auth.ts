// frontend-PIS/src/lib/auth.ts
export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function isLoggedIn(): boolean {
  return !!getTokenFromCookie();
}

export function buildLoginUrl(returnTo: string = "/", msg?: string): string {
  const q = new URLSearchParams({ returnTo });
  if (msg) q.set("msg", msg); //mensaje de aviso que inicie sesión
  return `/auth/login?${q.toString()}`;
}
