"use client";
import React from "react";
import { formatDate, thousandSeparatorPipe } from "@/lib";
import { AdminDetail } from "@/models/responses";

function formatPrice(clp: number | undefined | null): string {
  if (clp === undefined || clp === null) return "No disponible";
  return `$${thousandSeparatorPipe(clp)} CLP`;
}

function translateStatus(
  status: AdminDetail["statusValidation"] | string
): string {
  const map: Record<string, string> = {
    Pending: "Pendiente",
    Published: "Publicado",
    Rejected: "Rechazado",
  };
  return map[status] || status;
}

const getStatusColor = (
  status: AdminDetail["statusValidation"] | string
): string => {
  switch (status) {
    case "Published":
      return "text-green-600";
    case "Rejected":
      return "text-red-600";
    case "Pending":
    default:
      return "text-orange-600";
  }
};

interface ValidationDetailSectionProps {
  detail: AdminDetail;
}

export function ValidationDetailSection({
  detail,
}: ValidationDetailSectionProps) {
  return (
    <section className="w-full bg-white p-6 rounded-xl shadow-lg border border-[var(--border)] space-y-6">
      {/* Imagen */}
      <div className="mb-4 overflow-hidden rounded-md max-h-96">
        <img
          src={
            detail.images && detail.images.length > 0
              ? detail.images[0]
              : "/generic.png"
          }
          alt={detail.title}
          className="w-full object-cover h-64 md:h-96"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
          Detalles de la Publicación
        </h2>
        {/* Descripción - Eliminado el "Descripción Completa" y arreglado el padding/sangría */}
        <p className="text-[var(--ink)] leading-relaxed">
          {detail.description || "No hay descripción detallada proporcionada."}
        </p>
      </div>

      <div className="pt-4 border-t border-[var(--border)]">
        <h3 className="text-xl font-bold text-[var(--primary)] mb-4">
          Información Adicional
        </h3>
        {/* Información Adicional - Usando dl para una mejor estructura y manejo del diseño */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          {/* Fila 1: Fecha de Publicación */}
          <div>
            <dt className="font-semibold text-[var(--ink)]">
              Fecha de Publicación:
            </dt>
            <dd className="mt-1 text-[var(--muted-ink)]">
              {formatDate(detail.publicationDate || "")}
            </dd>
          </div>

          {/* Fila 2: Estado Validación */}
          <div>
            <dt className="font-semibold text-[var(--ink)]">
              Estado Validación:
            </dt>
            <dd
              className={`mt-1 font-semibold ${getStatusColor(
                detail.statusValidation
              )}`}
            >
              {translateStatus(detail.statusValidation)}
            </dd>
          </div>

          {/* Fila 3: Fecha Límite (Condicional) */}
          {detail.type !== "CompraVenta" && (
            <div>
              <dt className="font-semibold text-[var(--ink)]">
                Fecha Límite:
              </dt>
              <dd className="mt-1 text-[var(--muted-ink)]">
                {formatDate(detail.deadlineDate || "")}
              </dd>
            </div>
          )}

          {/* Fila 4: Fecha de Término (Est.) (Condicional) */}
          {detail.type !== "CompraVenta" && (
            <div>
              <dt className="font-semibold text-[var(--ink)]">
                Fecha de Término (Est.):
              </dt>
              <dd className="mt-1 text-[var(--muted-ink)]">
                {formatDate(detail.endDate || "")}
              </dd>
            </div>
          )}

          {/* Fila 5: Remuneración / Precio Solicitado */}
          <div>
            <dt className="font-semibold text-[var(--ink)]">
              {detail.type === "CompraVenta"
                ? "Precio Solicitado:"
                : "Remuneración:"}
            </dt>
            <dd className="mt-1 font-semibold text-green-700">
              {formatPrice(
                detail.price !== undefined && detail.price !== null
                  ? detail.price
                  : detail.remuneration
              )}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}