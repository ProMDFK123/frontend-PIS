"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, AlertCircle, Users } from "lucide-react";
import { handleApiError } from "@/lib";
import { useGetApplicantsView } from "./hooks/use-get-applicants-view";
import { ViewAppplicantsForAdmin } from "@/models/responses";
import ApplicantCard from "./components/applicant-card";
import ApplicantFilterBar from "./components/view-applicants-filter-bar";
// 1. Importar el nuevo skeleton
import { ApplicantListSkeleton } from "./components/applicant-list-skeleton";

export interface ApplicantsViewProps {
  id: string;
  publicationTitle?: string;
}

export default function ApplicantsView({ id }: ApplicantsViewProps) {
  const router = useRouter();
  const backRoute = `/admin/publications/manage/${id}`;
  
  const {
    applicants,
    isLoading,
    error,
    refetch,
    totalCount,
    filterState,
  } = useGetApplicantsView(id);

  const { filterType, setFilterType, text, setText } = filterState;

  const handleViewDetail = (applicantId: number) => {
    router.push(`/admin/publications/manage/${id}/applicants/${applicantId}`);
  };

  const renderContent = () => {
    // 2. Loading State con Skeleton
    if (isLoading) {
      return <ApplicantListSkeleton />;
    }

    // Error State
    if (error) {
      const errorDetails =
        handleApiError(error as unknown as Error).details || "Error desconocido.";
      return (
        <div className="max-w-xl mx-auto p-8 mt-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] text-center text-white shadow-2xl">
          <div className="flex justify-center mb-4">
             <AlertCircle className="w-12 h-12 text-purple-300" />
          </div>
          <h2 className="text-xl font-bold mb-2">Error al cargar postulantes</h2>
          <p className="text-white/80 mb-6">{errorDetails}</p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-white text-purple-900 rounded-full font-bold hover:bg-purple-100 transition shadow-lg"
          >
            Reintentar
          </button>
        </div>
      );
    }

    // Empty State
    if (totalCount === 0) {
      return (
        <div className="mt-12 p-12 text-center bg-white/10 backdrop-blur-md rounded-[2.5rem] border border-white/20 text-white shadow-xl">
          <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-black mb-2">Sin postulantes</h3>
          <p className="text-lg text-purple-200">No hay postulantes registrados para esta publicación aún.</p>
        </div>
      );
    }

    // Data State
    return (
      <div className="mt-6 space-y-4 pb-20">
        {applicants.map((applicant: ViewAppplicantsForAdmin) => (
          <ApplicantCard
            key={applicant.id}
            applicant={applicant}
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen relative text-white selection:bg-pink-500 selection:text-white overflow-hidden bg-slate-900">
      
      {/* 3. Fondo Morado Fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <img src="/fondo.png" alt="Fondo" className="w-full h-full object-cover opacity-60"/>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-purple-800/90 to-fuchsia-800/80 mix-blend-hard-light" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-purple-950/90" />
      </div>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <header className="mb-8">
            <button
                onClick={() => router.push(backRoute)}
                className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all font-bold text-sm backdrop-blur-sm border border-white/10"
            >
                <ChevronLeft className="h-4 w-4" />
                Volver al Detalle
            </button>

            <div className="flex flex-col gap-2">
                <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                    <Users className="w-3 h-3" /> Gestión de Talento
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg leading-tight">
                    Postulantes de la oferta
                </h1>
                <p className="text-purple-100 text-lg font-medium mt-1 drop-shadow-md">
                    Gestionando <span className="text-yellow-300 font-black">{totalCount}</span> postulaciones activas.
                </p>
            </div>
        </header>

        {/* Filter Bar */}
        <div className="mb-8">
            <ApplicantFilterBar
                text={text}
                setText={setText}
                filterType={filterType}
                setFilterType={setFilterType}
            />
        </div>

        {renderContent()}
      </main>
    </div>
  );
}