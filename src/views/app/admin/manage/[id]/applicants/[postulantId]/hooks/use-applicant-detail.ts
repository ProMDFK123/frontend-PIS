"use client";

import { useGetPostulantDetailQuery } from "@/hooks/api/use-manage-service"; 
import { getApplicantDetailForAdmin } from "@/lib"; 
import { useMemo } from "react";

export const useAdminPostulantDetail = (postulantId: string) => {
  const { data, error, isLoading, refetch } = useGetPostulantDetailQuery(postulantId);

  const postulant = useMemo(
    () => (data ? getApplicantDetailForAdmin(data) : null),
    [data]
  );

  return {
    postulant,
    loading: isLoading,
    error,
    handleRetry: refetch,
  };
};
