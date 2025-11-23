"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  exp: number;
  userType?: string;
  role?: string;
  email?: string;
};

const baseLinks = [
  { href: "/", label: "Inicio" },
  { href: "/offers", label: "Explorar" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setIsLoggedIn(false);
      setUserType(null);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        Cookies.remove("token");
        setIsLoggedIn(false);
        setUserType(null);
        router.push("/account/login");
        return;
      }

      setIsLoggedIn(true);
      setUserType(decoded.userType ?? null);

    } catch (err) {
      console.error("Error decodificando token:", err);
      setIsLoggedIn(false);
      setUserType(null);
    }
  }, []);

  const logout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    setUserType(null);
    router.push("/account/login");
  };

  // 🔷 Obtener ruta correcta según el tipo de usuario
  const getProfileUrl = () => {
    switch (userType) {
      case "Admin": return "/profile/admin";
      case "Student": return "/profile/student";
      case "Company": return "/profile/company";
      case "Individual": return "/profile/individual";
      default: return "/profile";
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 shadow">
      {/* Logo */}
      <div className="text-xl font-bold">
        <Link href="/">Mi App</Link>
      </div>

      {/* Links */}
      <nav className="flex gap-6">
        {baseLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={
              pathname === link.href
                ? "font-semibold text-blue-600"
                : "text-gray-700"
            }
          >
            {link.label}
          </Link>
        ))}

        {isLoggedIn ? (
          <>
            {/* 🔵 Ir al perfil según el userType */}
            <Link
              href={getProfileUrl()}
              className={
                pathname.startsWith("/profile")
                  ? "font-semibold text-blue-600"
                  : "text-gray-700"
              }
            >
              Perfil
            </Link>

            <button
              className="text-red-600 font-medium"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link
            href="/account/login"
            className={
              pathname === "/account/login"
                ? "font-semibold text-blue-600"
                : "text-gray-700"
            }
          >
            Iniciar Sesión
          </Link>
        )}
      </nav>
    </header>
  );
}
