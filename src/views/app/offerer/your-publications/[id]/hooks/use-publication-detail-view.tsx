import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { offererPublicationService } from "src/services/offererPublicationService";
import type { OfferDetail, OffererPublication } from "src/models/generics";

export type PublicationAction = "postulantes";

export const useYourPublicationDetailView = (id: number) => {
  const router = useRouter();
  const [detail, setDetail] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await offererPublicationService.getMyPublicationById(id); // Assuming response.data is OfferDetail
      setDetail(response.data.data); // Access the 'data' property from the ApiResponse
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
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id, fetchDetail]);

  const handleAction = async (action: PublicationAction, reason?: string) => {
    if (!detail) return;

    setIsMutating(true);
    try {
      if (action === "postulantes") {
        //Redirigir a la página de edición
        router.push(
          `/offerer/your-publications/${id}/applicants`
        );
      }
      // else if (action === "delete") {
      //  if (window.confirm("¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.")) {
      //     Lógica para eliminar la publicación
      //    await offererPublicationService.deletePublication(id);
      //    alert("Publicación eliminada correctamente.");
      //    router.push("/offerer/your-publications");
      //  }
    } catch (err: any) {
      alert(
        "Error al realizar la acción: " +
          (err.response?.data?.message || err.message)
      );
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
