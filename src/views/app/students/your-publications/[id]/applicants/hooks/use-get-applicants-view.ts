"use client";

import { useMemo, useState } from "react";
import { useQuery } from '@tanstack/react-query';
// import { useGetOffererPostulantsQuery } from "@/hooks/api/use-manage-service";
// import { mapApplicantToView } from "@/lib";
// import { ViewAppplicantsForAdmin } from "@/models/responses";
// import { handleApiError } from '@/lib';
import {offererPublicationService} from "@/services/offererPublicationService";
import { ApplicantResponse } from "@/models/responses";


export type ApplicantFilterType = "All" | "Accepted" | "Pending" | "Rejected";
export const useGetOfferApplicants = (offerId: number | string) => {
  return useQuery({
    queryKey: ['offer-applicants', offerId],
    queryFn: async () => {
      // 1. Llamada al servicio
      const response = await offererPublicationService.getOfferApplicantsForOfferer(offerId);
      // 2. Extracción de datos
      // response.data -> Es tu objeto ApiResponse { message: "...", data: [...] }
      // response.data.data -> Es el array de ApplicantResponse[]
      return response.data.data as ApplicantResponse[];
    },
    enabled: !!offerId, // Solo ejecuta si hay ID
  });
};
// export interface UseApplicantsViewResult {
//     applicants: ViewAppplicantsForAdmin[];
//     isLoading: boolean;
//     error: string | null;
//     totalCount: number;
//     refetch: () => void;
//     filterState: {
//         filterType: ApplicantFilterType,
//         setFilterType: (type: ApplicantFilterType) => void,
//         text: string,
//         setText: (text: string) => void
//     };
// }

// export const useGetOffererApplicantsView = (publicationId: string): UseApplicantsViewResult => {
//     const [filterType, setFilterType] = useState<ApplicantFilterType>("All");
//     const [text, setText] = useState<string>(""); 
//     const {
//         data: rawApplicants,
//         isLoading,
//         error,
//         refetch
//     } = useGetOffererPostulantsQuery(publicationId);

//     const applicantsList = useMemo(() => {
//         if (!rawApplicants) return [];
//         let list = rawApplicants.map(p => mapApplicantToView(p));
//         if (filterType !== "All") {
//             list = list.filter(applicant => applicant.status === filterType);
//         }
        
//         const searchText = text.toLowerCase().trim();
//         if (searchText) {
//             list = list.filter(applicant => 
//                 applicant.applicant.toLowerCase().includes(searchText) 
//             );
//         }

//         return list;
//     }, [rawApplicants, filterType, text]); 
    
//     const errorMessage = error ? (handleApiError(error).details || error.message) : null;
    
//     return {
//         applicants: applicantsList,
//         isLoading,
//         error: errorMessage,
//         totalCount: applicantsList.length,
//         refetch,
//         filterState: { 
//             filterType, 
//             setFilterType,
//             text, // <-- Devuelto
//             setText // <-- Devuelto
//         }
//     };
// };