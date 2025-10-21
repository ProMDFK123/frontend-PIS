
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bolsa UCN",
  description: "Plataforma de ofertas para estudiantes UCN",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* NavBar global */}
        <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="font-bold text-primary">BolsaUCN</a>
            <div className="flex gap-5 text-sm">
              <a href="/" className="hover:text-primary">Inicio</a>
              <a href="/offers" className="hover:text-primary">Explorar</a>
              <a href="/auth/login" className="hover:text-primary">Ingresar</a>
            </div>
          </nav>
        </header>

        {children}

        <footer className="mt-16 border-t">
          <div className="max-w-7xl mx-auto px-4 py-8 text-sm text-muted-foreground">
            Bolsa UCN · {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  );
}
