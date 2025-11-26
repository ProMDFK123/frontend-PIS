"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";
import { useEffect, useRef, useState } from "react";
import { isLoggedIn, getUserFromToken, extractUserFromJwt, logoutAndRedirect, getProfileRoute} from "@/lib/auth";
import { profileService } from "@/services/profileService";


const baseLinks = [
  { href: "/", label: "Inicio" },
  { href: "/offers", label: "Explorar" },
];

function UserAvatar({ name, photoUrl }: { name?: string; photoUrl?: string }) {

  const initials =
    name?.trim()?.split(/\s+/).slice(0, 2).map(n => n[0]?.toUpperCase()).join("") || "U";
  return (
    <div className="flex items-center gap-2">
      {/* Avatar circle */}
      <div className="size-8 rounded-full bg-[var(--chip)] grid place-items-center text-[var(--ink)]/80 text-sm font-bold overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Foto de perfil"
            className="w-full h-full object-cover rounded-full"
            key={photoUrl}
          />
        ) : (
          <span className="text-[var(--ink)]/80">
            {initials}
          </span>
        )}
      </div>

      {/* Name label - separate from avatar */}
      <span className="hidden sm:inline text-[var(--ink)]/90 font-medium">
        {name ?? "Usuario"}
      </span>
    </div>

  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [auth, setAuth] = useState({ 
    logged: false, 
    name: "Usuario" , 
    userType: "",
    photoUrl: null as string | null
  });
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const logged = isLoggedIn();
    const info = extractUserFromJwt();
    setAuth({ 
      logged, 
      name: info?.userName || info?.email ? String(info.email).split("@")[0] : "Usuario",
      userType: info?.userType || "",
      photoUrl: null
    });
    if (logged) {
      const fetchProfilePhoto = async () => {
        try {
          const response = await profileService.getProfilePhoto();
          if (response.data) {
            setAuth(prev => ({
                ...prev,
                photoUrl: `${response.data.photoUrl}?v=${Date.now()}`
            }));
          }
        } catch (err) {
          console.error("Error al obtener la foto de perfil:", err);
        }
      };
      fetchProfilePhoto();
    }
  }, [pathname]);


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
        {/* Logo / marca */}
        <Link href="/" className="font-extrabold text-lg">
          <span className="text-[var(--ink)]">Bolsa</span>
          <span className="ml-1 rounded-md bg-[var(--primary)] px-2 py-1 text-white">FEUCN</span>
        </Link>

        <div className="flex items-center gap-2">
          {baseLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-xl px-4 py-2 text-[var(--ink)]/85 hover:bg-[var(--chip)] transition",
                // marcamos activo solo si coincide exacto o si estamos en /offers y el link es /offers
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
                <UserAvatar name={auth.name} photoUrl={auth.photoUrl ?? undefined} />
                <svg width="16" height="16" viewBox="0 0 20 20" className="text-[var(--ink)]/70">
                  <path d="M5 7l5 5 5-5" fill="currentColor" />
                </svg>
              </button>
              {open && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border)] bg-white shadow-lg overflow-hidden"
                >
                  <Link
                    href={getProfileRoute(auth.userType)}
                    className="block px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--chip)]"
                    role="menuitem"
                  >
                    Editar perfil
                  </Link>
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