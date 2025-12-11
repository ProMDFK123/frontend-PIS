"use client";
import { useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useGetPublishedPublications } from "@/hooks/api/use-manage-service"; 
import { ValidationType } from "@/models/responses"; 

type SortType = "recientes" | "titulo";

export const useManageView = () => {
    const router = useRouter();
    const [text, setText] = useState("");
    const [type, setType] = useState<ValidationType>("Todos"); 
    const [sort, setSort] = useState<SortType>("recientes");

    const {
        data: allPublications,
        isFetching, // Usamos isFetching porque detecta cualquier carga (inicial o revalidación)
        error: apiError,
        refetch,
    } = useGetPublishedPublications();

    // LÓGICA MAESTRA:
    // Consideramos que está "Cargando la Vista" si:
    // 1. Se están buscando datos (isFetching es true)
    // 2. Y ADEMÁS, no tenemos datos previos para mostrar (allPublications es undefined o vacío)
    const isViewLoading = isFetching && (!allPublications || allPublications.length === 0);

    const filteredAndSorted = useMemo(() => {
        if (!allPublications) return [];

        let list = [...allPublications];

        // Filtros
        if (type !== "Todos") {
            list = list.filter((o) => o.offerType === type);
        }

        if (text.trim()) {
            const q = text.toLowerCase();
            list = list.filter((o) => o.title.toLowerCase().includes(q));
        }

        // Ordenamiento
        if (sort === "titulo") {
            list.sort((a, b) => a.title.localeCompare(b.title));
        }

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
        // Si está cargando la vista, devolvemos NULL. 
        // Esto obliga a index.tsx a mostrar el Skeleton y NUNCA el "Sin Actividad".
        managedPublications: isViewLoading ? null : filteredAndSorted,
        
        totalCount: allPublications?.length || 0,
        hasOffers: (allPublications?.length || 0) > 0,
        
        isLoading: isViewLoading,
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