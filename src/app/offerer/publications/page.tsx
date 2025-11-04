'use client'; // Necesario para hooks como useState (para paginación)

import React, { useState } from 'react';
import { 
  Facebook, 
  Linkedin, 
  Youtube, 
  Instagram, 
  ChevronLeft, 
  ChevronRight,
  User
} from 'lucide-react';

//=================================================================
// 1. COMPONENTE NAVBAR
// (Idealmente, esto iría en /components/layout/Navbar.tsx)
//=================================================================
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

//=================================================================
// 2. COMPONENTE FOOTER
// (Idealmente, esto iría en /components/layout/Footer.tsx)
//=================================================================
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

//=================================================================
// 3. COMPONENTE PAGINATION
// (Idealmente, esto iría en /components/ui/Pagination.tsx)
//=================================================================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  // Lógica simple para mostrar páginas (puedes hacerla más compleja)
  const pages = [];
  pages.push(1);
  if (currentPage > 3) pages.push('...');
  if (currentPage > 2) pages.push(currentPage - 1);
  if (currentPage > 1 && currentPage < totalPages) pages.push(currentPage);
  if (currentPage < totalPages - 1) pages.push(currentPage + 1);
  if (currentPage < totalPages - 2) pages.push('...');
  if (totalPages > 1) pages.push(totalPages);

  const uniquePages = [...new Set(pages)]; // Eliminar duplicados

  return (
    <nav className="flex items-center justify-between text-sm">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={20} />
      </button>
      
      <div className="flex items-center gap-2 mx-2">
        {uniquePages.map((page, index) => (
          page === '...' ? (
            <span key={index} className="px-2 py-1 text-gray-500">...</span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-1 rounded-md ${
                page === currentPage
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          )
        ))}
        {/* En la imagen aparece hasta 60, lo simulamos */}
        <span className="px-2 py-1 text-gray-500">...</span>
        <button
          onClick={() => onPageChange(60)}
          className={`px-3 py-1 rounded-md ${
            60 === currentPage
              ? 'bg-indigo-600 text-white font-semibold'
              : 'text-gray-600 hover:bg-gray-200'
          }`}
        >
          60
        </button>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight size={20} />
      </button>
    </nav>
  );
};

//=================================================================
// 4. DATOS DE EJEMPLO (MOCK DATA)
//=================================================================
type PublicationStatus = 'Publicada' | 'En proceso' | 'Rechazada';

const mockPublications = [
  { id: 1, title: 'Apoyo en feria UCN', status: 'Publicada' as PublicationStatus },
  { id: 2, title: 'Voluntariado en la UCN', status: 'Publicada' as PublicationStatus },
  { id: 3, title: 'Promotor para Festival cultural de musica', status: 'En proceso' as PublicationStatus },
  { id: 4, title: 'Vendo PS4 (Semi-nueva)', status: 'Publicada' as PublicationStatus },
  { id: 5, title: 'Venta de Notebook ASUS ROG', status: 'Rechazada' as PublicationStatus },
];

//=================================================================
// 5. HELPER PARA EL BADGE DE ESTADO
//=================================================================
const getStatusBadge = (status: PublicationStatus) => {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-medium text-center";
  switch (status) {
    case 'Publicada':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Publicada</span>;
    case 'En proceso':
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>En proceso</span>;
    case 'Rechazada':
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rechazada</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Desconocido</span>;
  }
};

//=================================================================
// 6. COMPONENTE PRINCIPAL DE LA PÁGINA
//=================================================================
export default function TusPublicacionesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 60; // Como en la imagen

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Contenido Principal */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Encabezado */}
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Tus publicaciones
        </h1>
        <p className="text-center text-gray-600 mt-2 mb-10">
          Administra tus ofertas activas y haz seguimiento de cada una
        </p>

        {/* Contenedor de la lista */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          
          {/* Encabezados de la lista */}
          <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Oferta
            </h2>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Estado
            </h2>
          </div>

          {/* Items de la lista */}
          <div className="divide-y divide-gray-200">
            {mockPublications.map((pub) => (
              <div 
                key={pub.id} 
                className="grid grid-cols-2 gap-4 p-5 items-center hover:bg-gray-50 transition-colors"
              >
                {/* Título de la Oferta */}
                <p className="font-medium text-gray-900 truncate">
                  {pub.title}
                </p>
                
                {/* Estado */}
                <div>
                  {getStatusBadge(pub.status)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paginación */}
        <div className="mt-8 flex justify-end">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
