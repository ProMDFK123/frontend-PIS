import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";

export const ApplicantDetailSkeleton = () => {
  return (
    <div className="flex-grow container mx-auto px-4 py-6 relative z-10 animate-pulse">
      
      {/* Botón Volver */}
      <div className="mb-6 inline-flex items-center gap-2 text-white/50">
        <ChevronLeft className="h-5 w-5" />
        <Skeleton className="h-4 w-16 bg-white/20" />
      </div>

      {/* Título */}
      <Skeleton className="h-10 w-64 rounded-xl bg-white/30 mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Foto y CV */}
        <div className="col-span-1 bg-white rounded-xl p-6 shadow-lg flex flex-col items-center gap-6 border border-white/50">
           <Skeleton className="w-32 h-32 rounded-full" /> {/* Avatar */}
           <Skeleton className="h-6 w-40 rounded-md" /> {/* Nombre */}
           <Skeleton className="h-10 w-full rounded-md" /> {/* Botón CV */}
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="col-span-2 bg-white rounded-xl p-6 shadow-lg border border-white/50 space-y-6">
           {/* Filas de campos dobles */}
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <Skeleton className="h-4 w-20 mb-2" />
                 <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div>
                 <Skeleton className="h-4 w-20 mb-2" />
                 <Skeleton className="h-10 w-full rounded-md" />
              </div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <Skeleton className="h-4 w-20 mb-2" />
                 <Skeleton className="h-10 w-full rounded-md" />
              </div>
              <div>
                 <Skeleton className="h-4 w-20 mb-2" />
                 <Skeleton className="h-10 w-full rounded-md" />
              </div>
           </div>

           {/* Campos anchos (Textarea) */}
           <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-10 w-full rounded-md" />
           </div>
           
           <div>
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-32 w-full rounded-md" />
           </div>
        </div>

      </div>
    </div>
  );
};