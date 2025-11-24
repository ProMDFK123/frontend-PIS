"use client";

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { handleApiError } from '@/lib'; 
import { UseAdminDetailResult } from '@/models/responses';
import { 
    useGetAdminPublicationDetailQuery,
    useValidationActionMutation
} from '@/hooks/api/use-validation-service';

export function useAdminPublicationDetailView(id: string): UseAdminDetailResult {
    const router = useRouter();
    
    const detailQuery = useGetAdminPublicationDetailQuery(id);
    const validationMutation = useValidationActionMutation();
    
    const handleAction = (action: 'publish' | 'reject') => {
        const publicationId = detailQuery.data?.id;
        if (!publicationId || validationMutation.isPending) return;
        
        validationMutation.mutate({ id: publicationId, action }, {
            onSuccess: () => {
                const actionText = action === 'publish' ? 'aceptada' : 'rechazada';
                toast.success(`Publicación fue ${actionText} con éxito.`);
                router.push('/admin/publications/validate'); 
            },
            onError: (error) => {
                const actionText = action === 'publish' ? 'publicar' : 'rechazar';
                const apiError = handleApiError(error);
                toast.error(apiError.details || `Fallo al ${actionText} la publicación.`);
            },
        });
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
        isMutating: validationMutation.isPending, 
        handleAction,
        handleRetry,
    };
}