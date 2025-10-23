import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const { pathname } = req.nextUrl;

  const requiresAuth =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard") ||
    // proteger dinámicos de detalle:
    (pathname.startsWith("/offers/") && pathname !== "/offers") ||
    pathname.startsWith("/buysells/");

  if (requiresAuth && !token) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("returnTo", pathname + (req.nextUrl.search || ""));
    url.searchParams.set("msg", "login_required");
    return NextResponse.redirect(url);
  }

  // si intenta ir a /auth/login teniendo token => home
  if (pathname === "/auth/login" && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/profile/:path*", "/dashboard/:path*", "/offers/:path*", "/buysells/:path*"],
};
