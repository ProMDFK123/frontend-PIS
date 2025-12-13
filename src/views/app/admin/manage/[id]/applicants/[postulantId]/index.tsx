"use client";

import { ChevronLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApplicantCard } from "./components/applicant-card";
import { ApplicantInfoForm } from "./components/applicant-info-form";
import { useAdminPostulantDetail } from "./hooks/use-applicant-detail";
// Importar el skeleton (asegúrate de haberlo creado como te mostré antes)
import { ApplicantDetailSkeleton } from "./components/applicant-detail-skeleton";

export default function ApplicantDetailView({
  id,
  postulantId,
}: {
  id: string;
  postulantId: string;
}) {
  const router = useRouter();

  const { postulant, loading, error, handleRetry } =
    useAdminPostulantDetail(postulantId);

  const backRoute = `/admin/publications/manage/${id}/applicants`;

  // 1. Loading State con Skeleton
  if (loading || !postulant) {
    return (
      <div className="flex flex-col min-h-screen relative bg-slate-900 overflow-hidden">
         {/* Fondo Morado Fixed */}
         <div className="fixed inset-0 z-0 pointer-events-none">
             <img src="/fondo.png" alt="Fondo" className="w-full h-full object-cover opacity-60"/>
             <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-purple-800/90 to-fuchsia-800/80 mix-blend-hard-light" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-purple-950/90" />
         </div>
         <ApplicantDetailSkeleton />
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 relative">
         <div className="absolute inset-0 bg-gradient-to-br from-violet-900 to-slate-900" />
         <div className="relative z-10 max-w-xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] text-center text-white shadow-2xl">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold mb-2">Error al cargar información</h2>
            <p className="text-white/80 mb-6">{error.message}</p>
            <button
              onClick={() => handleRetry()}
              className="px-6 py-3 bg-white text-purple-900 rounded-full font-bold hover:bg-purple-100 transition shadow-lg"
            >
              Reintentar
            </button>
         </div>
      </div>
    );
  }

  // 3. Contenido Principal
  return (
    <div className="flex flex-col min-h-screen relative text-white selection:bg-pink-500 selection:text-white overflow-hidden bg-slate-900">
      
      {/* Fondo Morado Fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <img src="/fondo.png" alt="Fondo" className="w-full h-full object-cover opacity-60"/>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/90 via-purple-800/90 to-fuchsia-800/80 mix-blend-hard-light" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-purple-950/90" />
      </div>

      <main className="flex-grow container mx-auto px-4 py-6 relative z-10">
        <button
          onClick={() => router.push(backRoute)}
          className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all font-bold text-sm backdrop-blur-sm border border-white/10"
        >
          <ChevronLeft className="h-4 w-4" /> Volver
        </button>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight drop-shadow-lg mb-6">
          Detalles del Postulante
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card Izquierda: Avatar y Acciones */}
          {/* AQUÍ ESTA LA MAGIA: Forzamos 'text-slate-900' para que el texto sea oscuro dentro de la tarjeta blanca */}
          <div className="col-span-1 bg-white text-slate-900 rounded-xl shadow-xl overflow-hidden border-4 border-transparent p-1">
            <ApplicantCard postulant={postulant} />
          </div>

          {/* Formulario Derecha */}
          {/* AQUÍ TAMBIÉN: 'text-slate-900' para resetear el color del texto */}
          <div className="col-span-2 bg-white text-slate-900 rounded-xl shadow-xl overflow-hidden p-1">
            <ApplicantInfoForm postulant={postulant} />
          </div>
        </div>
      </main>
    </div>
  );
}