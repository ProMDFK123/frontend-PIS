"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { useAdminPublicationDetailView } from "./hooks/use-manage-detail-view";
import { handleApiError, getPresentationType } from "@/lib";
import { ManageDetailSection } from "./components/manage-detail-section";
import { ManageProfileSection } from "./components/manage-profile-section";
import { ConfirmDialog } from "@/components/ui";
import { toast } from "sonner";
import { ManageDetailSkeleton } from "./components/manage-detail-skeleton";

export interface ManageDetailViewProps {
  id: string;
}

export default function ManageDetailView({ id }: ManageDetailViewProps) {
  const router = useRouter();
  const { detail, loading, error, isMutating, handleAction, handleRetry } =
    useAdminPublicationDetailView(id);

  const backRoute = "/admin/publications/manage";
  const [isCloseDialogOpen, setIsCloseDialogOpen] = useState(false);

  const handleCloseConfirm = async () => {
    setIsCloseDialogOpen(false);
    const toastId = toast.loading("Cerrando publicación...");
    try {
      await handleAction("close_publication");
      toast.dismiss(toastId);
      router.push(`${backRoute}?notification=closed`);
    } catch (e) {
      toast.error("Error al cerrar publicación", {
        id: toastId,
        description: "No se pudo completar la acción. Revisa la consola.",
      });
    }
  };

  // 1. ESTADO DE CARGA: Skeleton con Fondo Morado
  if (loading || !detail) {
    return (
      <div className="flex flex-col min-h-screen relative text-white selection:bg-pink-500 selection:text-white overflow-hidden bg-slate-900">
         {/* Fondo */}
         <div className="absolute inset-0 z-0">
             <img src="/fondo.png" alt="Fondo UCN" className="w-full h-full object-cover opacity-60"/>
             <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-purple-800/90 to-fuchsia-800/80 mix-blend-hard-light" />
             <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-purple-950/90" />
         </div>
         {/* Skeleton */}
         <ManageDetailSkeleton />
      </div>
    );
  }

  // 2. ESTADO DE ERROR (Con diseño integrado)
  if (error) {
    const errorDetails = error
      ? handleApiError(error).details || error
      : "Error desconocido.";
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 relative">
         <div className="absolute inset-0 bg-gradient-to-br from-violet-900 to-slate-900" />
         
         <div className="relative z-10 max-w-xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] text-center text-white shadow-2xl">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-2xl font-bold mb-2">Error al cargar</h2>
            <p className="text-white/80 mb-6">{errorDetails}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-white text-purple-900 rounded-full font-bold hover:bg-purple-100 transition shadow-lg"
            >
              Reintentar
            </button>
         </div>
      </div>
    );
  }

  // 3. VISTA PRINCIPAL (Con el nuevo diseño)
  return (
    <div className="flex flex-col min-h-screen relative text-white selection:bg-pink-500 selection:text-white overflow-hidden bg-slate-900">
      
      {/* Fondo Morado Continuo */}
      <div className="absolute inset-0 z-0">
          <img src="/fondo.png" alt="Fondo UCN" className="w-full h-full object-cover opacity-60"/>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-purple-800/90 to-fuchsia-800/80 mix-blend-hard-light" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-purple-950/90" />
      </div>

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        
        {/* Header Flotante */}
        <header className="mb-8">
          <button
            onClick={() => router.push(backRoute)}
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all font-bold text-sm backdrop-blur-sm border border-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al Panel
          </button>

          <div className="flex flex-col gap-2">
             <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                <Sparkles className="w-3 h-3" />
                {getPresentationType(detail.type)}
             </div>
             <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg leading-tight">
                {detail.title || "Sin Título"}
             </h1>
          </div>
        </header>

        {/* Tarjeta Principal Blanca (Contenedor del contenido existente) */}
        <div className="bg-white text-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                
                {/* Columna Izquierda: Información Principal */}
                <div className="w-full md:w-3/4 space-y-8">
                    <ManageDetailSection detail={detail} />

                    {/* Botones de Acción (Estilizados) */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
                        {(detail.type === "Trabajo" || detail.type === "Voluntariado") && (
                        <button
                            onClick={() =>
                            router.push(
                                `/admin/publications/manage/${detail.id}/applicants`
                            )
                            }
                            className="flex-1 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200 flex justify-center items-center gap-2"
                        >
                            Ver Postulantes
                        </button>
                        )}

                        <button
                        onClick={() => setIsCloseDialogOpen(true)}
                        disabled={isMutating}
                        className="flex-1 px-6 py-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 transition disabled:opacity-50 flex justify-center items-center gap-2"
                        >
                        {isMutating ? "Procesando..." : "Cerrar Publicación"}
                        </button>
                    </div>
                </div>

                {/* Columna Derecha: Perfil / Info Lateral */}
                <div className="w-full md:w-1/4 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <ManageProfileSection detail={detail} />
                    </div>
                </div>
            </div>
        </div>

        {/* DIÁLOGO DE CONFIRMACIÓN */}
        <ConfirmDialog
            open={isCloseDialogOpen}
            onOpenChange={setIsCloseDialogOpen}
            title="¿Cerrar esta publicación?"
            description="Esta acción hará que la publicación deje de estar disponible para los usuarios."
            confirmText="Cerrar"
            cancelText="Cancelar"
            onConfirm={handleCloseConfirm}
            onCancel={() => setIsCloseDialogOpen(false)}
        />
      </main>
    </div>
  );
}