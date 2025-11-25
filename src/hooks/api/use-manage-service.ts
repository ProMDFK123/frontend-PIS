import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { mapOfferToManage, mapBuySellToManage, handleApiError, mapBuySellToDetail, mapOfferToDetail } from "@/lib";
import { manageService } from "@/services/manageService";
import { PublishedItem, OfferDetailForAdmin, BuySellDetailForAdmin, AdminDetail } from "@/models/responses";
import { ClosePublicationVariables } from "@/models/requests";
import { AxiosError } from "axios";

// centraliza la lógica para obtener publicaciones publicadas (ofertas y compras/ventas)

export const useGetPublishedPublications = () => {
    return useQuery<PublishedItem[], Error>({
        queryKey: ["admin", "manage", "published"],
        queryFn: async () => {
            try {
                const [offersRes, buysellsRes] = await Promise.all([
                    manageService.getPublishedOffers(),
                    manageService.getPublishedBuySells(),
                ]);
                const offersData: OfferDetailForAdmin[] = offersRes.data.data || [];
                const buysellsData: BuySellDetailForAdmin[] = buysellsRes.data.data || []
                const mappedOffers = offersData
                    .filter(o => o && o.id)
                    .map(o => mapOfferToManage(o));
                const mappedBuys = buysellsData
                    .filter(b => b && b.id)
                    .map(b => mapBuySellToManage(b));
                return [...mappedOffers, ...mappedBuys];
            } catch (error) {
                const apiError = handleApiError(error);
                throw new Error(apiError.details || apiError.message);
            }
        },
        initialData: [],
    });
};

export const useGetAdminPublicationManagementDetailQuery = (id: string | undefined) => {
    return useQuery<AdminDetail, Error>({
        queryKey: ["admin", "publication", id],
        queryFn: async () => {
            if (!id || id === 'undefined') throw new Error("ID de publicación no válido.");
            const isBuySellPrefixed = id.startsWith('bs-');
            const entityId = isBuySellPrefixed ? id.split('-')[1] : id;
            if (isBuySellPrefixed) {
                const response = await manageService.getPublicationManagementDetail("buysells", entityId);
                const detailDto = response.data?.data ?? response.data;
                if (!detailDto) throw new Error("Respuesta de API vacía o malformada.");
                return { ...mapBuySellToDetail(detailDto), id };
            }
            try {
                const response = await manageService.getPublicationManagementDetail("offers", entityId);
                const detailDto = response.data?.data ?? response.data;
                if (!detailDto) throw new Error("Respuesta de API vacía o malformada.");
                return { ...mapOfferToDetail(detailDto), id };
            } catch (error) {
                if (error instanceof AxiosError && error.response?.status === 404) {
                    try {
                        const response = await manageService.getPublicationManagementDetail("buysells", entityId);
                        const detailDto = response.data?.data ?? response.data;
                        if (!detailDto) throw new Error("Respuesta de API vacía o malformada.");
                        return { ...mapBuySellToDetail(detailDto), id };
                    } catch (innerError) {
                        const apiError = handleApiError(innerError);
                        throw new Error(apiError.details || `Publicación con ID ${entityId} no encontrada.`);
                    }
                }
                const apiError = handleApiError(error);
                throw new Error(apiError.details || apiError.message);
            }
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useClosePublicationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation<any, Error, ClosePublicationVariables, void>({
        mutationFn: ({ id, typePath }) => {
            const entityId = id.startsWith('bs-') ? id.split('-')[1] : id;
            return manageService.closePublication(typePath, entityId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "manage", "published"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "publication"] }); 
        },
    });
};

export const useGetPostulantsQuery = (publicationId: string | undefined) => {
    return useQuery<any[], Error>({
        queryKey: ["admin", "postulants", publicationId],
        queryFn: async () => {
            if (!publicationId) throw new Error("ID de publicación es requerido.");
            const response = await manageService.getPostulants(publicationId);
            return response.data.data;
        },
        enabled: !!publicationId,
    });
};