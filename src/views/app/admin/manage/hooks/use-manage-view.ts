"use client";
import { useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useGetPublishedPublications } from "@/hooks/api/use-manage-service"; 
import { PublishedItem, ValidationType } from "@/models/responses"; 

type SortType = "recientes" | "titulo";

export const useManageView = () => {
    const router = useRouter();

    const [text, setText] = useState("");
    const [type, setType] = useState<ValidationType>("Todos"); 
    const [sort, setSort] = useState<SortType>("recientes");

    const {
        data: allPublications,
        isLoading,
        error: apiError,
        refetch,
    } = useGetPublishedPublications();

    const filteredAndSorted = useMemo(() => {
        let list = [...allPublications];

        // Filtro por tipo
        if (type !== "Todos") {
            list = list.filter((o) => o.offerType === type);
        }

        // Filtro por texto
        if (text.trim()) {
            const q = text.toLowerCase();
            list = list.filter((o) => o.title.toLowerCase().includes(q));
        }

        // Ordenar por título
        if (sort === "titulo") {
            list.sort((a, b) => a.title.localeCompare(b.title));
        }

        // Ordenar por más recientes (publicationDate DESC)
        if (sort === "recientes") {
            list.sort((a, b) =>
                new Date(b.publicationDate).getTime() -
                new Date(a.publicationDate).getTime()
            );
        }

        return list;
    }, [text, type, sort, allPublications]);

    const handleViewDetail = (publicationId: number) => {
        router.push(`/admin/publications/manage/${publicationId}`);
    };

    const errorMessage = apiError ? (apiError as Error).message : null;

    return {
        managedPublications: filteredAndSorted,
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
