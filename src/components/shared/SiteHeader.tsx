"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib";
import { useEffect, useRef, useState } from "react";
import { isLoggedIn, getUserFromToken, logoutAndRedirect } from "@/lib/auth";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const baseLinks = [
  { href: "/", label: "Inicio" },
  { href: "/offers", label: "Explorar" },
];

function UserAvatar({ name }: { name?: string }) {
  const initials =
    name?.trim()?.split(/\s+/).slice(0, 2).map(n => n[0]?.toUpperCase()).join("") || "U";
  return (
    <div className="flex items-center gap-2">
      <div className="size-8 rounded-full bg-[var(--chip)] grid place-items-center text-[var(--ink)]/80 text-sm font-bold">
        {initials}
      </div>
      <span className="hidden sm:inline text-[var(--ink)]/90 font-medium">{name ?? "Usuario"}</span>
    </div>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [auth, setAuth] = useState({ logged: false, name: "Usuario" });
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [profileUrl, setProfileUrl] = useState<string>("/profile");

  // Decodificar token y establecer profileUrl
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const decoded: { userType?: string } = jwtDecode(token);
      console.log("rol:", decoded.userType);
      switch (decoded.userType) {
        case "Administrador":
          setProfileUrl("/profile/admin");
          break;
        case "Estudiante":
          setProfileUrl("/profile/student");
          break;
        case "Empresa":
          setProfileUrl("/profile/company");
          break;
        case "Particular":
          setProfileUrl("/profile/individual");
          break;
        default:
          setProfileUrl("/profile");
          break;
      }
    } catch (err) {
      console.error("Error decodificando token:", err);
      setProfileUrl("/profile");
    }
  }, []);

  // Estado de usuario
  useEffect(() => {
    const logged = isLoggedIn();
    const info = getUserFromToken();
    setAuth({ logged, name: info?.name || info?.email || "Usuario" });
  }, [pathname]);

  // Cerrar menú al click afuera
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="font-extrabold text-lg">
          <span className="text-[var(--ink)]">Bolsa</span>
          <span className="ml-1 rounded-md bg-[var(--primary)] px-2 py-1 text-white">FEUCN</span>
        </Link>

        <div className="flex items-center gap-2">
          {baseLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-xl px-4 py-2 text-[var(--ink)]/85 hover:bg-[var(--chip)] transition",
                pathname === l.href && "bg-[var(--chip)] text-[var(--ink)]"
              )}
            >
              {l.label}
            </Link>
          ))}

          {!auth.logged ? (
            <Link
              href="/auth/login"
              className="rounded-xl px-4 py-2 font-semibold text-white bg-[var(--primary)] hover:opacity-95 transition"
            >
              Ingresar
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(v => !v)}
                className="rounded-xl px-2 py-1 hover:bg-[var(--chip)] transition flex items-center gap-2"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <UserAvatar name={auth.name} />
                <svg width="16" height="16" viewBox="0 0 20 20" className="text-[var(--ink)]/70">
                  <path d="M5 7l5 5 5-5" fill="currentColor" />
                </svg>
              </button>

              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border)] bg-white shadow-lg overflow-hidden"
                >
                  {profileUrl && (
                    <button
                      onClick={() => router.push(profileUrl)}
                      className="block w-full text-left px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--chip)]"
                    >
                      Perfil
                    </button>
                  )}
                  <Link
                    href="/jobs/history"
                    className="block px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--chip)]"
                    role="menuitem"
                  >
                    Historial de postulaciones
                  </Link>
                  <Link
                    href="/offers/history"
                    className="block px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--chip)]"
                    role="menuitem"
                  >
                    Historial de trabajos
                  </Link>
                  <button
                    onClick={() => logoutAndRedirect("/")}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--chip)]"
                    role="menuitem"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
