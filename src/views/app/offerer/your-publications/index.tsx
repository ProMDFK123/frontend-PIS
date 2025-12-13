"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { offererPublicationService } from 'src/services/offererPublicationService';
import { buildLoginUrl } from 'src/lib/auth';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MyPublishedPublication } from '@/models/responses';

// Cantidad de elementos por página
const ITEMS_PER_PAGE = 5;

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;
  // Lógica segura para generar botones de página
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    // Lógica simple de ventana deslizante o estática (ajustar si quieres que se mueva)
    if (totalPages <= 5) return i + 1;
    // Si hay muchas páginas, esto se puede mejorar, por ahora lo dejo simple 1-5
    return i + 1; 
  });

  return (
    <nav className="flex items-center justify-between text-sm gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-gray-600">
        Página {currentPage} de {totalPages}
      </span>

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

const getStatusBadge = (status: number) => {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-medium text-center inline-block";
  switch (status) {
    case 0:
      return <span className={`${baseClasses} bg-green-100 text-green-800`}>Publicada</span>;
    case 1:
      return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>En proceso</span>;
    case 2:
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Rechazada</span>;
    default:
      return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Desconocido</span>;
  }
};

export default function YourPublicationsView() {
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<MyPublishedPublication[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  // Total pages se calcula dinámicamente, no necesitamos state si calculamos al renderizar, 
  // pero para consistencia con tu código lo dejaremos calculado.
  
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        const currentPath = window.location.pathname + (window.location.search || "");
        window.location.href = buildLoginUrl(currentPath, "login_required");
        return;
      }

      try {
        const [publishedRes, rejectedRes, pendingRes] = await Promise.all([
          offererPublicationService.getMyPublishedPublications(),
          offererPublicationService.getMyRejectedPublications(),
          offererPublicationService.getPMyPendingPublications(),
        ]);

        const published = publishedRes.data.data || [];
        const rejected = rejectedRes.data.data || [];
        const pending = pendingRes.data.data || [];

        const allPublications = [...published, ...rejected, ...pending];
        
        // Ordenar por fecha (opcional, pero recomendado)
        // allPublications.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());

        console.log("Total de publicaciones:", allPublications);
        setPublications(allPublications);

      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            const currentPath = window.location.pathname + (window.location.search || "");
            window.location.href = buildLoginUrl(currentPath, "session_expired");
            return;
          }
          console.error("Error de API:", err);
          setError("No se pudieron cargar tus publicaciones.");
        } else {
          console.error("Error inesperado:", err);
          setError("Ocurrió un error inesperado.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // --- LÓGICA DE PAGINACIÓN ---
  const totalPages = Math.ceil(publications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPublications = publications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  // ----------------------------

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-indigo-600 p-4">
           {/* Loader simple */}
           <p className="text-lg font-semibold">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (error) return <div className="p-5 text-center text-red-600">{error}</div>;
    if (publications.length === 0) return <div className="p-5 text-center text-gray-500">No tienes publicaciones activas.</div>;

    return (
      <div className="divide-y divide-gray-200">
        {/* ✅ USAMOS currentPublications EN LUGAR DE publications */}
        {currentPublications.map((pub, index) => (
          <div 
            key={`${pub.idPublication}-${index}`}
            // ✅ CORRECCIÓN AQUÍ: Usamos pub.idPublication y pub.offerType
            onClick={() => router.push(`/offerer/your-publications/${pub.idPublication}?type=${pub.types}&status=${pub.statusValidation}`)}
            className="grid grid-cols-2 gap-4 p-5 items-center hover:bg-indigo-50 transition-colors cursor-pointer group"
          >
            <p className="font-medium text-gray-900 truncate group-hover:text-indigo-700">
                {pub.title}
            </p>
            <div className="flex justify-end sm:justify-start">
                {getStatusBadge(pub.statusValidation)}
            </div>
          </div> 
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Tus publicaciones</h1>
        <p className="text-center text-gray-600 mt-2 mb-10">Administra tus ofertas activas y haz seguimiento de cada una</p>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Oferta</h2>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider text-right sm:text-left">Estado</h2>
          </div>

          {renderContent()}
        </div>

        {/* Solo mostramos paginación si hay items */}
        {publications.length > 0 && (
            <div className="mt-8 flex justify-center sm:justify-end">
            <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={(page) => setCurrentPage(page)} 
            />
            </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

const SiteFooter = () => (
  <footer className="border-t border-gray-200 bg-white mt-auto">
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
      <p>© {new Date().getFullYear()} Bolsa UCN. Todos los derechos reservados.</p>
    </div>
  </footer>
);