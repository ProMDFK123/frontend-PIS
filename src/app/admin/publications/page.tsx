import React from 'react';
import { CheckCircle, Settings } from 'lucide-react';

const AdminHero = () => (
  <section
    className="relative h-[85vh] flex items-center justify-center text-white p-4 overflow-hidden" 
    style={{
      backgroundImage: 'url(/campusucnadmin.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
    <div className="relative text-center max-w-4xl space-y-8 z-10">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
        Panel de Administración
      </h1>
      <p className="text-xl md:text-2xl text-gray-200 drop-shadow-md">
        Gestión centralizada de publicaciones y configuración de la plataforma FEUCN.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
        <a
          href='/admin/publications/validate'
          className="flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold transition duration-300 shadow-xl 
                     bg-purple-600 text-white hover:bg-purple-700 hover:scale-[1.02] transform transition-all group"
        >
          <CheckCircle className="mr-3 size-6 group-hover:rotate-6 transition" />
          Validar Publicaciones
        </a>
        <a
          href='/admin/publications/manage' 
          className="flex items-center justify-center px-8 py-4 rounded-xl text-lg font-semibold transition duration-300 shadow-xl 
                     bg-white text-purple-600 hover:bg-gray-100 hover:scale-[1.02] transform transition-all group"
        >
          <Settings className="mr-3 size-6 group-hover:rotate-6 transition" />
          Administrar Publicaciones
        </a>
      </div>
    </div>
  </section>
);

const Footer = () => (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] py-6 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-4 text-[color:var(--foreground)]/80"> {/* Se redujo el gap a gap-4 */}
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