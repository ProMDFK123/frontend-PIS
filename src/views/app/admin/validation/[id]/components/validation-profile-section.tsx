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
        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4 text-center">
          Perfil del Contacto
        </h2>

        {/* Detalles */}
        <div className="flex flex-col items-center text-center space-y-3 pt-2">
          <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
            {detail.companyName ? detail.companyName[0] : "U"}
          </div>

          <p className="font-bold text-xl text-[var(--ink)]">
            {detail.companyName || "Usuario UCN"}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)] text-sm text-[var(--ink)] space-y-3">
          <p>
            Docente de la Universidad Católica del Norte y ha participado
            activamente en iniciativas...
          </p>

          <p>
            <strong>Correo electrónico:</strong> usuario@ucn.cl
          </p>

          <p>
            <strong>Teléfono:</strong> +56 9 1234 5678
          </p>
        </div>
      </div>
    </section>
  );
}
