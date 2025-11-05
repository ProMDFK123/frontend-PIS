// src/app/publicaciones/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
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
// 1. MOCKS DE SERVICIO Y TIPOS
// (En tu app real, importarías esto desde tus archivos reales)
//=================================================================
type PublicationStatus = 'Publicada' | 'En proceso' | 'Rechazada' | string;

interface OffererPublication {
  id: string | number;
  title: string;
  status: PublicationStatus;
}

// Simula una llamada a la API
const mockApiGet = (url: string): Promise<{ data: { data: OffererPublication[] } }> => {
  console.log(`Mock API call to: ${url}`);
  // Simular un token válido
  if (Cookies.get('token') === 'mi-token-secreto') {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            data: [
              { id: 1, title: 'Apoyo en feria UCN', status: 'Publicada' },
              { id: 2, title: 'Voluntariado en la UCN', status: 'Publicada' },
              { id: 3, title: 'Promotor para Festival cultural de musica', status: 'En proceso' },
              { id: 4, title: 'Vendo PS4 (Semi-nueva)', status: 'Publicada' },
              { id: 5, title: 'Venta de Notebook ASUS ROG', status: 'Rechazada' },
            ]
          }
        });
      }, 1500); // Simula 1.5 segundos de carga
    });
  } else {
    // Simular un error 401 si el token es inválido
    return Promise.reject(new AxiosError('No autorizado', '401', undefined, undefined, { status: 401 } as any));
  }
};

// Este es el servicio que proporcionaste, usando el mock
const publicationService = {
  async getOffererPublications(): Promise<{ data: OffererPublication[] }> {
    // Tu servicio espera un objeto { data: [...] }
    const response = await mockApiGet("/publications/my-published");
    return response.data; // Devuelve { data: OffererPublication[] }
  }
};

// Mock de tu función de autenticación
const buildLoginUrl = (path: string, reason: string) => {
  console.log(`Redirigiendo a login. Razón: ${reason}, Redirigir a: ${path}`);
  return `/login?callbackUrl=${path}&reason=${reason}`;
};
// --- FIN DE MOCKS ---


//=================================================================
// 2. COMPONENTE NAVBAR
//=================================================================
const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm" style={{ backgroundColor: '#3a539b' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold text-white">BolsaUCN</h1>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
            <a href="#" className="text-gray-200 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">Inicio</a>
            <a href="#" className="text-gray-200 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">Explorar</a>
            <a href="#" className="text-gray-200 hover:text-white inline-flex items-center px-1 pt-1 text-sm font-medium">Historial</a>
          </div>
          <div className="flex items-center">
            <a href="#" className="text-sm font-medium text-white bg-blue-500 rounded-full px-4 py-2 flex items-center gap-2 transition-colors" style={{ backgroundColor: '#4a90e2' }}>
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
// 3. COMPONENTE FOOTER
//=================================================================
const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Bolsa UCN</h3>
            <div className="flex space-x-5 text-gray-500">
              <a href="#" className="hover:text-gray-700"><Facebook size={20} /></a>
              <a href="#" className="hover:text-gray-700"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-gray-700"><Youtube size={20} /></a>
              <a href="#" className="hover:text-gray-700"><Instagram size={20} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-3">Navegación</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Inicio</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Ofertas</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Publicar</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-3">Ayuda</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">FAQ</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Contacto</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Soporte</a></li>
            </ul>
          </div>
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
// 4. COMPONENTE PAGINATION
//=================================================================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);
  return (
    <nav className="flex items-center justify-between text-sm">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"><ChevronLeft size={20} /></button>
      <div className="flex items-center gap-2 mx-2">
        {pages.map((page) => (<button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 rounded-md ${page === currentPage ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}>{page}</button>))}
        <span className="px-2 py-1 text-gray-500">...</span>
        <button onClick={() => onPageChange(60)} className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-200">60</button>
      </div>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"><ChevronRight size={20} /></button>
    </nav>
  );
};

//=================================================================
// 5. HELPER PARA EL BADGE DE ESTADO
//=================================================================
const getStatusBadge = (status: PublicationStatus) => {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-medium text-center";
  switch (status.toLowerCase()) {
    case 'publicada':
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Publicada</span>;
    case 'en proceso':
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>En proceso</span>;
    case 'rechazada':
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rechazada</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{status}</span>;
  }
};


//=================================================================
// 6. COMPONENTE PRINCIPAL DE LA PÁGINA
//    (Siguiendo el patrón de tu formulario)
//=================================================================
export default function TusPublicacionesPage() {
  const router = useRouter();
  
  // Estados para la carga, los datos y el error, tal como en tu formulario.
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<OffererPublication[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 60; // Como en la imagen

  // ✅ PASO 1: Hook de efecto para verificar auth y cargar datos (combinados)
  useEffect(() => {
    // Definimos una función async interna para poder usar await
    const loadData = async () => {
      const token = Cookies.get('token');

      if (!token) {
        // Si no hay token, redirigir al login (mismo patrón que tu formulario)
        const currentPath = window.location.pathname;
        window.location.href = buildLoginUrl(currentPath, 'login_required');
        return; // Detenemos la ejecución
      }

      // Si hay token, intentamos cargar los datos
      try {
        // Llamamos al servicio que especificaste
        const response = await publicationService.getOffererPublications();
        
        // Tu servicio devuelve { data: [...] }, así que accedemos a response.data
        setPublications(response.data);

      } catch (err) {
        // Manejo de errores de Axios (mismo patrón que tu formulario)
        if (err instanceof AxiosError) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            // El token es inválido o expiró, redirigir a login
            const currentPath = window.location.pathname;
            window.location.href = buildLoginUrl(currentPath, 'session_expired');
          } else {
            // Otro error de servidor (404, 500, etc.)
            console.error('Error al cargar publicaciones:', err);
            setError('No se pudieron cargar tus publicaciones. Intenta de nuevo más tarde.');
          }
        } else {
          // Error inesperado
          console.error('Error inesperado:', err);
          setError('Ocurrió un error inesperado.');
        }
      } finally {
        // Ocultamos el spinner de carga (mismo patrón que tu formulario)
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // El array vacío asegura que esto se ejecute solo una vez


  // ✅ PASO 2: Mostrar estado de carga (exactamente como en tu formulario)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <svg className="animate-spin h-8 w-8 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {/* Cambiamos el texto para que coincida con lo que estamos haciendo */}
          <p className="text-lg">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  // Función para renderizar el contenido principal (lista, error o vacío)
  const renderContent = () => {
    if (error) {
      return <div className="p-5 text-center text-red-600">{error}</div>;
    }

    if (publications.length === 0) {
      return <div className="p-5 text-center text-gray-500">No tienes publicaciones activas.</div>
    }

    // Si todo está bien, muestra la lista
    return (
      <div className="divide-y divide-gray-200">
        {publications.map((pub) => (
          <div 
            key={pub.id} 
            className="grid grid-cols-2 gap-4 p-5 items-center hover:bg-gray-50 transition-colors"
          >
            <p className="font-medium text-gray-900 truncate">
              {pub.title}
            </p>
            <div>
              {getStatusBadge(pub.status)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ✅ PASO 3: Mostrar la página completa una vez que isLoading es false
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Tus publicaciones
        </h1>
        <p className="text-center text-gray-600 mt-2 mb-10">
          Administra tus ofertas activas y haz seguimiento de cada una
        </p>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Oferta
            </h2>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Estado
            </h2>
          </div>
          
          {/* Aquí se renderiza el contenido (error, vacío o la lista) */}
          {renderContent()}

        </div>

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