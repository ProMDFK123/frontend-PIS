"use client";
import { useMemo, useState } from "react";
import { useRouter } from 'next/navigation';
import { useGetPendingPublications } from "@/hooks/api/use-validation-service"; 
import { ValidationType } from "@/models/responses"; 

type SortType = "recientes" | "titulo";

export const useValidationView = () => {
    const router = useRouter();
    const [text, setText] = useState("");
    const [type, setType] = useState<ValidationType>("Todos");
    const [sort, setSort] = useState<SortType>("recientes");
    
    const { 
        data: allPublications,
        isFetching, // Usamos isFetching para detectar la carga inicial real
        error: apiError,
        refetch, 
    } = useGetPendingPublications(); 
    
    // LÓGICA ANTI-PARPADEO (Igual que en Gestión):
    // Si estamos buscando datos y el array está vacío o indefinido, consideramos que está "Cargando Vista".
    const isViewLoading = isFetching && (!allPublications || allPublications.length === 0);

    const filteredAndSorted = useMemo(() => {
        if (!allPublications) return [];

        let list = [...allPublications]; 
        
        // Filtro por Tipo (SOLUCIÓN DEL ERROR TYPE)
        if (type !== "Todos") {
            list = list.filter((o) => {
                // TypeScript no sabe si es Oferta o CompraVenta, así que verificamos:
                // Si existe 'offerType', usamos ese. Si no, usamos 'type'.
                const itemType = "offerType" in o.item ? o.item.offerType : o.item.type;
                return itemType === type;
            });
        }
        
        // Filtro por Texto
        if (text.trim()) {
            const q = text.toLowerCase();
            list = list.filter((o) => o.item.title.toLowerCase().includes(q));
        }
        
        // Ordenamiento
        if (sort === "titulo") {
            list.sort((a, b) => a.item.title.localeCompare(b.item.title)); 
        }
        // Para 'recientes' asumimos el orden por defecto del backend

        return list;
    }, [text, type, sort, allPublications]);

    const handleViewDetail = (publicationId: string) => {
        router.push(`/admin/publications/validate/${publicationId}`);
    };

    const errorMessage = apiError ? (apiError as Error).message : null;

    return {
        // CLAVE: Devolvemos NULL si está cargando para activar los Skeletons en la vista
        pendingPublications: isViewLoading ? null : filteredAndSorted,
        
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