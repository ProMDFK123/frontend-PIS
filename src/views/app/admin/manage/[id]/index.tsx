"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, AlertCircle } from "lucide-react";
import React, { useState } from "react";
import { useAdminPublicationDetailView } from "./hooks/use-manage-detail-view";
import { handleApiError, getPresentationType } from "@/lib";
import { ManageDetailSection } from "./components/manage-detail-section";
import { ManageProfileSection } from "./components/manage-profile-section";
import { ConfirmDialog } from "@/components/ui";
import { toast } from "sonner";

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
      // Redirigimos con la notificacion
      router.push(`${backRoute}?notification=closed`);
    } catch (e) {
      toast.error("Error al cerrar publicación", {
        id: toastId,
        description: "No se pudo completar la acción. Revisa la consola.",
      });
    }
  };

  if (loading)
    return (
      <div className="text-center mt-12 text-[var(--muted-ink)]">
        Cargando detalles de gestión...
      </div>
    );

  if (error) {
    const errorDetails = error
      ? handleApiError(error).details || error
      : "Error desconocido.";
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-red-50 border border-red-200 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4 flex justify-center items-center gap-2">
          <AlertCircle size={24} /> Error al cargar la publicación
        </h2>
        <p className="text-sm text-red-500 mb-6">{errorDetails}</p>
        <button
          onClick={handleRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!detail)
    return (
      <div className="text-center mt-12 text-[var(--muted-ink)]">
        No se encontró la publicación para gestionar.
      </div>
    );

  return (
    <main className="max-w-7xl mx-auto px-2 py-2">
      <button
        onClick={() => router.push(backRoute)}
        className="mb-3 text-[var(--primary)] hover:underline flex items-center gap-1"
      >
        <ChevronLeft size={18} /> Volver
      </button>

      <h1 className="text-3xl font-bold text-[var(--ink)] mb-1">
        {detail.title || "Sin Título"}
      </h1>

      <p className="text-base text-[var(--muted-ink)] mb-4">
        Tipo: {getPresentationType(detail.type)}
      </p>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-3/4 space-y-6">
          <ManageDetailSection detail={detail} />

          <div className="flex gap-4 mt-4">
            {(detail.type === "Trabajo" || detail.type === "Voluntariado") && (
              <button
                onClick={() =>
                  router.push(
                    `/admin/publications/manage/${detail.id}/applicants`
                  )
                }
                className="w-1/2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Ver Postulantes
              </button>
            )}

            <button
              onClick={() => setIsCloseDialogOpen(true)}
              disabled={isMutating}
              className="w-full md:w-1/2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
            >
              {isMutating ? "Procesando..." : "Cerrar Publicación"}
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/4 space-y-6">
          <ManageProfileSection detail={detail} />
        </div>
      </div>

      {/* CONFIRM DIALOG */}
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
  );
}