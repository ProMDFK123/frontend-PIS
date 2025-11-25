"use client";
import { useEffect, useMemo, useState } from "react";
import FilterBar from "src/components/offers/FilterBar";
import api from "src/services/Service";
import Link from "next/link"; 

// Importamos los DTOs, el tipo 'Offer' y los adaptadores de TARJETA
import type { ApiListResponse, OfferBasicDto, BuySellBasicDto } from "src/services/dtos/dto";
import type { Offer } from "src/components/offers/OfferCard"; 
import { mapOfferDtoToCard, mapBuySellDtoToCard } from "src/services/adapters/adapters"; 

import { ValidationType } from "src2/types/admin-publications"; 

// 🚨 CORRECCIÓN CLAVE: La función 'peso' ahora acepta number, null, o undefined 
// y maneja los valores nulos antes de llamar a toLocaleString.
function peso(clp: number | null | undefined) {
    // 🚨 Nueva verificación robusta
    if (typeof clp !== "number" || isNaN(clp) || clp <= 0) {
        return "No disponible";
    }
    return clp.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    });
}

export default function ManagePublicationsPage() {
    const [text, setText] = useState("");
    const [type, setType] = useState<ValidationType>("Todos");
    const [sort, setSort] = useState<"recientes" | "fecha" | "monto">("recientes");
    
    const [publications, setPublications] = useState<Offer[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    
// --- Lógica de Carga ---
const fetchPublishedPublications = async () => {
    try {
        // 🚨 NOTA IMPORTANTE: Si tu API requiere /api/ para esta ruta, debes incluirlo aquí.
        // Si el 404 persiste, cambia la ruta a: "/api/publications/offers/published"
        const [offersRes, buysellsRes] = await Promise.all([
            api.get<ApiListResponse<OfferBasicDto>>("/publications/offers/published"),
            api.get<ApiListResponse<BuySellBasicDto>>("/publications/buysells/published"),
        ]);

        const offersData = offersRes.data.data;
        const buysellsData = buysellsRes.data.data;
        
        const mappedOffers = offersData.filter(o => o && o.id).map(mapOfferDtoToCard);
        const mappedBuys = buysellsData.filter(b => b && b.id).map(mapBuySellDtoToCard);
        
        const allPublished = [...mappedOffers, ...mappedBuys];
        
        setPublications(allPublished);
        setError(null); 

    } catch (err: any) {
        // Si el error es 404/403, es un problema de ruta o autenticación, no de mapeo.
        const status = err.response?.status;
        const msg = (status === 404 || status === 403) 
                    ? `Error ${status}: La API no encontró las publicaciones o la sesión es inválida.` 
                    : "No se pudieron cargar las publicaciones. Intenta nuevamente.";
        
        console.error("Error fetching published:", err);
        setError(msg); 
        setPublications([]); 
    }
}


    useEffect(() => {
        fetchPublishedPublications();
    }, []); 

    const source: Offer[] = publications ?? [];

    // --- Lógica de Filtro (sin cambios) ---
    const filtered = useMemo(() => {
        let list = [...source];
        
        if (type !== "Todos") list = list.filter((o) => o.type === type);
        if (text.trim()) {
            const q = text.toLowerCase();
            list = list.filter((o) => o.title.toLowerCase().includes(q));
        }

        switch (sort) {
          case "fecha":
            list.sort((a, b) => {
              const aj = a.type === "Trabajo" || a.type === "Voluntariado";
              const bj = b.type === "Trabajo" || b.type === "Voluntariado";
              if (aj && bj) return (a.deadline ?? "").localeCompare(b.deadline ?? "");
              if (aj && !bj) return -1;
              if (!aj && bj) return 1;
              return 0;
            });
            break;
          case "monto":
            list.sort((a, b) => (a.stipend ?? 0) - (b.stipend ?? 0));
            break;
          default: // 'recientes'
            list.sort((a, b) => b.postedAt.localeCompare(a.postedAt));
        }
        return list;
    }, [text, type, sort, source]);

    // (El return del header y FilterBar es idéntico)
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <header className="mb-6">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--primary)]">
                        Gestión de Publicaciones
                    </h1>
                    <p className="text-[var(--muted-ink)] mt-2">
                        Administra, edita o elimina publicaciones que ya están activas en la plataforma.
                    </p>
                    
                    {publications === null && <div className="mt-3 text-sm text-[var(--muted-ink)]">Cargando publicaciones...</div>}
                    {error && (
                        <div className="mt-3 rounded-xl bg-red-100 text-red-800 px-3 py-2 text-sm">{error}</div>
                    )}
                    {publications && (
                        <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-green-100 text-green-800 px-3 py-1 text-sm font-semibold">
                            <span>✔️ Publicaciones Activas</span>
                            <span className="text-green-800/70">({publications.length} en total)</span>
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

                {/* Usamos el grid y el JSX de 'OfferCard' */}
                <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((offer) => {
                        // Lógica interna de OfferCard
                        const { id, title, type, image, deadline, duration, stipend, owner } = offer;
                        const isJobLike = type === "Trabajo" || type === "Voluntariado";
                        
                        // URL específica de Admin
                        const detailUrl = `/admin/publications/manage/${id}`;

                        return (
                            <Link
                                href={detailUrl}
                                key={id}
                                className="group block h-full focus:outline-none"
                                aria-label={`Gestionar ${title}`}
                            >
                                <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]
                                                    shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-[3px] focus-visible:ring-[var(--ring)]">
                                    <div className="h-44 w-full overflow-hidden">
                                        <img src={image} alt={title} className="h-full w-full object-cover transition group-hover:scale-[1.02]" />
                                    </div>

                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="mb-2">
                                            <span className="inline-flex items-center rounded-full bg-[var(--chip)] px-3 py-1 text-xs font-medium text-[var(--ink)]/80">
                                                {type === "Voluntariado" ? "Voluntariado" : type === "Trabajo" ? "Oferta de trabajo" : "Compra/venta"}
                                            </span>
                                        </div>

                                        <h3 className="text-lg font-extrabold text-[var(--ink)]">{title}</h3>

                                        <ul className="mt-3 space-y-2 text-[var(--muted-ink)] text-sm">
                                            {isJobLike && deadline && (
                                                <li className="flex items-center gap-2">
                                                    <span>⏰</span>
                                                    <span>
                                                        Postula hasta: <strong className="text-[var(--ink)]">{new Date(deadline).toLocaleDateString("es-CL")}</strong>
                                                    </span>
                                                </li>
                                            )}
                                            {isJobLike && duration && (
                                                <li className="flex items-center gap-2">
                                                    <span>🗓️</span>
                                                    <span>Duración: <strong className="text-[var(--ink)]">{duration}</strong></span>
                                                </li>
                                            )}
                                            <li className="flex items-center gap-2">
                                                <span>💰</span>
                                                {/* 🚨 LLAMADA CORREGIDA A LA FUNCIÓN SEGURA */}
                                                <span>{isJobLike ? "Remuneración" : "Precio"}: <strong className="text-[var(--ink)]">{peso(stipend)}</strong></span>
                                            </li>
                                            {owner && (
                                                <li className="flex items-center gap-2">
                                                    <span>👤</span>
                                                    <span>Usuario: <strong className="text-[var(--ink)]">{owner}</strong></span>
                                                </li>
                                            )}
                                        </ul>

                                        <div className="mt-auto pt-4">
                                            {/* Botón modificado */}
                                            <span className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-[15px] font-semibold text-white bg-[var(--primary)] hover:opacity-95 transition">
                                                Gestionar
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        );
                    })}
                    
                    {/* Mensaje de "no resultados" adaptado al grid */}
                    {publications !== null && filtered.length === 0 && ( 
                        <div className="col-span-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted-ink)]">
                            {publications.length === 0 
                                ? "✅ No hay publicaciones activas en este momento." 
                                : "No hay publicaciones que coincidan con tus filtros."
                            }
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}