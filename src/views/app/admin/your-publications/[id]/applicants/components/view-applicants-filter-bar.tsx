"use client";

import React from "react";
import { Search } from "lucide-react";

// Definimos el tipo aquí o impórtalo de tus types
export type ApplicantFilterType = "Todos" | "Aceptada" | "Pendiente" | "Rechazada";

interface Props {
  text: string;
  setText: (v: string) => void;
  filterType: ApplicantFilterType;
  setFilterType: (v: ApplicantFilterType) => void;
}

export default function ApplicantFilterBar({
  text,
  setText,
  filterType,
  setFilterType,
}: Props) {
  const statusOptions: { value: ApplicantFilterType; label: string }[] = [
    { value: "Todos", label: "Todos" },
    { value: "Aceptada", label: "Aceptados" },
    { value: "Rechazada", label: "Rechazados" },
    { value: "Pendiente", label: "Pendientes" },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4 md:p-5 shadow-inner">
      <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-5">

        {/* INPUT BUSCADOR */}
        <div className="relative md:col-span-3 lg:col-span-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full rounded-xl border-0 bg-white/90 text-slate-900 pl-12 pr-4 py-3 outline-none focus:ring-[3px] focus:ring-purple-500/50 placeholder:text-slate-400 font-medium transition-all"
          />
        </div>

        {/* SELECT FILTRO */}
        <div className="relative">
            <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as ApplicantFilterType)}
            className="w-full appearance-none rounded-xl border-0 bg-white/90 text-slate-900 px-4 py-3 outline-none focus:ring-[3px] focus:ring-purple-500/50 font-medium cursor-pointer transition-all"
            >
            {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                {option.label}
                </option>
            ))}
            </select>
             {/* Flechita custom para el select si quieres, o dejar la default */}
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </div>
        </div>

      </div>
    </div>
  );
}