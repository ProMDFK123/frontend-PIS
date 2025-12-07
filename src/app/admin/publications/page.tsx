import React from 'react';
import { CheckCircle, Settings } from 'lucide-react';

const AdminHero = () => (
  <section
    className="relative h-[85vh] flex items-center justify-center text-white p-4 overflow-hidden bg-gradient-to-r from-violet-700 via-purple-600 to-fuchsia-600"
  >
    <div
      className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.5] mix-blend-soft-light pointer-events-none"
      style={{
        backgroundImage: 'url(/campusucnadmin.jpg)',
      }}
    ></div>

    <div className="relative text-center max-w-4xl space-y-8 z-10 flex flex-col items-center">

      <div className="relative mb-6 group">
        <img
          src="/feucn_logo.png"
          alt="Logo FEUCN"
          className="mx-auto w-48 h-48 md:w-56 md:h-56 rounded-full object-cover shadow-2xl border-4 border-white/20"
        />
      </div>
      {/* --------------------------- */}

      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
        Panel de Administración
      </h1>

      <p className="text-xl md:text-2xl text-gray-100 drop-shadow-md max-w-2xl">
        Gestión integral de las publicaciones del sistema BolsaFEUCN
      </p>

      {/* BOTONES */}
      <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4 w-full">
        <a
          href='/admin/publications/validate'
          className="flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold transition duration-300 shadow-xl
                     bg-white text-black hover:bg-gray-100 hover:scale-[1.02] transform transition-all group w-full sm:w-auto"
        >
          <CheckCircle className="mr-3 size-6 text-black group-hover:rotate-6 transition" />
          Validar Publicaciones
        </a>

        <a
          href='/admin/publications/manage'
          className="flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold transition duration-300 shadow-xl
                     bg-white text-black hover:bg-gray-100 hover:scale-[1.02] transform transition-all group w-full sm:w-auto"
        >
          <Settings className="mr-3 size-6 text-black group-hover:rotate-6 transition" />
          Administrar Publicaciones
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-[var(--border)] bg-[var(--card)] py-6 px-6 mt-auto">
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-4 text-[color:var(--foreground)]/80">
      
      <div>
        <h4 className="font-bold text-[color:var(--foreground)] mb-2">FEUCN</h4>
        <div className="flex gap-3 text-xl">
          <a href="#" aria-label="Facebook"><i className="ri-facebook-fill" /></a>
          <a href="#" aria-label="LinkedIn"><i className="ri-linkedin-fill" /></a>
          <a href="#" aria-label="YouTube"><i className="ri-youtube-fill" /></a>
          <a href="#" aria-label="Instagram"><i className="ri-instagram-fill" /></a>
        </div>
      </div>

      <div>
        <h5 className="font-semibold text-[color:var(--foreground)] mb-1">Navegación</h5>
        <ul className="space-y-0.5">
          <li><a href="/">Inicio</a></li>
          <li><a href="/offers">Ofertas</a></li>
          <li><a href="/publish">Publicar</a></li>
        </ul>
      </div>

      <div>
        <h5 className="font-semibold text-[color:var(--foreground)] mb-1">Ayuda</h5>
        <ul className="space-y-0.5">
          <li><a href="/faq">Preguntas frecuentes</a></li>
          <li><a href="/contact">Contacto</a></li>
          <li><a href="/support">Soporte</a></li>
        </ul>
      </div>

      <div>
        <h5 className="font-semibold text-[color:var(--foreground)] mb-1">Nosotros</h5>
        <ul className="space-y-0.5">
          <li><a href="/about">Misión</a></li>
          <li><a href="/team">Equipo</a></li>
          <li><a href="https://www.instagram.com/feucn">Federación UCN</a></li>
        </ul>
      </div>

    </div>
  </footer>
);

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen">
      <AdminHero />
      <div className="flex-grow"></div>
      <Footer />
    </main>
  );
}
