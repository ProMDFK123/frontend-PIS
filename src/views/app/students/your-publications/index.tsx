// src/views/app/students/your-publications/index.tsx

"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { studentPublicationService } from '@/services/studentsPublicationService'; // Usamos el servicio de ESTUDIANTE
import { buildLoginUrl, handleApiError, cn } from 'src/lib';
import { 
    ChevronLeft, ChevronRight, Settings2, AlertCircle, ClockIcon, Briefcase, 
    ShoppingBag, Heart, ArrowLeft, Search, ListFilter, ArrowUpDown, ArrowRight 
} from "lucide-react";
import { MyPublishedPublication } from '@/models/responses';
import { Button } from '@/components/ui/Button';
import { NotificationBanner } from "@/components/ui/notification"; 
import { useNotification } from "@/hooks/common/use-notification"; 
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';

// Componentes y Hook de Estudiante (Asegurarse de que están exportados por defecto)
// Importación por defecto
import OfferCard from '@/components/offers/OfferCard'; // Importación por defecto
import FilterBar from './components/filter-bar'; // Importación por defecto

// Cantidad de elementos por página
const ITEMS_PER_PAGE = 9; 

// --- Constantes de Filtro y Mapeo (Copiadas de la versión de Oferente) ---

const PUBLICATION_TYPES = [
    { value: 0, text: "Oferta de Trabajo", icon: Briefcase, iconClass: "text-indigo-500", bg: "bg-indigo-100", textCol: "text-indigo-800" },
    { value: 1, text: "Compra/Venta", icon: ShoppingBag, iconClass: "text-purple-500", bg: "bg-purple-100", textCol: "text-purple-800" },
    { value: 2, text: "Voluntariado", icon: Heart, iconClass: "text-pink-500", bg: "bg-pink-100", textCol: "text-pink-800" },
];

