"use client";
import React from "react";
import { formatDate, thousandSeparatorPipe } from "@/lib";
import { AdminDetail } from "@/models/responses";

function formatPrice(clp: number | undefined | null): string {
  if (clp === undefined || clp === null) return "No disponible";
  return `$${thousandSeparatorPipe(clp)} CLP`;
}

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

      {/* TÍTULO */}
      <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
        Detalles de la Publicación
      </h2>

      {/* DESCRIPCIÓN */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-[var(--primary)]">
          Descripción
        </h3>

        <p className="text-[var(--ink)] leading-relaxed whitespace-pre-line">
          {detail.description || "No hay descripción detallada proporcionada."}
        </p>
      </div>

      {/* REQUISITOS (Ahora como bloque propio) */}
      {detail.type !== "Compra/Venta" && detail.requirements && (
        <div className="pt-4 border-t border-[var(--border)] space-y-2">
          <h3 className="text-xl font-bold text-[var(--primary)]">
            Requisitos
          </h3>
          <p className="text-[var(--ink)] whitespace-pre-line">
            {detail.requirements}
          </p>
        </div>
      )}

      {/* BLOQUE DE INFORMACIÓN GENERAL */}
      <div className="pt-4 border-t border-[var(--border)]">
        <h3 className="text-xl font-bold text-[var(--primary)] mb-4">
          Información General
        </h3>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">

          {/* Fecha de Publicación */}
          <div>
            <dt className="font-semibold text-[var(--ink)]">
              Fecha de Publicación:
            </dt>
            <dd className="mt-1 text-[var(--muted-ink)]">
              {formatDate(detail.publicationDate || "")}
            </dd>
          </div>

          {/* Estado Validación */}
          <div>
            <dt className="font-semibold text-[var(--ink)]">
              Estado Validación:
            </dt>
            <dd>Pendiente</dd>
          </div>

          {/* Fecha Límite */}
          {detail.type !== "Compra/Venta" && (
            <div>
              <dt className="font-semibold text-[var(--ink)]">Fecha Límite:</dt>
              <dd className="mt-1 text-[var(--muted-ink)]">
                {formatDate(detail.deadlineDate || "")}
              </dd>
            </div>
          )}

          {/* Fecha de Término */}
          {detail.type !== "Compra/Venta" && (
            <div>
              <dt className="font-semibold text-[var(--ink)]">
                Fecha de Término:
              </dt>
              <dd className="mt-1 text-[var(--muted-ink)]">
                {formatDate(detail.endDate || "")}
              </dd>
            </div>
          )}

          {/* Localidad */}
          {detail.type !== "Compra/Venta" && (
            <div>
              <dt className="font-semibold text-[var(--ink)]">Localidad:</dt>
              <dd className="mt-1 text-[var(--muted-ink)]">
                {detail.location || "No especificada"}
              </dd>
            </div>
          )}

          {/* Remuneración / Precio */}
          <div>
            <dt className="font-semibold text-[var(--ink)]">
              {detail.type === "Compra/Venta"
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
