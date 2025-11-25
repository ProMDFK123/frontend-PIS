"use client";

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { handleApiError } from '@/lib'; 
import { UseAdminDetailResult } from '@/models/responses';
import { 
    useGetAdminPublicationManagementDetailQuery,
    useClosePublicationMutation,
} from '@/hooks/api/use-manage-service';

// Definimos los tipos de acción que puede recibir el hook (Validación o Gestión)
type ActionType = 'publish' | 'reject' | 'close_publication' | 'close_postulants';

export function useAdminPublicationDetailView(id: string): UseAdminDetailResult {
    const router = useRouter();
    const detailQuery = useGetAdminPublicationManagementDetailQuery(id);
    const closePublicationMutation = useClosePublicationMutation();

    const isMutating = closePublicationMutation.isPending

    const handleAction = (action: ActionType) => {
        const publicationDetail = detailQuery.data;
        if (!publicationDetail || isMutating) return;

        const publicationId = publicationDetail.id;
        const isBuySell = publicationId.startsWith('bs-');
        const typePath = isBuySell ? 'buysells' : 'offers';

        const onSuccess = (action: string) => {
            toast.success(`Publicación fue ${action} con éxito.`);
            router.push('/admin/publications/manage'); 
        };

        const onError = (error: Error, actionVerb: string) => {
            const apiError = handleApiError(error);
            toast.error(apiError.details || `Fallo al ${actionVerb} la publicación.`);
        };
        if (action === 'close_publication') {
            closePublicationMutation.mutate({ id: publicationId, typePath }, {
                onSuccess: () => onSuccess('cerrada'),
                onError: (error) => onError(error, 'cerrar la publicación'),
            });
        }
    };

    const handleRetry = () => {
        detailQuery.refetch();
    };

    const errorDetails = detailQuery.error
        ? (handleApiError(detailQuery.error).details || null)
        : null;

    return {
        detail: detailQuery.data || null,
        loading: detailQuery.isLoading,
        error: errorDetails,
        isMutating: isMutating, // Usa el estado unificado
        handleAction,
        handleRetry,
    };
}