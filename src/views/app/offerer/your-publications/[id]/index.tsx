"use client";

import { useRouter,useParams, useSearchParams} from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { PublicationAction, useYourPublicationDetailView } from "./hooks/use-publication-detail-view";
import {
  PublicationDetailSection,
  PublicationActionSection,
} from "./components";

export interface YourPublicationDetailViewProps {
  id: number;
}

export default function YourPublicationDetailView({
  id
}: YourPublicationDetailViewProps,) {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const type = searchParams.get("type");
  const numberType = Number(type);
  const urlStatus = searchParams.get("status") 
    ? Number(searchParams.get("status")):0;
  const router = useRouter();
  const { detail, loading, error, isMutating,
      handleAction, handleRetry
    } =
    useYourPublicationDetailView(id , numberType);

  // La ruta a la que volverá el usuario.
  const backRoute = "/offerer/your-publications";

  if (loading) {
    return (
      <div className="text-center mt-12 text-gray-500">
        Cargando detalles de tu publicación...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto p-8 mt-12 bg-red-50 border border-red-200 rounded-lg text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-4">
          Error al cargar la publicación
        </h2>
        <p className="text-sm text-red-500 mb-6">{error}</p>
        <button
              onClick={handleRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="text-center mt-12 text-gray-500">
        No se encontró la publicación.
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <button
        onClick={() => router.push(backRoute)}
        className="mb-6 text-indigo-600 hover:underline flex items-center gap-1"
      >
        <ChevronLeft size={20} /> Volver a mis publicaciones
      </button>

      <h1 className="text-4xl font-extrabold text-gray-900 mb-1">{detail.title}</h1>
      <p className="text-lg text-gray-500 mb-6">Tipo: Oferta de trabajo</p>{/*tipo de publicacion*/}

      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="w-full md:w-2/3">
          <PublicationDetailSection detail={detail} />
        </div>
        <div className="w-Full md:w-1/3">
          <PublicationActionSection
            id={id}
            detail={detail}
            isMutating={isMutating}
            handleAction={handleAction}
            status={urlStatus}
          />
        </div>
      </div>
    </main>
  );
}