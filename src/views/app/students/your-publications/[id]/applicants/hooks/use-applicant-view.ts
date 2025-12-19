// src/hooks/useApplicantsView.ts
import { useState } from 'react';
import { useGetOfferApplicants } from '../hooks'; // Tu hook de react-query

export const useApplicantsView = (offerId: number | string) => {
  // 1. Estado local para el buscador
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Obtener datos del servidor
  const { data, isLoading, isError } = useGetOfferApplicants(offerId);

  // 3. Lógica de filtrado (Búsqueda insensible a mayúsculas)
  const filteredApplicants = data?.filter((app) =>
    app.applicantName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // 4. Retornamos todo lo que la vista necesita
  return {
    applicants: filteredApplicants, // La lista ya filtrada
    totalCount: data?.length || 0,  // El total real (para el header)
    isLoading,
    isError,
    searchTerm,
    setSearchTerm, // Función para actualizar el buscador
  };
};