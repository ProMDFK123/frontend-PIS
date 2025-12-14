import { Skeleton } from "@/components/ui/skeleton";

export const ApplicantListSkeleton = () => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      {/* Barra de filtros simulada */}
      <div className="rounded-2xl border border-white/20 bg-white/10 p-4 h-20 w-full mb-6"></div>

      {/* Lista de cards simulada */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div 
          key={i} 
          className="flex items-center justify-between p-5 rounded-xl border border-transparent bg-white h-24 shadow-sm w-full"
        >
          <div className="flex items-center gap-4 flex-grow">
            <Skeleton className="w-12 h-12 rounded-full bg-slate-200" />
            <div className="flex flex-col gap-2 w-1/2">
                <Skeleton className="h-5 w-2/3 rounded-md bg-slate-200" />
                <Skeleton className="h-4 w-1/3 rounded-md bg-slate-100" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <Skeleton className="h-6 w-24 rounded-full bg-slate-200" /> {/* Badge */}
             <Skeleton className="h-9 w-32 rounded-md bg-slate-300" /> {/* Botón */}
          </div>
        </div>
      ))}
    </div>
  );
};