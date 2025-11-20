'use client';
//importaciones, que algunas puede que necesiten estar en hooks para separar la los renderizados
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { publicationService, OffererPublication } from '@/services/publicationService';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { buildLoginUrl } from '@/lib/auth';
import { ChevronLeft, ChevronRight } from 'lucide-react';

//=================================================================
// 4. COMPONENTE PAGINATION
//=================================================================
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1);
  return (
    <nav className="flex items-center justify-between text-sm">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"><ChevronLeft size={20} /></button>
      <div className="flex items-center gap-2 mx-2">
        {pages.map((page) => (<button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 rounded-md ${page === currentPage ? 'bg-indigo-600 text-white font-semibold' : 'text-gray-600 hover:bg-gray-200'}`}>{page}</button>))}
        {totalPages > 5 && <span className="px-2 py-1 text-gray-500">...</span>}
        {totalPages > 5 && <button onClick={() => onPageChange(totalPages)} className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-200">{totalPages}</button>}
      </div>
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"><ChevronRight size={20} /></button>
    </nav>
  );
};

//=================================================================
// 5. HELPER PARA EL BADGE DE ESTADO
//=================================================================
const getStatusBadge = (status: number) => {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-medium text-center";
  switch (status) {
    case 0: // Asumiendo 0 = Publicada
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Publicada</span>;
    case 1: // Asumiendo 1 = En Proceso
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>En proceso</span>;
    case 2: // Asumiendo 2 = Rechazada
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rechazada</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Desconocido</span>;
  }
};


//=================================================================
// 6. COMPONENTE PRINCIPAL DE LA PÁGINA
//    (Siguiendo el patrón de tu formulario)
export default function TusPublicacionesPage() {
  // Estados para la carga, los datos y el error, tal como en tu formulario.
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<OffererPublication[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para la paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();

  // ✅ PASO 1: Hook de efecto para verificar auth y cargar datos (combinados)
  useEffect(() => {
    // Definimos una función async interna para poder usar await
    const loadData = async () => {
      const token = Cookies.get('token');

      if (!token) {
        // Si no hay token, redirigir al login (mismo patrón que tu formulario)
        const currentPath = window.location.pathname + (window.location.search || '');
        window.location.href = buildLoginUrl(currentPath, 'login_required');
        router.replace(buildLoginUrl(currentPath, 'login_required'));
        return; // Detenemos la ejecución
      }

      // Si hay token, intentamos cargar los datos
      try {
        // Llamamos al servicio que especificaste
        const response = await publicationService.getOffererPublications(); // Devuelve AxiosResponse
        setPublications(response.data.data); // Accedemos a la data de la respuesta
        // Aquí podrías calcular el total de páginas si la API lo proveyera
        // setTotalPages(Math.ceil(response.data.total / response.data.pageSize));

      } catch (err) {
        // Manejo de errores de Axios (mismo patrón que tu formulario)
        if (err instanceof AxiosError) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            // El token es inválido o expiró, redirigir a login
            const currentPath = window.location.pathname + (window.location.search || '');
            window.location.href = buildLoginUrl(currentPath, 'session_expired');
            router.replace(buildLoginUrl(currentPath, 'session_expired'));
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
  }, [router]); // Se añade router a las dependencias


  // ✅ PASO 2: Mostrar estado de carga (exactamente como en tu formulario)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white p-4">
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
    <div className="bg-gray-50">
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

      <SiteFooter />
    </div>
  );
}

const SiteFooter = () => (
  <footer className="border-t border-gray-200 bg-white">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} Bolsa UCN. Todos los derechos reservados.</p>
    </div>
  </footer>
);