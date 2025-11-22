'use client';

import { JobApplicationResponseDto } from "@/services/dtos/jobApplicationDto";
import { useRouter } from "next/navigation";

interface ApplicationCardProps {
  application: JobApplicationResponseDto;
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    const s = (status ?? "Pendiente").toLowerCase();
    if (s === "pendiente")
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (s === "seleccionado" || s === "accepted")
      return "bg-green-100 text-green-800 border-green-200";
    if (s === "no seleccionado" || s === "rejected")
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusLabel = (status: string) => {
    const s = (status ?? "Pendiente").toLowerCase();
    if (s === "pendiente") return "Pendiente";
    if (s === "seleccionado") return "Seleccionado";
    if (s === "no seleccionado") return "No seleccionado";
    if (s === "accepted") return "Aceptado";
    if (s === "rejected") return "Rechazado";
    return status;
  };

  const formattedDate = new Date(application.applicationDate).toLocaleDateString(
    "es-CL",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const accentColor = (status: string) => {
    const s = (status ?? "Pendiente").toLowerCase();
    if (s === "seleccionado" || s === "accepted") return "border-green-400";
    if (s === "no seleccionado" || s === "rejected") return "border-red-400";
    return "border-yellow-400";
  };

  return (
    <article className={`rounded-2xl border bg-[var(--card)] p-4 shadow-sm transition hover:shadow-md border-l-4 ${accentColor(application.status)}`}>
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold truncate">
            {application.offerTitle}
          </h3>
          <p className="text-sm text-[var(--muted-ink)] mt-1">
            Postulada el {formattedDate}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${getStatusColor(
            application.status
          )}`}
        >
          {getStatusLabel(application.status)}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
        <div className="flex flex-wrap gap-2">
          {application.curriculumVitae && (
            <a
              href={application.curriculumVitae}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Ver CV
            </a>
          )}
        </div>
        <button
          onClick={() => router.push(`/jobs/history/${application.id}`)}
          className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver detalles
        </button>
      </div>
    </article>
  );
}