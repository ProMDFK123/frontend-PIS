import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export const ValidationDetailSkeleton = () => {
  return (
    <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 animate-pulse">
      
      {/* Header */}
      <header className="mb-8">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 opacity-50">
            <ArrowLeft className="h-4 w-4 text-white" />
            <span className="text-sm font-bold text-white">Volver</span>
        </div>

        <div className="space-y-4">
           <Skeleton className="h-7 w-48 rounded-full bg-white/20" />
           <Skeleton className="h-12 md:h-16 w-3/4 rounded-3xl bg-white/30" />
        </div>
      </header>

      {/* Tarjeta Principal */}
      <main className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
        
        {/* Badges Header */}
        <div className="p-6 md:p-8 border-b border-slate-100 flex gap-4">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>

        <div className="p-6 md:p-8 space-y-10">
          {/* Título */}
          <div className="space-y-3">
             <Skeleton className="h-10 w-full rounded-xl" />
             <Skeleton className="h-10 w-2/3 rounded-xl" />
          </div>

          {/* Info Usuario */}
          <div className="bg-slate-50 rounded-3xl p-6 flex items-center gap-4">
             <Skeleton className="w-16 h-16 rounded-2xl shrink-0" />
             <div className="space-y-3 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-7 w-64 rounded-lg" />
             </div>
          </div>

          {/* Descripción */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>

        {/* Footer de Acciones (Aprobar/Rechazar) */}
        <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row gap-4">
          <Skeleton className="h-16 w-full md:flex-1 rounded-2xl" />
          <Skeleton className="h-16 w-full md:flex-1 rounded-2xl" />
        </div>
      </main>
    </div>
  );
};