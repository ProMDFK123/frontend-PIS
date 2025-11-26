"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { offererPublicationService } from 'src/services/offererPublicationService';
import { buildLoginUrl } from 'src/lib/auth';
import { FormData } from 'src/models/generics';
import { ChevronLeft, ChevronRight } from "lucide-react";
import type {OffererPublication} from 'src/models/generics';
import FilterBar from "@/views/app/offerer/your-publications/components/filter-bar";
import { MyPublishedPublication } from '@/models/responses';

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
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex items-center gap-2 mx-2">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              page === currentPage
                ? "bg-indigo-600 text-white font-semibold"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        ))}
        {totalPages > 5 && <span className="px-2 py-1 text-gray-500">...</span>}
        {totalPages > 5 && (
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-1 rounded-md text-gray-600 hover:bg-gray-200"
          >
            {totalPages}
          </button>
        )}
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

const getStatusBadge = (status: number) => {
  const baseClasses = "px-4 py-2 rounded-full text-sm font-medium text-center";
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
  const [totalPages, setTotalPages] = useState(1);

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
        
        const response = await offererPublicationService.getMyPublishedPublications(); // Assuming response.data is ApiResponse<MyPublishedPublication>
        
        console.log("1. Respuesta completa:", response);
        console.log("2. Datos exactos:", response.data.data);
        
        setPublications(response.data.data);
      } catch (err) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            const currentPath = window.location.pathname + (window.location.search || "");
            window.location.href = buildLoginUrl(currentPath, "session_expired");
            return;
          }
          console.error("Error al cargar publicaciones:", err);
          setError("No se pudieron cargar tus publicaciones. Intenta de nuevo más tarde.");
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <svg className="animate-spin h-8 w-8 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg">Cargando publicaciones...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (error) return <div className="p-5 text-center text-red-600">{error}</div>;
    if (publications.length === 0) return <div className="p-5 text-center text-gray-500">No tienes publicaciones activas.</div>;

    return (
      <div className="divide-y divide-gray-200">
        {publications.map((pub) => (
          <div key={pub.idPublication} 
          onClick={() => router.push(`/offerer/create-publication/your-publications/${pub.idPublication}`)}
          className="grid grid-cols-2 gap-4 p-5 items-center hover:bg-gray-50 transition-colors">
            <p className="font-medium text-gray-900 truncate">{pub.title}</p>
            <div>{
            getStatusBadge(
              //pub.status
              3
              )
            }</div>
          </div>
        ))}
      </div>
    );
  };
  //  Id: number;
  //   UserId: number;
  //   Title: string;
  //   types: PublicationType; // "Trabajo" | "Voluntariado" | "CompraVenta"
  //   Description: string;
  //   PublicationDate: string; // Formato de fecha ISO, ej: "2023-10-27T10:00:00Z"
  //   Images: string[]; // Un arreglo de URLs de las imágenes
  //   IsActive: boolean;
  //   statusValidation: ValidationStatus;
  
    //  mypublished PublicationsDTO
    //     int IdPublication
    //     int UserId 
    //     string Title 
    //     Types types 
    //     string Description
    //     DateTime PublicationDate
    //     ICollection<Image> Images
    //     bool IsActive
    //     StatusValidation statusValidation

  return (
    <div className="bg-gray-50">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Tus publicaciones</h1>
        <p className="text-center text-gray-600 mt-2 mb-10">Administra tus ofertas activas y haz seguimiento de cada una</p>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-2 gap-4 p-5 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Oferta</h2>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Estado</h2>
          </div>

          {renderContent()}
        </div>

        <div className="mt-8 flex justify-end">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => setCurrentPage(page)} />
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
