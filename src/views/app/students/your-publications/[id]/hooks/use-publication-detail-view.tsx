// src/views/app/students/your-publications/[id]/hooks/use-publication-detail-view.tsx

import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";

import { studentPublicationService } from "@/services/studentsPublicationService"; 

// **IMPORTANTE**: Asegúrate de que estas rutas de importación son correctas
import type { ApiResponse } from "src/models/generics/api"; 
import type { OfferDetail, MyBuySell } from "src/models/responses/publication"; // Asumo que están en publication.ts

// Definición de tipos para la data cruda del API
type PublicationData = OfferDetail | MyBuySell;
// Definición de tipos para la respuesta completa del API (Unión de las dos posibles respuestas)
type PublicationApiResponse = ApiResponse<OfferDetail> | ApiResponse<MyBuySell>;


// Definición de tipos para el valor de retorno del hook
interface UseYourPublicationDetailView {
  detail: PublicationData | null; 
  loading: boolean;
  error: string | null;
  isMutating: boolean;
  handleClosePublication: () => Promise<void>;
}

/**
 * Hook para obtener y manejar los detalles de una publicación propia de estudiante (Oferta o Compra/Venta).
 * @param id ID de la publicación.
 * @param publicationType Tipo de publicación (0: Oferta/Voluntariado, 1: Compra/Venta).
 */
export function useYourPublicationDetailView(
  id: number,
  publicationType: number
): UseYourPublicationDetailView {
  const [error, setError] = useState<string | null>(null);

  // --- Obtención de Detalles ---
  // Se tipa useQuery con la unión de la respuesta del API
  const { data, isLoading } = useQuery<PublicationApiResponse, Error>({
    queryKey: ["student-publication-detail", id, publicationType],
    // Se define explícitamente el tipo de retorno de queryFn
    queryFn: async (): Promise<PublicationApiResponse> => { 
      // Se utiliza un cast forzado en el retorno de la función para resolver la ambigüedad de la unión de tipos
      if (publicationType === 1) {
          return studentPublicationService.getMyBullSellById(id) as unknown as Promise<ApiResponse<MyBuySell>>;
      }
      return studentPublicationService.getMyPublicationById(id) as unknown as Promise<ApiResponse<OfferDetail>>;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    
  });

  // --- Mutación para Cerrar Publicación ---
  const closeMutation = useMutation<void, Error, number>({ 
    // Se define explícitamente el tipo de retorno de mutationFn
    mutationFn: (pubId: number): Promise<any> => { 
      // La función del servicio debería manejar la lógica de la petición
      return studentPublicationService.closePublication(pubId, publicationType);
    },
    onError: (err: any) => {
      // Manejo de errores simplificado: simplemente re-lanza el error para que sea capturado en mutateAsync
      throw err;
    },
  });

  // Función de cierre para exportar
  const handleClosePublication = useCallback(async (): Promise<void> => {
    if (!id) {
        return Promise.resolve();
    }
    
    // **Bloque try/catch añadido para manejar específicamente el error 409**
    try {
        await closeMutation.mutateAsync(id);
    } catch (err: any) { 
        // LÓGICA DE ERROR DINÁMICA: DETECTAR EL CÓDIGO 409
        if (err.response && err.response.status === 409) {
            // Lanzamos un nuevo error con el mensaje específico para el banner en la vista
            throw new Error("El estado actual de la publicación (Pendiente o Rechazada) no permite el cierre.");
        }
        
        throw err; // Relanzar cualquier otro error
    }
    // Fin del bloque try/catch
    
  }, [id, closeMutation]);

  // Se extrae la data y se realiza un cast para asegurar que el retorno coincida con PublicationData | null
  const detailData = (data?.data || null) as (PublicationData | null);


  return {
    detail: detailData, 
    loading: isLoading,
    error,
    isMutating: closeMutation.isPending,
    handleClosePublication, 
  };
}

export default useYourPublicationDetailView;