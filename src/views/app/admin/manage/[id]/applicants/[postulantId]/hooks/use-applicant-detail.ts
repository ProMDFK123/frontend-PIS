"use client";

import { useGetPostulantDetailQuery } from "@/hooks/api/use-manage-service"; 
import { getApplicantDetailForAdmin } from "@/lib"; 
import { useMemo } from "react";

export const useAdminPostulantDetail = (postulantId: string) => {
  const { data, error, isLoading, isFetching, refetch } = useGetPostulantDetailQuery(postulantId);

  // Lógica Anti-Parpadeo:
  // Si está cargando o refrescando y no hay datos previos, consideramos "cargando".
  const isViewLoading = isLoading || (isFetching && !data);

  const postulant = useMemo(
    () => (data ? getApplicantDetailForAdmin(data) : null),
    [data]
  );

  return {
    // Si carga, devolvemos null para forzar el skeleton
    postulant: isViewLoading ? null : postulant,
    loading: isViewLoading,
    error,
    handleRetry: refetch,
  };
};