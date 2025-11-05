// app/admin/offers/validate/page.tsx

"use client";
import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/offers/FilterBar";
import api from "@/services/Service";
import type { ApiListResponse, OfferBasicDto, BuySellBasicDto } from "@/services/dtos/dto";
import { mapOfferDtoToValidate, mapBuySellDtoToValidate } from "@/services/adapters/adapters"; 
import { PendingOffersForAdminDto } from "@/services/dtos/adminDto";

// 🚨 Importar el componente de LINK que se crea abajo
import ValidationRowLink from "@/components/admin/ValidationRowLink"; 
// 🚨 Importar las interfaces correctas de su nueva ubicación
import { ValidationType, ValidationItemFull } from "@/types/admin-publications"; 


export default function ValidationPage() {
    const [text, setText] = useState("");
    const [type, setType] = useState<ValidationType>("Todos");
    const [sort, setSort] = useState<"recientes" | "titulo">("recientes");
    const [offers, setOffers] = useState<ValidationItemFull[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    


const fetchPendingPublications = async () => {
    try {
        const [offersRes, buysellsRes] = await Promise.all([
            // La ruta es correcta, el problema está en la respuesta o el mapeo
            api.get<ApiListResponse<PendingOffersForAdminDto>>("/publications/offers/pending"),
            api.get<ApiListResponse<BuySellBasicDto>>("/publications/buysells/pending"),
        ]);

        // 1. OBTENER DATOS SIN FILTROS PREVIOS: 
        // Accedemos directamente al array de datos para cada respuesta.
        const offersData = offersRes.data.data;
        const buysellsData = buysellsRes.data.data;
        
        // 2. Mapeo y Filtro estricto para integridad del ID (¡Causa del "undefined" y fallas!)
        const mappedOffers = offersData.filter(o => o && o.id).map(o => ({
            // Si o.id es nulo aquí, el problema es la estructura de la API.
            id: String(o.id), 
            item: mapOfferDtoToValidate(o), 
        }));
            
        const mappedBuys = buysellsData
            .filter(b => b && b.id)
            .map(b => ({
                id: `bs-${String(b.id)}`,
                item: mapBuySellDtoToValidate(b),
            }));
        
        // 3. Combinación de los resultados mapeados
        const allPending = [...mappedOffers, ...mappedBuys];
        
        // Si allPending tiene datos, se muestra la cuenta total.
        setOffers(allPending);
        setError(null); 

    } catch (err) {
        // ... (Manejo de error) ...
        setOffers([]); 
    }
}


    useEffect(() => {
        fetchPendingPublications();
    }, []); 

    const source: ValidationItemFull[] = offers ?? [];

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
                        // 🚨 USAMOS EL COMPONENTE DE FILA LINK AHORA
                        <ValidationRowLink 
                            key={o.id} 
                            itemId={o.id}
                            item={o.item}
                        />
                    ))}
                    {filtered.length === 0 && (
                        <div className="col-span-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted-ink)]">
                            ✅ No hay publicaciones pendientes de validación.
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

