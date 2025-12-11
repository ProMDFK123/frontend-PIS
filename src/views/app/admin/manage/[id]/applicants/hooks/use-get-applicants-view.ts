"use client";

import { useMemo, useState } from "react";
import { useGetPostulantsQuery } from "@/hooks/api/use-manage-service"; 
import { mapApplicantToView } from "@/lib";
import { ViewAppplicantsForAdmin } from "@/models/responses";
import { handleApiError } from '@/lib'; 

export type ApplicantFilterType = "Todos" | "Aceptada" | "Pendiente" | "Rechazada";

export interface UseApplicantsViewResult {
    applicants: ViewAppplicantsForAdmin[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    refetch: () => void;
    filterState: {
        filterType: ApplicantFilterType,
        setFilterType: (type: ApplicantFilterType) => void,
        text: string,
        setText: (text: string) => void
    };
}

export const useGetApplicantsView = (publicationId: string): UseApplicantsViewResult => {
    const [filterType, setFilterType] = useState<ApplicantFilterType>("Todos");
    const [text, setText] = useState<string>(""); 
    const {
        data: rawApplicants,
        isLoading,
        error,
        refetch
    } = useGetPostulantsQuery(publicationId);

    const applicantsList = useMemo(() => {
        if (!rawApplicants) return [];
        let list = rawApplicants.map(p => mapApplicantToView(p));
        if (filterType !== "Todos") {
            list = list.filter(applicant => applicant.status === filterType);
        }
        
        const searchText = text.toLowerCase().trim();
        if (searchText) {
            list = list.filter(applicant => 
                applicant.applicant.toLowerCase().includes(searchText) 
            );
        }

        return list;
    }, [rawApplicants, filterType, text]); 
    
    const errorMessage = error ? (handleApiError(error).details || error.message) : null;
    
    return {
        applicants: applicantsList,
        isLoading,
        error: errorMessage,
        totalCount: applicantsList.length,
        refetch,
        filterState: { 
            filterType, 
            setFilterType,
            text, // <-- Devuelto
            setText // <-- Devuelto
        }
    };
};