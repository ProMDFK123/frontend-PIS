/**
 * Hook para crear publicaciones
 * Usa React Query para manejar el estado de la mutación
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { publicationService } from '@/services';
import { CreatePublicationData } from '@/services/api/publications/types';
import { FORM_MESSAGES } from '@/lib/utils/constants';
import { ROUTES } from '@/config/routes'

export function useCreatePublication() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePublicationData) => publicationService.create(data),
    
    onSuccess: () => {
      // Invalidar cache de publicaciones
      queryClient.invalidateQueries({ queryKey: ['publications'] });
      
      // Mostrar mensaje de éxito
      toast.success(FORM_MESSAGES.SUCCESS);
      
      // Redirigir
      router.push(ROUTES.PUBLICATIONS.LIST);
    },
    
    onError: (error) => {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || FORM_MESSAGES.ERROR;
        toast.error(errorMessage);
        console.error('Error al crear publicación:', error.response?.data || error.message);
      } else {
        toast.error(FORM_MESSAGES.ERROR);
        console.error('Error al crear publicación:', error);
      }
    },
  });
}