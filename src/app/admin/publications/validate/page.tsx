// src/app/admin/publications/validate/page.tsx

"use client";
import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/offers/FilterBar";
import api from "@/services/Service";
import type { ApiListResponse } from "@/services/dtos/dto";

// 🚨 CAMBIO: Importamos los tipos que SÍ necesitamos
import ValidationRowLink from "@/components/admin/ValidationRowLink"; 
import { ValidationType, ValidationItemFull, OfferForAdmin, AdminItemType } from "@/types/admin-publications"; 

// Interfaz genérica para leer datos del backend (acepta CUALQUIER propiedad)
interface DtoFromBackend {
    [key: string]: any; 
}

// 🚨 CAMBIO: Esta función convierte los datos del backend (con mayúsculas)
// al formato que los componentes del frontend (con minúsculas) esperan.
function mapRawApiToOfferForAdmin(data: DtoFromBackend, isBuySell: boolean): OfferForAdmin | null {
    // Busca 'id' (minúscula) O 'Id' (Mayúscula)
    const id = data.id || data.Id;
    const title = data.title || data.Title;
    
    // Si no tiene id o título, lo descartamos
    if (!id || !title) return null;

    let type: AdminItemType = "Trabajo"; // Default
    if (isBuySell) {
        type = "CompraVenta";
    } else {
        const offerType = data.type || data.Type;
        type = (offerType === 0 || offerType === 1) ? "Trabajo" : "Trabajo";
    }

    return {
        id: String(id), // El componente espera un string
        title: title,
        type: type
    };
}


export default function ValidationPage() {
    const [text, setText] = useState("");
    const [type, setType] = useState<ValidationType>("Todos");
    const [sort, setSort] = useState<"recientes" | "titulo">("recientes");
    const [offers, setOffers] = useState<ValidationItemFull[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    
// --- Lógica de Carga CORREGIDA (Mapeo Directo) ---
const fetchPendingPublications = async () => {
    try {
        // 🚨 CAMBIO: Usamos la ruta /api (como en offers/page.tsx)
        const [offersRes, buysellsRes] = await Promise.all([
            api.get<ApiListResponse<DtoFromBackend>>("/api/publications/offers/pending"),
            api.get<ApiListResponse<DtoFromBackend>>("/api/publications/buysells/pending"),
        ]);

        const offersData = offersRes.data.data;
        const buysellsData = buysellsRes.data.data;
        
        // -----------------------------------------------------------------
        // 🚨 CAMBIO: Usamos la nueva función de mapeo directo
        // -----------------------------------------------------------------
        
        const mappedOffers = offersData
            .map(o => {
                const item = mapRawApiToOfferForAdmin(o, false); // Mapea la oferta
                if (!item) return null;
                return { id: item.id, item: item }; // Crea el objeto que espera la lista
            })
            .filter(Boolean) as ValidationItemFull[]; // Filtra los nulos
            
        const mappedBuys = buysellsData
            .map(b => {
                const item = mapRawApiToOfferForAdmin(b, true); // Mapea la compra/venta
                if (!item) return null;
                return { id: `bs-${item.id}`, item: item }; // Crea el objeto (con prefijo bs-)
            })
            .filter(Boolean) as ValidationItemFull[]; // Filtra los nulos
        
        // -----------------------------------------------------------------
        
        const allPending = [...mappedOffers, ...mappedBuys];
        
        setOffers(allPending);
        setError(null); 

    } catch (err: any) {
        console.error("Error fetching pending:", err);
        setError("No se pudieron cargar las publicaciones pendientes. Error: " + err.message);
        setOffers([]); 
    }
}


    useEffect(() => {
        fetchPendingPublications();
    }, []); 

    const source: ValidationItemFull[] = offers ?? [];

    // Lógica de filtro (sin cambios)
    const filtered = useMemo(() => {
        let list = [...source];
        
        if (type !== "Todos") list = list.filter((o) => o.item.type === type);
        
        if (text.trim()) {
            const q = text.toLowerCase();
            list = list.filter((o) => o.item.title.toLowerCase().includes(q));
        }
        
        list.sort((a, b) => a.item.title.localeCompare(b.item.title)); 
        return list;
    }, [text, type, sort, source]);

    // Renderizado (sin cambios)
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--primary)]">
                        Validación de Ofertas
                    </h1>
                    <p className="text-[var(--muted-ink)] mt-2">
                        Revisa y aprueba las publicaciones pendientes de la comunidad UCN.
                    </p>
                    
                    {offers === null && <div className="mt-3 text-sm text-[var(--muted-ink)]">Cargando publicaciones...</div>}
                    {error && (
                        <div className="mt-3 rounded-xl bg-red-100 text-red-800 px-3 py-2 text-sm">{error}</div>
                    )}
                    {offers && (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-purple-100 text-purple-800 px-3 py-1 text-sm font-semibold">
                            <span>🗂️ Publicaciones Pendientes</span>
                            <span className="text-purple-800/70">({offers.length} por revisar)</span>
                        </div>
                    )}
                </header>

                <FilterBar
                    text={text}
                    setText={setText}
                    type={type as any} 
                    setType={setType as any}
                    sort={sort as any} 
                    setSort={setSort as any}
                />

                <section className="mt-8 grid gap-2">
                    {filtered.map((o) => (
                        <ValidationRowLink 
                            key={o.id} 
                            itemId={o.id}
                            item={o.item}
                        />
                    ))}
                    
                    {offers !== null && filtered.length === 0 && (
                        <div className="col-span-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted-ink)]">
                            {offers.length === 0
                                ? "✅ No hay publicaciones pendientes de validación."
                                : "No hay publicaciones que coincidan con tus filtros."
                            }
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}