import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export const ManageDetailSkeleton = () => {
  return (
    // Usamos el mismo contenedor y padding que la vista real
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 animate-pulse">
      
      {/* 1. HEADER (Sobre el fondo morado) */}
      <header className="mb-8">
        {/* Botón Volver simulado */}
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 opacity-50 pointer-events-none">
            <ArrowLeft className="h-4 w-4 text-white" />
            <span className="text-sm font-bold text-white">Volver</span>
        </div>

        <div className="space-y-4">
           {/* Badge de Zona */}
           <Skeleton className="h-7 w-48 rounded-full bg-white/20" />
           {/* Título Principal de la Página */}
           <Skeleton className="h-12 md:h-16 w-3/4 rounded-3xl bg-white/30" />
        </div>
      </header>

      {/* 2. TARJETA PRINCIPAL BLANCA */}
      <main className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden relative">
        
        {/* Header Interno de la Tarjeta (Badges de Estado/Tipo) */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex flex-wrap gap-4 justify-between">
          <Skeleton className="h-8 w-32 rounded-full" /> {/* Tipo */}
          <Skeleton className="h-8 w-28 rounded-full" /> {/* Estado */}
        </div>

        <div className="p-6 md:p-8 space-y-10">
          {/* Título de la Publicación */}
          <div className="space-y-3">
             <Skeleton className="h-10 w-full rounded-xl" />
             <Skeleton className="h-10 w-2/3 rounded-xl" />
          </div>

          {/* Sección de Metadatos (Usuario, Fechas, ID) */}
          <div className="bg-slate-50 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Bloque Usuario */}
             <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                <div className="space-y-3 flex-1">
                   <Skeleton className="h-5 w-40" /> {/* Label */}
                   <Skeleton className="h-7 w-full rounded-lg" /> {/* Valor */}
                </div>
             </div>
             {/* Bloque Fecha */}
             <div className="flex items-start gap-4">
                <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
                <div className="space-y-3 flex-1">
                   <Skeleton className="h-5 w-40" />
                   <Skeleton className="h-7 w-full rounded-lg" />
                </div>
             </div>
          </div>

          {/* Descripción */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 rounded-lg" /> {/* Título "Descripción" */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>

        {/* Footer de Acciones (Botones grandes) */}
        <div className="p-6 md:p-8 bg-slate-100/50 border-t border-slate-100 flex flex-col md:flex-row gap-4">
          <Skeleton className="h-16 w-full md:flex-1 rounded-2xl" /> {/* Botón 1 */}
          <Skeleton className="h-16 w-full md:flex-1 rounded-2xl" /> {/* Botón 2 */}
        </div>
      </main>
    </div>
  );
};