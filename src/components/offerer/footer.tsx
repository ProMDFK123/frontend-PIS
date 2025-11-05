
//=================================================================
// 2. COMPONENTE FOOTER
// (Idealmente, esto iría en /components/layout/Footer.tsx)
//=================================================================
import { Facebook, Linkedin, Youtube, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1: Brand y Social */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Bolsa UCN</h3>
            <div className="flex space-x-5 text-gray-500">
              <a href="#" className="hover:text-gray-700"><Facebook size={20} /></a>
              <a href="#" className="hover:text-gray-700"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-gray-700"><Youtube size={20} /></a>
              <a href="#" className="hover:text-gray-700"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Columna 2: Navegación */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-3">Navegación</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Inicio</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Ofertas</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Publicar</a></li>
            </ul>
          </div>

          {/* Columna 3: Ayuda */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-3">Ayuda</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">FAQ</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Contacto</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Soporte</a></li>
            </ul>
          </div>

          {/* Columna 4: Nosotros */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-3">Nosotros</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Misión</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Equipo</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Federación UCN</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-sm text-gray-500 text-center">
          <p>© {new Date().getFullYear()} Bolsa UCN. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
