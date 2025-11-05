//=================================================================
// 1. COMPONENTE NAVBAR
// (Idealmente, esto iría en /components/layout/Navbar.tsx)
//=================================================================
import { User } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm" style={{ backgroundColor: '#3a539b' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-white">BolsaUCN</h1>
          </div>

          {/* Links de Navegación */}
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a
              href="#"
              className="text-gray-200 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
            >
              Inicio
            </a>
            <a
              href="#"
              className="text-gray-200 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
            >
              Explorar
            </a>
            <a
              href="#"
              className="text-gray-200 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium"
            >
              Historial
            </a>
          </div>

          {/* Perfil de Usuario */}
          <div className="flex items-center">
            <a
              href="#"
              className="text-sm font-medium text-white bg-blue-500 rounded-full px-4 py-2 flex items-center gap-2 transition-colors"
              style={{ backgroundColor: '#4a90e2' }}
            >
              <span className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-blue-800 font-semibold">
                <User size={16} />
              </span>
              Oferente #1
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
