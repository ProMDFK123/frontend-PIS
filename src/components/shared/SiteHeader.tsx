"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useMemo } from "react";
import { getProfileRoute, getUserFromToken } from "@/lib";

import { 
  isLoggedIn,
  extractUserFromJwt,
  getRoleFromToken,
  logoutAndRedirect,
  cn
} from "@/lib";

import { profileService } from "@/services/profileService";

// LINKS DE USUARIO
const userLinks = [
  { href: "/", label: "Inicio" },
  { href: "/offers", label: "Explorar" },
];

// LINKS DE ADMIN
const adminNavLinks = [
  { href: "/admin/publications", label: "Inicio" },
  { href: "/admin/publications/validate", label: "Validar" },
  { href: "/admin/publications/manage", label: "Administrar" },
];

// DROPDOWN USER BASE
const baseDropdownItems = [
  { href: "/profile", label: "Editar perfil" },
  { href: "/jobs/history", label: "Historial de postulaciones" },
  { href: "/jobs/reports", label: "Historial de trabajos" }, // Se modifica dinámicamente
];

// LINKS DE COMPAÑIA Y INDIVIDUAL
const offererNavLinks = [
  { href: "/offers", label: "Inicio" },
  { href: "/offerer/create-publication", label: "Publicar" },
  { href: "/offerer/create-publication/your-publications", label: "Mis Publicaciones" },
];

function UserAvatar({ name, photoUrl }: { name?: string; photoUrl?: string }) {
  const initials =
    name?.trim()?.split(/\s+/).slice(0, 2).map(n => n[0]?.toUpperCase()).join("") || "U";

  return (
    <div className="flex items-center gap-2">
      <div className="size-8 rounded-full bg-[var(--chip)] grid place-items-center text-[var(--ink)]/80 text-sm font-bold overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt="Foto de perfil"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-[var(--ink)]/80">{initials}</span>
        )}
      </div>

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
    name: "Usuario",
    role: null as string | null,
    userType: null as string | null,
    photoUrl: null as string | null
  });

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // CARGAR AUTH Y FOTO DE PERFIL
  useEffect(() => {
    const logged = isLoggedIn();
    const info = extractUserFromJwt();
    const userRole = getRoleFromToken(); // <-- AQUÍ LLEGA Student, Offerent o Admin
    const tokenData = getUserFromToken();

    setAuth({
      logged,
      name: info?.userName || info?.email?.split("@")[0] || "Usuario",
      role: userRole,
      userType: tokenData?.userType || null,
      photoUrl: null
    });

    if (logged) {
      const loadPhoto = async () => {
        try {
          const res = await profileService.getProfilePhoto();
          if (res.data?.photoUrl) {
            setAuth(prev => ({
              ...prev,
              photoUrl: `${res.data.photoUrl}?v=${Date.now()}`
            }));
          }
        } catch (err) {
          console.error("Error obteniendo foto:", err);
        }
      };
      loadPhoto();
    }
  }, [pathname]);

  // Calculo dinamico de rutas
  const dropdownItems = useMemo(() => {
    const baseItems = [
      { href: getProfileRoute(auth.userType ?? undefined), label: "Editar perfil"},
      { href: "/jobs/history", label: "Historial de postulaciones" },
      { href: "/jobs/reports", label: "Historial de trabajos" },
      { href: "/offerer/create-publication", label: "Publicar" },
      { href: "/offerer/create-publication/your-publications", label: "Mis Publicaciones" },
    ];

    return baseItems.map(item => {
      if (item.label !== "Historial de trabajos") return item;

      let newHref = "/jobs/reviews/student"; // Ruta para estudiante

      if (auth.role === "Offerent") {
        newHref = "/jobs/reviews/employer"; // Ruta para oferente
      }

      if (auth.role === "Admin") {
        newHref = "/jobs/reports"; // Ruta para admin
      }
      return { ...item, href: newHref };
    });
  }, [auth.userType, auth.role]);

  // CERRAR DROPDOWN CLICK FUERA
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const isAdmin = auth.role === "Admin";
  const isOfferer = auth.role === "Offerent";
  const mainLinks = isAdmin ? adminNavLinks : isOfferer ? offererNavLinks : userLinks;

return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">

        <Link href="/" className="font-extrabold text-lg">
          <span className="text-[var(--ink)]">Bolsa</span>
          <span className="ml-1 rounded-md bg-[var(--primary)] px-2 py-1 text-white">FEUCN</span>
        </Link>

        <div className="flex items-center gap-2">

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
                onClick={() => setOpen(v => !v)}
                className="rounded-xl px-2 py-1 hover:bg-[var(--chip)] transition flex items-center gap-2"
              >
                <UserAvatar name={auth.name} photoUrl={auth.photoUrl ?? undefined} />
                <svg width="16" height="16" viewBox="0 0 20 20" className="text-[var(--ink)]/70">
                  <path d="M5 7l5 5 5-5" fill="currentColor" />
                </svg>
              </button>

              {open && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-xl border border-[var(--border)] bg-white shadow-lg overflow-hidden"
                >
                  {dropdownItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--chip)]"
                    >
                      {item.label}
                    </Link>
                  ))}

                  <button
                    onClick={() => logoutAndRedirect("/")}
                    className="w-full text-left px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--chip)]"
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