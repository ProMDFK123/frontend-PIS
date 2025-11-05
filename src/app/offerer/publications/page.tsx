'use client'; // Necesario para hooks como useState (para paginación)

import { useState } from 'react';
import Navbar from '../../../components/offerer/navbar';
import Footer from '../../../components/offerer/footer';



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
      </main>

      <Footer />
    </div>
  );
}