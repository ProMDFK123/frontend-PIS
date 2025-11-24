"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isLoggedIn, getUserFromToken, logoutAndRedirect, getRoleFromToken, cn } from "@/lib"; 

const userLinks = [
  { href: "/", label: "Inicio" },
  { href: "/offers", label: "Explorar" },
];

const adminNavLinks = [
  { href: "/admin/publications", label: "Inicio" },
  { href: "/admin/publications/validate", label: "Validar" },
  { href: "/admin/publications/manage", label: "Administrar" },
];

const baseDropdownItems = [
  { href: "/profile", label: "Editar perfil" },
  { href: "/jobs/history", label: "Historial de postulaciones" },
  { href: "/offers/history", label: "Historial de trabajos" },
];

const adminDropdownItems = [
  { href: "/admin/users", label: "Gestión de Usuarios" },
];

function UserAvatar({ name }: { name?: string }) {
  const initials =
    name?.trim()?.split(/\s+/).slice(0, 2).map(n => n[0]?.toUpperCase()).join("") || "U";
  return (
    <div className="flex items-center gap-2">
      <div className="size-8 rounded-full bg-[var(--chip)] grid place-items-center text-[var(--ink)]/80 text-sm font-bold">
        {initials}
      </div>
      <span className="hidden sm:inline text-[var(--ink)]/90 font-medium">
        {name ?? "Usuario"}
      </span>
    </div>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [auth, setAuth] = useState<{ logged: boolean, name: string, role: string | null }>({ logged: false, name: "Usuario", role: null }); 
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logged = isLoggedIn();
    const info = getUserFromToken();
    const userRole = getRoleFromToken();
    setAuth({
      logged,
      name: info?.name || info?.email || "Usuario", 
      role: userRole
    });
  }, [pathname]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const isAdmin = auth.role === "Admin"; 
  
  const mainLinks = isAdmin ? adminNavLinks : userLinks;
  
  const dropdownItems = isAdmin 
    ? [...adminDropdownItems, ...baseDropdownItems]
    : baseDropdownItems; 

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo / marca */}
        <Link href="/" className="font-extrabold text-lg">
          <span className="text-[var(--ink)]">Bolsa</span>
          <span className="ml-1 rounded-md bg-[var(--primary)] px-2 py-1 text-white">FEUCN</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* RENDERIZADO DE ENLACES PRINCIPALES ADAPTADO AL ROL */}
          {mainLinks.map((l) => (
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
                onClick={() => setOpen((v) => !v)}
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
                  
                  {/* RENDERIZADO DE ÍTEMS DEL DROPDOWN ADAPTABLE */}
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--chip)]"
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  ))}
                  
                  {/* Botón Cerrar Sesión */}
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