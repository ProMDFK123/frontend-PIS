"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/offers", label: "Explorar" },
  { href: "/auth/login", label: "Ingresar", accented: true },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--card)]/85 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo / marca */}
        <Link href="/" className="font-extrabold text-lg">
          <span className="text-[var(--ink)]">Bolsa</span>
          <span className="ml-1 rounded-md bg-[var(--primary)] px-2 py-1 text-white">FEUCN</span>
        </Link>

        {/* Links */}
        <div className="flex gap-2">
          {links.map((l) =>
            l.accented ? (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-xl px-4 py-2 font-semibold text-white bg-[var(--primary)] hover:opacity-95 transition"
              >
                {l.label}
              </Link>
            ) : (
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
            )
          )}
        </div>
      </nav>
    </header>
  );
}
