"use client";

import { ChevronLeft, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ApplicantCard } from "./components/applicant-card";
import { ApplicantInfoForm } from "./components/applicant-info-form";
import { useAdminPostulantDetail } from "./hooks/use-applicant-detail";

export default function ApplicantDetailView({
  id,
  postulantId,
}: {
  id: string;
  postulantId: string;
}) {
  const router = useRouter();

  const { postulant, loading, error, handleRetry } =
    useAdminPostulantDetail(id);

  const backRoute = `/admin/publications/manage/${id}/applicants`;

  if (loading)
    return (
      <div className="text-center mt-12 text-[var(--muted-ink)]">
        Cargando información del postulante...
      </div>
    );

  if (error)
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-red-50 border border-red-200 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4 flex justify-center items-center gap-2">
          <AlertCircle size={24} /> Error al cargar información
        </h2>
        <p className="text-sm text-red-500 mb-6">{error.message}</p>
        <button
          onClick={() => handleRetry()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
        >
          Reintentar
        </button>
      </div>
    );

  if (!postulant)
    return (
      <div className="text-center mt-12 text-[var(--muted-ink)]">
        No se encontró información del postulante.
      </div>
    );

  return (
    <main className="max-w-7xl mx-auto px-2 py-6 space-y-4">
      <button
        onClick={() => router.push(backRoute)}
        className="mb-3 text-[var(--primary)] hover:underline flex items-center gap-1"
      >
        <ChevronLeft size={18} /> Volver
      </button>

      <h1 className="text-3xl font-bold text-[var(--ink)] mb-4">
        Detalles del Postulante
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <ApplicantCard postulant={postulant} />
        </div>

        <div className="col-span-2">
          <ApplicantInfoForm postulant={postulant} />
        </div>
      </div>
    </main>
  );
}
