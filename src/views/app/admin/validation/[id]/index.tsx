"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAdminPublicationDetailView } from "./hooks/use-validation-detail-view";
import { ValidationDetailSection, ValidationActionSection } from "./components";
import { getPresentationType } from "@/lib";

export interface ValidationDetailViewProps {
  id: string;
}

export default function ValidationDetailView({
  id,
}: ValidationDetailViewProps) {
  const router = useRouter();
  const { detail, loading, error, isMutating, handleAction, handleRetry } =
    useAdminPublicationDetailView(id);

  const backRoute = "/admin/publications/validate";

  if (loading)
    return (
      <div className="text-center mt-12 text-[var(--muted-ink)]">
        Cargando detalles de la publicación...
      </div>
    );

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-red-50 border border-red-200 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Error al cargar la publicación
        </h2>
        <p className="text-sm text-red-500 mb-6">{error}</p>
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
        No se encontró la publicación pendiente.
      </div>
    );
  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <button
        onClick={() => router.push(backRoute)}
        className="mb-6 text-[var(--primary)] hover:underline flex items-center gap-1"
      >
        <ChevronLeft size={20} /> Volver a la lista de pendientes
      </button>

      <h1 className="text-4xl font-extrabold text-[var(--ink)] mb-1">
        {detail.title || "Sin Título"}
      </h1>
      <p className="text-lg text-[var(--muted-ink)] mb-6">
        Tipo:{" "}
        {getPresentationType(detail.type)}
      </p>
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-2/3">
          <ValidationDetailSection detail={detail} />
        </div>
        <div className="w-full md:w-1/3">
          <ValidationActionSection
            detail={detail}
            isMutating={isMutating}
            handleAction={handleAction}
          />
        </div>
      </div>
    </main>
  );
}
