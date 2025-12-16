import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { extractUserFromJwt } from "@/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value || null;
  const { pathname } = req.nextUrl;
  const disclaimerAccepted = req.cookies.get("disclaimerAccepted")?.value === "true";

  // Debug logs: ayudan a entender por qué se hacen redirecciones en middleware
  // eslint-disable-next-line no-console
  console.log("[middleware] pathname:", pathname, "tokenPresent:", Boolean(token));

  const requiresAuth =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard") ||
    // proteger dinámicos de detalle:
    (pathname.startsWith("/offers/") && pathname !== "/offers") ||
    pathname.startsWith("/buysells/") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/students"); // Nuevo: Proteger rutas de estudiante

  if (requiresAuth && !token) {
    // eslint-disable-next-line no-console
    console.log("[middleware] requiresAuth and no token -> redirect to /auth/login with returnTo=", pathname + (req.nextUrl.search || ""));
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("returnTo", pathname + (req.nextUrl.search || ""));
    url.searchParams.set("msg", "login_required");
    return NextResponse.redirect(url);
  }
  
  // Si intenta acceder a las ofertas sin aceptar el disclaimer => home
  if (pathname.startsWith("/offers") && !disclaimerAccepted && !token) {
    // eslint-disable-next-line no-console
    console.log("[middleware] visiting /offers but disclaimer not accepted -> redirect to / (home)");
    return NextResponse.redirect(new URL("/", req.url));
  }

  //Si intenta acceder a registrar/role sin aceptar el disclaimer => home
  if ((pathname.startsWith("/auth/register/") && pathname !== ("/auth/register/admin")) && !disclaimerAccepted) {
    // eslint-disable-next-line no-console
    console.log("[middleware] visiting /auth/register/role but disclaimer not accepted -> redirect to / (register)");
    return NextResponse.redirect(new URL("/auth/register", req.url));
  }

  // si intenta ir a /auth/login teniendo token => home
  if (pathname === "/auth/login" && token) {
    // eslint-disable-next-line no-console
    console.log("[middleware] visiting /auth/login but token present -> redirect to / (home)");
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Si intenta registrar admin sin autorizacion => home
  if (pathname === "/auth/register/admin" && token) {
    const role = extractUserFromJwt(token).role;
    if (role !== "admin") {
      // eslint-disable-next-line no-console
      console.log("[middleware] visiting /auth/register/admin without admin role -> redirect to / (home)");
      return NextResponse.redirect(new URL("/", req.url));
    }
  } // si intenta ir a /auth/register teniendo token => home
  else if (pathname.startsWith("/auth/register") && token) {
    // eslint-disable-next-line no-console
    console.log("[middleware] visiting /auth/register but token present -> redirect to / (home)");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/login", "/auth/register/:path*", "/profile/:path*", "/dashboard/:path*", "/offers/:path*","/offerer/:path*", "/buysells/:path*"],
};