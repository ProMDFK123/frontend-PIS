"use client";

import { useOffererGetPostulantDetailQuery } from "@/hooks/api/use-manage-service"; 
import { getApplicantDetailForAdmin } from "@/lib"; 
import { useMemo } from "react";

export const useOffererPostulantDetail = (offerId: string, postulantId: string) => {
  const { data, error, isLoading, isFetching, refetch } = useOffererGetPostulantDetailQuery(offerId, postulantId);
  const isViewLoading = isLoading || (isFetching && !data);

  const postulant = useMemo(
    () => (data ? getApplicantDetailForAdmin(data) : null),
    [data]
  );

  return {
    postulant: isViewLoading ? null : postulant,
    loading: isViewLoading,
    error,
    handleRetry: refetch,
  };
};