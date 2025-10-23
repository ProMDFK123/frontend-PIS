import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;

  const protectedPaths = ["/dashboard", "/profile", "/offers/", "/buysells/"];
  const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

  if (isProtected && !token) {
    const returnTo = encodeURIComponent(req.nextUrl.pathname + req.nextUrl.search);
    const url = new URL(`/auth/login?returnTo=${returnTo}&msg=login_required`, req.url); // ← msg
    return NextResponse.redirect(url);
  }

  if (req.nextUrl.pathname === "/auth/login" && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/login",
    "/offers/:path*",
    "/buysells/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
  ],
};