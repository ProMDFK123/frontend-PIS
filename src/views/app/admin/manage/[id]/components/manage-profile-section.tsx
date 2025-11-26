"use client";

import React from "react";
import { AdminDetail } from "@/models/responses";

interface ManageProfileSectionProps {
  detail: AdminDetail;
}

export function ManageProfileSection({ detail }: ManageProfileSectionProps) {
  return (
    <section className="w-full bg-white p-6 rounded-xl shadow-lg border border-[var(--border)]">
      
      {/* TÍTULO */}
      <h2 className="text-2xl font-bold text-[var(--primary)] mb-6 text-center">
        Perfil del Contacto
      </h2>

      {/* PERFIL */}
      <div className="flex flex-col items-center text-center space-y-4">
        
        {/* AVATAR */}
        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
          {detail.companyName ? detail.companyName[0] : "U"}
        </div>

        {/* NOMBRE */}
        <p className="font-semibold text-lg text-[var(--ink)] break-words px-2">
          {detail.companyName || "Usuario UCN"}
        </p>
      </div>

      {/* INFO DETALLADA */}
      <div className="mt-6 pt-5 border-t border-[var(--border)] text-[var(--ink)] text-sm space-y-4">
        
        {/* DESCRIPCIÓN */}
        <p className="text-justify leading-relaxed">
          Docente de la Universidad Católica del Norte y ha participado 
          activamente en iniciativas...
        </p>

        {/* CORREO */}
        <div>
          <span className="font-semibold">Correo:</span>{" "}
          <span className="break-all">usuario@ucn.cl</span>
        </div>

        {/* TELÉFONO */}
        <div>
          <span className="font-semibold">Teléfono:</span> +56 9 1234 5678
        </div>
      </div>

      {/* ZONA PARA BOTONES DEL PADRE */}
      <div className="mt-8 pt-6 border-t border-[var(--border)]"></div>

    </section>
  );
}
