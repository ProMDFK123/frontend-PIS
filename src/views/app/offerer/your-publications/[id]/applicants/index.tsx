"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { handleApiError } from "@/lib";
import { useGetOffererApplicantsView } from "./hooks/use-get-applicants-view";
import { ViewAppplicantsForAdmin } from "@/models/responses";
import ApplicantCard from "./components/applicant-card";
import ApplicantFilterBar from "./components/view-applicants-filter-bar";

export interface ApplicantsViewProps {
  id: string;
  publicationTitle?: string;
}
export default function ApplicantsOffererView({ id }: ApplicantsViewProps) {
  const router = useRouter();
  const backRoute = `/offerer/your-publications/${id}`;

  const { applicants, isLoading, error, refetch, totalCount, filterState } =
    useGetOffererApplicantsView(id);

  const { filterType, setFilterType, text, setText } = filterState;

  const handleViewDetail = (applicantId: number) => {
    router.push(
      `/offerer/your-publications/${id}/applicants/${applicantId}/detail`
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center mt-12 text-[var(--muted-ink)]">
          Cargando lista de postulantes...
        </div>
      );
    }
    if (error) {
      return (
        <div className="max-w-xl mx-auto p-8 mt-12 bg-red-50 border border-red-200 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4 flex justify-center items-center gap-2">
            <AlertCircle size={24} /> Error al cargar postulantes
          </h2>
          <p className="text-sm text-red-500 mb-6">{error}</p>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
          >
            Reintentar
          </button>
        </div>
      );
    }
    if (totalCount === 0) {
      return (
        <div className="text-center mt-12 p-8 border border-[var(--border)] rounded-xl text-[var(--muted-ink)]">
          No hay postulantes registrados para esta publicación.
        </div>
      );
    }
    return (
      <div className="mt-6 space-y-3">
        {applicants.map((applicant: ViewAppplicantsForAdmin, index) => (
          <ApplicantCard
            key={applicant.id || index}
            applicant={applicant}
            onViewDetail={handleViewDetail}
          />
        ))}
      </div>
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-6">
      <button
        onClick={() => router.push(backRoute)}
        className="mb-4 text-[var(--primary)] hover:underline flex items-center gap-1"
      >
        <ChevronLeft size={20} /> Volver al detalle
      </button>

      <h1 className="text-3xl font-extrabold text-[var(--ink)] mb-1">
        Postulantes de la oferta
      </h1>

      <p className="text-base text-[var(--muted-ink)] mb-4">
        {totalCount} postulantes encontrados.
      </p>

      <ApplicantFilterBar
        text={text}
        setText={setText}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {renderContent()}
    </main>
  );
}
