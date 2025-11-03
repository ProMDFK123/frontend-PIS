"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import EvaluacionTrabajoModal from "@/app/jobs/reports/details";



export default function JobsHistory() {
  const [filtro, setFiltro] = useState<"todos" | "bajas">("todos");
  const [paginaActual, setPaginaActual] = useState(1);
  const trabajosPorPagina = 10;
  const [open, setOpen] = useState(false);
  // 🔹 Datos de ejemplo (puedes reemplazar por los tuyos o traerlos desde un backend)
  const trabajos = Array.from({ length: 32 }).map((_, i) => ({
    id: i + 1,
    titulo:
      i % 3 === 0
        ? "Se necesita paseador de perros"
        : i % 3 === 1
        ? "Traducción de documentos técnicos"
        : "Diseño de logo para emprendimiento",
    fecha: `${(i % 28) + 1} sept 2025`,
    estudiante: ["Sofía López", "Luis Andrade", "Carolina Vega"][i % 3],
    oferente: ["StartupTech", "GlobalTrans", "Artify Studio"][i % 3],
    estrellas: (i % 5) + 1,
  }));

  // 🔹 Filtro
  const trabajosFiltrados =
    filtro === "bajas" ? trabajos.filter((t) => t.estrellas <= 3) : trabajos;

  // 🔹 Cálculo de páginas
  const totalPaginas = Math.ceil(trabajosFiltrados.length / trabajosPorPagina);
  const inicio = (paginaActual - 1) * trabajosPorPagina;
  const fin = inicio + trabajosPorPagina;
  const trabajosPagina = trabajosFiltrados.slice(inicio, fin);

  const changePage = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl px-4">
        {/* Encabezado */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold">Historial de Trabajos</h1>
          <p className="text-gray-600 text-sm">
            Historial completo de trabajos realizados en la plataforma
          </p>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => {
              setFiltro("todos");
              setPaginaActual(1);
            }}
            className={cn(
              "flex items-center gap-2 rounded-full px-4",
              filtro === "todos"
                ? "bg-purple-600 text-white"
                : "bg-white border text-gray-700"
            )}
          >
            🔍 Todos los trabajos
          </Button>
          <Button
            onClick={() => {
              setFiltro("bajas");
              setPaginaActual(1);
            }}
            className={cn(
              "flex items-center gap-2 rounded-full px-4",
              filtro === "bajas"
                ? "bg-purple-600 text-white"
                : "bg-white border text-gray-700"
            )}
          >
            ⭐ 3 estrellas o menos
          </Button>
        </div>

        {/* Lista de trabajos */}
        <div className="space-y-5">
          {trabajosPagina.map((trabajo) => (
            <Card
              key={trabajo.id}
              className="p-5 rounded-2xl shadow-sm border border-gray-200 bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-medium text-gray-800">
                    {trabajo.titulo}
                  </h2>
                  <p className="text-sm text-gray-500">{trabajo.fecha}</p>
                </div>

                {/* Estrellas */}
                <div className="flex text-yellow-400">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <span key={i}>{i < trabajo.estrellas ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg text-sm">
                  <strong>Estudiante</strong>: {trabajo.estudiante}
                </div>
                <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm">
                  <strong>Oferente</strong>: {trabajo.oferente}
                </div>
              </div>

              <div className="mt-4">
                <Button onClick={() => setOpen(true)}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-600 hover:bg-purple-50"
                >
                  Ver detalles
                </Button>
                <EvaluacionTrabajoModal open={open} onClose={() => setOpen(false)} />
              </div>
            </Card>
          ))}
        </div>

        {/* 🔸 Paginación */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={() => changePage(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="text-purple-600 border-purple-300 hover:bg-purple-50"
          >
            ← Anterior
          </Button>

          <p className="text-sm text-gray-600">
            Página {paginaActual} de {totalPaginas}
          </p>

          <Button
            variant="outline"
            onClick={() => changePage(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="text-purple-600 border-purple-300 hover:bg-purple-50"
          >
            Siguiente →
          </Button>
        </div>
      </div>
    </div>
  );
}
