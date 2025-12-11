import { Skeleton } from "@/components/ui/skeleton";

export const ManageCardSkeleton = () => {
  return (
    <article className="relative flex flex-col h-full rounded-[2rem] bg-white shadow-xl border-4 border-transparent overflow-hidden">
      {/* Header: Badges */}
      <div className="px-6 pt-6 pb-2 flex justify-between items-start">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      {/* Body */}
      <div className="px-6 py-4 flex-1 flex flex-col gap-4">
        <Skeleton className="h-8 w-full rounded-lg" />
        <Skeleton className="h-8 w-3/4 rounded-lg" />

        <div className="mt-auto space-y-3">
           <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-4 w-32" />
           </div>
           
           <div className="flex items-center gap-3 px-3">
              <Skeleton className="w-4 h-4 rounded-full" />
              <Skeleton className="h-3 w-24" />
           </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 mt-2">
        <Skeleton className="h-14 w-full rounded-full" />
      </div>
    </article>
  );

  
};