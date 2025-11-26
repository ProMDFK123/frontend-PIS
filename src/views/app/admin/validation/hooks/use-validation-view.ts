"use client";
import { useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useGetPendingPublications } from "@/hooks/api/use-validation-service"; 
import { ValidationType, ValidationItemFull } from "@/models/responses"; 
type SortType = "recientes" | "titulo";


export const useValidationView = () => {
    const router = useRouter();
    const [text, setText] = useState("");
    const [type, setType] = useState<ValidationType>("Todos");
    const [sort, setSort] = useState<SortType>("recientes");
    
    const { 
        data: allPublications,
        isLoading, 
        error: apiError,
        refetch, 
    } = useGetPendingPublications(); 
    
    const filteredAndSorted = useMemo(() => {
        let list = [...allPublications]; 
        
        if (type !== "Todos") {
            list = list.filter((o) => o.item.type === type);
        }
        
        if (text.trim()) {
            const q = text.toLowerCase();
            list = list.filter((o) => o.item.title.toLowerCase().includes(q));
        }
        
        if (sort === "titulo") {
            list.sort((a, b) => a.item.title.localeCompare(b.item.title)); 
        }

        return list;
    }, [text, type, sort, allPublications]);

    const handleViewDetail = (publicationId: string) => {
        router.push(`/admin/publications/validate/${publicationId}`);
    };

    const errorMessage = apiError ? (apiError as Error).message : null;

    return {
        pendingPublications: filteredAndSorted,
        totalCount: allPublications.length,
        hasOffers: allPublications.length > 0,
        isLoading,
        error: errorMessage,
        filters: { text, type, sort },
        actions: {
            setText,
            setType,
            setSort,
            handleRetry: refetch,
            handleViewDetail
        }
    };
};

