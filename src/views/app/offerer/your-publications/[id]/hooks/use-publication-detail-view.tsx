import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { offererPublicationService } from "src/services/offererPublicationService";
import type { OfferDetail, MyBuySell } from "src/models/responses";

export type PublicationAction = "postulantes";

export const useYourPublicationDetailView = (id: number, type: number) => {
  const router = useRouter();
  const [detail, setDetail] = useState< OfferDetail | MyBuySell| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  // Eliminamos el estado redundante 'typePublication' porque ya lo recibes por props

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;

      // ✅ CORRECCIÓN: Usamos if/else directo para decidir qué servicio llamar
      // Asumimos que 0 es "Oferta de Trabajo" (Job)
if (type === 0) {
        // ES UNA OFERTA DE TRABAJO
        const response = await offererPublicationService.getMyPublicationById(id);
        // Le decimos a TS: "Confía en mí, esto es un OfferDetail"
        setDetail(response.data.data as OfferDetail); 
      } else {
        // ES UNA COMPRA/VENTA
        const response = await offererPublicationService.getMyBullSellById(id);
        // Le decimos a TS: "Confía en mí, esto es un MyBuySell"
        setDetail(response.data.data as MyBuySell);
      }

    } catch (err: any) {
      const status = err.response?.status;
      const message =
        status === 404
          ? "No se encontró la publicación que buscas."
          : "Hubo un error al cargar los datos. Por favor, intenta de nuevo.";
      setError(message);
      console.error("Error fetching publication detail:", err);
    } finally {
      setLoading(false);
    }
  }, [id, type]); // ✅ Agregamos 'type' a las dependencias

  // Este useEffect dispara la carga inicial cuando cambia el ID o el TIPO
  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id, fetchDetail]);

  const handleAction = async (action: PublicationAction) => {
    if (!detail) return;

    setIsMutating(true);
    try {
      if (action === "postulantes") {
        router.push(`/offerer/your-publications/${id}/applicants`);
      }
      // Aquí puedes agregar más acciones como delete, etc.
    } catch (err: any) {
      alert("Error al realizar la acción: " + (err.response?.data?.message || err.message));
    } finally {
      setIsMutating(false);
    }
  };

  const handleRetry = () => {
    fetchDetail();
  };

  return {
    detail,
    loading,
    error,
    isMutating,
    handleAction,
    handleRetry,
    
  };
};