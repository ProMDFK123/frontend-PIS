// este componente muestra el contexto de quien creo la publicacion
"use client";

import React from "react";
import { AdminDetail, UseAdminDetailValidateResult } from "@/models/responses";

interface ValidationActionSectionProps {
  detail: AdminDetail;
  isMutating: UseAdminDetailValidateResult["isMutating"];
  handleAction: UseAdminDetailValidateResult["handleAction"];
}

export function ValidationActionSection({
  detail,
}: ValidationActionSectionProps) {
  return (
    <section className="w-full bg-white p-6 rounded-xl shadow-lg border border-[var(--border)] flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-black mb-4 text-center">
          Perfil del Contacto
        </h2>

        {/* PERFIL */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
            {detail.companyName ? detail.companyName[0] : "U"}
          </div>

          <p className="font-bold text-xl text-[var(--ink)] break-words px-2">
            {detail.companyName || "Usuario UCN"}
          </p>
        </div>

        {/* INFO DETALLADA */}
        <div className="mt-6 pt-4 border-t border-[var(--border)] text-sm text-[var(--ink)] space-y-3">

          {/* INFORMACIÓN DE CONTACTO (igual que el otro componente) */}
          {detail.contactInfo && (
            <div className="flex flex-col">
              <span className="font-semibold mb-1">Información de contacto:</span>
              <span className="break-all">{detail.contactInfo}</span>
            </div>
          )}

          {/* DESCRIPCION */}
          {detail.aboutMe && (
            <div className="flex flex-col">
              <span className="font-semibold mb-1">Acerca de mí:</span>
              <span className="break-words">{detail.aboutMe}</span>
          </div>
        )}
        </div>
      </div>
    </section>
  );
}
