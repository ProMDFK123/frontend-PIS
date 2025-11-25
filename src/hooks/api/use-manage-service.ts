/*
import { useQuery } from "@tanstack/react-query";
import { mapOfferToManage, mapBuySellToManage, handleApiError } from "@/lib";
import { manageService } from "@/services/manageService";
import { PublishedItem, OfferDetailForAdmin, BuySellDetailForAdmin } from "@/models/responses";

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
*/