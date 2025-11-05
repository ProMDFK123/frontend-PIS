import type { Metadata } from "next";
import { Inter } from "next/font/google";

import SiteHeader from "@/components/shared/SiteHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Bolsa FEUCN",
  description: "Bolsa de trabajo y servicios para estudiantes UCN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} font-sans antialiased bg-[var(--bg)] text-[var(--ink)]`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}

