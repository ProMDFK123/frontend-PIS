import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="container mx-auto p-4 animate-pulse">
      {/* Título H1 */}
      <Skeleton className="h-8 w-64 mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* === COLUMNA IZQUIERDA (Avatar y Botones) === */}
        <div className="col-span-1 border rounded-md px-6 py-8 flex flex-col items-center gap-4 bg-white shadow-sm">
          {/* Foto de Perfil */}
          <Skeleton className="w-28 h-28 rounded-full" />
          
          {/* Nombre de usuario */}
          <Skeleton className="h-6 w-32 mt-2" />

          {/* Botones de Acción (Editar / Cambiar Pass / Registrar Admin) */}
          <div className="w-full space-y-3 mt-4">
             <Skeleton className="h-9 w-full rounded-md" /> {/* Botón Principal */}
             <Skeleton className="h-9 w-full rounded-md" /> {/* Botón Extra */}
          </div>
        </div>

        {/* === COLUMNA DERECHA (Formulario) === */}
        <div className="col-span-1 md:col-span-2 border rounded-md p-6 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Campos Simples (Username, Nombre, Apellido, RUT) */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" /> {/* Label */}
                <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
              </div>
            ))}

            {/* Campos Anchos (Correo, Teléfono) */}
            <div className="md:col-span-2">
               <Skeleton className="h-4 w-32 mb-2" /> {/* Label */}
               <div className="flex">
                  <Skeleton className="h-10 w-full rounded-md" />
               </div>
            </div>

            <div className="md:col-span-2">
               <Skeleton className="h-4 w-24 mb-2" /> {/* Label */}
               <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Área de Descripción (Textarea) */}
            <div className="md:col-span-2">
               <Skeleton className="h-4 w-32 mb-2" /> {/* Label */}
               <Skeleton className="h-40 w-full rounded-md" /> {/* Textarea grande */}
               <div className="flex justify-end mt-1">
                  <Skeleton className="h-3 w-10" /> {/* Contador */}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}