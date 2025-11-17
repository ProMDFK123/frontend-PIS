import { useQuery } from "@tanstack/react-query";
import { handleApiError } from "@/lib"; 
import { mapOfferDtoToValidate, mapBuySellDtoToValidate } from "@/lib"; 
import { validationService } from "@/services/validationService";
import { PendingOffersForAdmin, BuySellBasic } from "@/models/responses";
import { ValidationItemFull } from "@/models/responses"; 

export const useGetPendingPublications = () => {
    return useQuery<ValidationItemFull[], Error>({
        queryKey: ["admin", "validation", "pending"],
        queryFn: async () => {
            try {
                const [offersRes, buysellsRes] = await Promise.all([
                    validationService.getPendingOffers(),
                    validationService.getPendingBuySells(),
                ]);
                const offersData = offersRes.data.data;
                const buysellsData = buysellsRes.data.data;
                const mappedOffers = offersData
                    .filter(o => o && o.id)
                    .map(o => ({
                        id: String(o.id), 
                        item: mapOfferDtoToValidate(o), 
                    })) as ValidationItemFull[];
                
                const mappedBuys = buysellsData
                    .filter(b => b && b.id)
                    .map(b => ({
                        id: `bs-${String(b.id)}`,
                        item: mapBuySellDtoToValidate(b),
                    })) as ValidationItemFull[];
                return [...mappedOffers, ...mappedBuys];

            } catch (error) {
                const apiError = handleApiError(error);
                throw new Error(apiError.details || apiError.message);
            }
        },
        initialData: [],
    });
};