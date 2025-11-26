import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const { pathname } = req.nextUrl;

  // Debug logs: ayudan a entender por qué se hacen redirecciones en middleware
  // eslint-disable-next-line no-console
  console.log("[middleware] pathname:", pathname, "tokenPresent:", Boolean(token));

  const requiresAuth =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard") ||
    // proteger dinámicos de detalle:
    (pathname.startsWith("/offers/") && pathname !== "/offers") ||
    pathname.startsWith("/buysells/");

  if (requiresAuth && !token) {
    // eslint-disable-next-line no-console
    console.log("[middleware] requiresAuth and no token -> redirect to /auth/login with returnTo=", pathname + (req.nextUrl.search || ""));
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("returnTo", pathname + (req.nextUrl.search || ""));
    url.searchParams.set("msg", "login_required");
    return NextResponse.redirect(url);
  }

  // si intenta ir a /auth/login teniendo token => home
  if (pathname === "/auth/login" && token) {
    // eslint-disable-next-line no-console
    console.log("[middleware] visiting /auth/login but token present -> redirect to / (home)");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/profile/:path*", "/dashboard/:path*", "/offers/:path*", "/buysells/:path*"],
};