const PUBLICATION_STATUS = [
    { value: 0, text: "Activa", classes: "bg-green-100 text-green-700 border-green-200" },
    { value: 1, text: "Pendiente", classes: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { value: 2, text: "Rechazada", classes: "bg-red-100 text-red-700 border-red-200" },
];

type SortType = "recientes" | "titulo";

// --- Componentes auxiliares (Adaptados del Oferente) ---

const getPublicationTypeInfo = (type: number) => {
    return PUBLICATION_TYPES.find(t => t.value === type) || { text: "Otro", icon: Briefcase, iconClass: "text-gray-500", bg: "bg-gray-100", textCol: "text-gray-800" };
};

const getStatusBadge = (status: number) => {
  const baseClasses = "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border";
  const info = PUBLICATION_STATUS.find(s => s.value === status) || { text: "Desconocido", classes: "bg-gray-100 text-gray-800" };
  return { text: info.text, classes: `${baseClasses} ${info.classes}` };
};

interface PublicationCardProps {
    pub: MyPublishedPublication;
    onClick: () => void;
}

// Card Full Width (Copiada del diseño de Oferente)
const PublicationCard = ({ pub, onClick }: PublicationCardProps) => {
    const statusInfo = getStatusBadge(pub.statusValidation);
    const typeInfo = getPublicationTypeInfo(pub.types);
    const date = pub.publicationDate && new Date(pub.publicationDate).getTime() > 0
        ? new Date(pub.publicationDate).toLocaleDateString("es-CL")
        : "—";

    return (
        <article 
            onClick={onClick}
            className={cn(
                "group relative flex items-center justify-between p-6 rounded-[2rem] transition-all duration-300 cursor-pointer w-full",
                "bg-white text-slate-800 shadow-xl", 
                "hover:scale-[1.01] hover:shadow-2xl hover:bg-white", 
                "border-4 border-transparent hover:border-purple-300" 
            )}
        >
            <div className="flex-1 min-w-0 pr-6">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                    {/* Badge de Tipo con Icono */}
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${typeInfo.bg}`}>
                        <typeInfo.icon className={`w-4 h-4 ${typeInfo.iconClass}`} />
                        <span className={`text-xs font-black uppercase tracking-wider ${typeInfo.textCol}`}>
                            {typeInfo.text}
                        </span>
                    </div>

                    {/* Badge de Estado */}
                    <div className={statusInfo.classes}>
                        {statusInfo.text}
                    </div>
                </div>
                
                {/* Título Grande que ocupa el espacio */}
                <h3 className="font-black text-2xl md:text-3xl text-slate-900 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all mb-1">
                    {pub.title || "Sin título"}
                </h3>

                {/* Fecha */}
                <div className="flex items-center gap-2 text-slate-400 pl-1">
                    <ClockIcon className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">Publicado el {date}</span>
                </div>
            </div>

            {/* Botón Flecha a la derecha */}
            <div className="flex items-center pl-4 border-l border-slate-100">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300 shadow-sm">
                    <ArrowRight className="text-slate-400 w-6 h-6 group-hover:text-white transition-colors duration-300" />
                </div>
            </div>
        </article>
    );
};

// Skeleton Horizontal Full Width (Copiado del diseño de Oferente)
const CardSkeleton = () => (
    <div className="w-full relative flex items-center justify-between p-6 rounded-[2rem] bg-white shadow-xl border-4 border-transparent overflow-hidden animate-pulse h-[130px]">
        <div className="flex-1 space-y-3">
             <div className="flex gap-2">
                <Skeleton className="h-6 w-32 rounded-full bg-slate-200" />
                <Skeleton className="h-6 w-20 rounded-full bg-slate-200" />
             </div>
             <Skeleton className="h-9 w-1/2 rounded-lg bg-slate-200" />
             <Skeleton className="h-4 w-40 rounded-lg bg-slate-200" />
        </div>
        <div className="pl-4 border-l border-slate-100">
            <Skeleton className="h-12 w-12 rounded-full bg-slate-200" />
        </div>
    </div>
);


// --- Main Component ---

export default function StudentYourPublicationsView() {
  const [isLoading, setIsLoading] = useState(true);
  const [publications, setPublications] = useState<MyPublishedPublication[]>([]);
  const [error, setError] = useState<string | null>(null);

  // --- Estados de Filtro y Ordenamiento ---
  const [filterStatus, setFilterStatus] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<number | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState<SortType>('recientes'); 
  
  // --- Estados de Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { notification, isVisible, show, close } = useNotification();


  // NOTA: Usamos el hook de Estudiante para obtener y filtrar la data.
  // Sin embargo, si quieres mantener la lógica de filtros y paginación en este componente (como en el de oferente), 
  // necesitamos cargar los datos crudos aquí, similar al oferente.

  const loadData = useCallback(async () => {
      const token = Cookies.get("token");
      if (!token) {
        const currentPath = window.location.pathname + (window.location.search || "");
        // Redirección adaptada para la ruta de estudiante (asumiendo que /offerer es incorrecto aquí)
        window.location.href = buildLoginUrl(currentPath, "login_required"); 
        return;
      }

      try {
        const [publishedRes, rejectedRes, pendingRes] = await Promise.all([
          studentPublicationService.getMyPublishedPublications(), // USAMOS EL SERVICIO DE ESTUDIANTE
          studentPublicationService.getMyRejectedPublications(),   // USAMOS EL SERVICIO DE ESTUDIANTE
          studentPublicationService.getPMyPendingPublications(),    // USAMOS EL SERVICIO DE ESTUDIANTE
        ]);

        const published = publishedRes.data.data || [];
        const rejected = rejectedRes.data.data || [];
        const pending = pendingRes.data.data || [];

        // Combinamos y asignamos el statusValidation basado en el origen
        const allPublications = [
          ...published.map(p => ({ ...p, statusValidation: 0 })), // 0: Activa/Publicada
          ...pending.map(p => ({ ...p, statusValidation: 1 })),   // 1: Pendiente/En Proceso
          ...rejected.map(p => ({ ...p, statusValidation: 2 }))   // 2: Rechazada
        ];
        
        setPublications(allPublications);

      } catch (err) {
        const apiErrorDetails = handleApiError(err).details;
        setError(apiErrorDetails || "No se pudieron cargar tus publicaciones.");
      } finally {
        setIsLoading(false);
      }
    }, [setError, setIsLoading, setPublications]);
    
  useEffect(() => {
    const successParam = searchParams.get("success");
    const closeNotificationParam = searchParams.get("notification");

    let notificationProcessed = false;
    
    if (successParam === "true") {
      show(
        "¡Publicación Enviada!",
        "Tu oferta ha sido enviada con éxito y está en proceso de revisión.",
        "success"
      );
      router.replace("/students/your-publications", { scroll: false }); // RUTA CORREGIDA
      notificationProcessed = true;
    }
    else if (closeNotificationParam === "closed") {
      show(
        "Publicación Cerrada",
        "La publicación ha sido cerrada y ya no está disponible para postulaciones.",
        "success"
      );
      router.replace("/students/your-publications", { scroll: false }); // RUTA CORREGIDA
      notificationProcessed = true;
    }
    
    if (!notificationProcessed) {
        loadData();
    } else {
        // Recargar datos después de mostrar la notificación y reemplazar la URL
        const timeout = setTimeout(loadData, 100); 
        return () => clearTimeout(timeout);
    }
    
  }, [router, searchParams, show, loadData]);

  
  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setCurrentPage(1);
    loadData();
  }

  const clearFilters = useCallback(() => {
    setFilterStatus('all');
    setFilterType('all');
    setSearchTerm('');
    setSort('recientes'); 
    setCurrentPage(1); 
  }, []);

  // --- LÓGICA DE FILTRADO Y ORDENAMIENTO (Copiada del Oferente) ---
  const filteredPublications = useMemo(() => {
    let filtered = publications;

    if (filterStatus !== 'all') {
      filtered = filtered.filter(pub => pub.statusValidation === filterStatus);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(pub => pub.types === filterType);
    }

    if (searchTerm.trim() !== '') {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(pub => 
        pub.title?.toLowerCase().includes(lowerCaseSearchTerm) ||
        false 
      );
    }

    filtered.sort((a, b) => {
        if (sort === 'recientes') {
            return new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime();
        }
        if (sort === 'titulo') {
            const titleA = a.title || "";
            const titleB = b.title || "";
            return titleA.localeCompare(titleB);
        }
        return 0;
    });

    return filtered;
  }, [publications, filterStatus, filterType, searchTerm, sort]);


  // --- LÓGICA DE PAGINACIÓN ---
  const totalPages = Math.ceil(filteredPublications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPublications = filteredPublications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const renderPagination = () => {
      if (totalPages <= 1) return null;
      return (
        <nav className="flex items-center justify-between text-sm gap-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-white/20 text-white hover:bg-white/30 border-white/50"
          >
            <ChevronLeft size={16} /> Anterior
          </Button>
          
          <span className="text-white font-medium text-sm">
            Página {currentPage} de {totalPages}
          </span>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-white/20 text-white hover:bg-white/30 border-white/50"
          >
            Siguiente <ChevronRight size={16} />
          </Button>
        </nav>
      );
  };
  
  const handleViewDetail = (pub: MyPublishedPublication) => {
      // RUTA DE DETALLE CORREGIDA PARA ESTUDIANTE
      router.push(`/students/your-publications/${pub.idPublication}?type=${pub.types}&status=${pub.statusValidation}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <section className="mt-8 flex flex-col gap-6 pb-20">
            {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
            ))}
        </section>
      );
    }

    if (error) { 
        return (
            <div className="flex justify-center items-center p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] mx-5 text-white shadow-2xl">
              <div className="text-center">
                <AlertCircle className="h-10 w-10 mx-auto mb-4 text-purple-300" />
                <div className="font-extrabold text-xl mb-2">Error de conexión</div>
                <div className="text-white/80 mb-4">{error}</div>
                <Button onClick={handleRetry} className="bg-white text-purple-900 hover:bg-purple-100 rounded-full font-bold px-6">
                  Reintentar
                </Button>
              </div>
            </div>
        );
    }

    if (filteredPublications.length === 0) {
        return (
            <div className="mt-12 p-12 text-center bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 text-white shadow-xl w-full">
              <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Settings2 className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-2">Sin resultados</h3>
              <p className="text-lg text-purple-200">No hay publicaciones que coincidan con los filtros seleccionados.</p>
              {publications.length > 0 && ( 
                <Button onClick={clearFilters} className="mt-4 bg-yellow-400 text-slate-900 hover:bg-yellow-300 rounded-full font-bold px-6">
                    Limpiar Filtros
                </Button>
              )}
            </div>
        );
    }
    
    return (
        <>
            {/* Lista Vertical Full Width: Usamos flex-col para apilar */}
            <section className="mt-8 flex flex-col gap-6 pb-12 w-full">
                {currentPublications.map((pub) => (
                    <PublicationCard
                        key={pub.idPublication}
                        pub={pub}
                        onClick={() => handleViewDetail(pub)}
                    />
                ))}
            </section>
            
            {/* Pagination */}
            {filteredPublications.length > 0 && (
                <div className="mt-8 flex justify-center sm:justify-end">
                    {renderPagination()}
                </div>
            )}
        </>
    );
  };


  return (
    <div className="flex flex-col min-h-screen relative text-white selection:bg-pink-500 selection:text-white bg-slate-900">
                
        {/* Fondo Fixed */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            <img 
                src="/fondo.png" 
                alt="Fondo UCN" 
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-purple-800/90 to-fuchsia-800/80 mix-blend-hard-light" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-purple-950/90" />
        </div>
        
        {/* Notification Banner */}
        <NotificationBanner data={notification} isVisible={isVisible} onClose={close} />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 max-w-7xl">
            <header className="mb-10">
                <Link href="/students"> {/* RUTA CORREGIDA */}
                    <button className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all font-bold text-sm backdrop-blur-sm border border-white/10">
                        <ArrowLeft className="h-4 w-4" />
                        Volver al Dashboard
                    </button>
                </Link>
                
                <div className="flex flex-col items-start gap-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider shadow-lg transform rotate-1">
                        <Settings2 className="w-3.5 h-3.5" /> Panel del Estudiante
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight drop-shadow-lg leading-tight mt-2">
                        Mis <br className="md:hidden"/> Publicaciones
                    </h1>
                    <p className="text-purple-100 text-lg md:text-xl font-medium mt-3 drop-shadow-md">
                        Tienes un total de <span className="text-yellow-300 font-black text-2xl align-middle">{publications.length}</span> publicaciones registradas.
                    </p>
                </div>
            </header>
            
            {/* Componente de Filtro (Diseño Oferente, adaptado a props) */}
            <FilterBar 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                filterType={filterType}
                setFilterType={setFilterType}
                sort={sort}
                setSort={setSort}
                clearFilters={clearFilters}
            />

            {/* Contenido Principal */}
            {renderContent()}
            
        </main>
    </div>
  );
}