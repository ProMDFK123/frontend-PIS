import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value || null;

    const protectedPaths = ["/dashboard", "/profile"]; // rutas protegidas
    const isProtected = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

    if (isProtected && !token) {
        // Redirige a login si no hay token
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

    if (req.nextUrl.pathname === "/auth/login" && token) {
        // Redirige al home si ya está logueado
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/auth/login", "/dashboard/:path*", "/profile/:path*"],
};
