// app/offers/page.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/offers/FilterBar";
import OfferCard, { Offer } from "@/components/offers/OfferCard";
import api from "@/services/Service";
import type { ApiListResponse, OfferBasicDto, BuySellBasicDto } from "@/services/dtos/dto";
import { mapOfferDtoToCard, mapBuySellDtoToCard } from "@/services/adapters/adapters";

const SEED: Offer[] = [ /* ... seeds... */ ];

export default function OffersPage() {
  const [text, setText] = useState("");
  const [type, setType] = useState<"Todos" | "Trabajo" | "Voluntariado" | "CompraVenta">("Todos");
  const [sort, setSort] = useState<"recientes" | "fecha" | "monto">("recientes");
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<ApiListResponse<OfferBasicDto>>("/api/publications/offers"),
      api.get<ApiListResponse<BuySellBasicDto>>("/api/publications/buysells"),
    ])
      .then(([offersRes, buysellsRes]) => {
        const mappedOffers = offersRes.data.data.map(mapOfferDtoToCard);
        const mappedBuys = buysellsRes.data.data.map(mapBuySellDtoToCard);
        const merged = [...mappedOffers, ...mappedBuys];
        setOffers(merged);
        console.log("API OK ->", { offers: mappedOffers.length, buysells: mappedBuys.length });
      })
      .catch(err => {
        console.error("API ERR ->", err);
        setError("No pudimos cargar las publicaciones. Intenta nuevamente.");
        setOffers([]); // evita null
      });
  }, []);

  const source: Offer[] = offers ?? SEED;

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
      default:
        list.sort((a, b) => b.postedAt.localeCompare(a.postedAt)); // recientes primero
    }
    return list;
  }, [text, type, sort, source]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold">Encuentra tu próximo trabajo</h1>
        <p className="text-[var(--muted-ink)] mt-2">
          Conecta con oportunidades pensadas para la comunidad UCN.
        </p>

        {offers === null && <div className="mt-3 text-sm text-[var(--muted-ink)]">Cargando…</div>}
        {error && (
          <div className="mt-3 rounded-xl bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>
        )}
        {offers && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[var(--chip)] px-3 py-1 text-sm">
            <span>✅ Conectado</span>
            <span className="text-[var(--ink)]/70">({offers.length} publicaciones)</span>
          </div>
        )}
      </header>

      <FilterBar
        text={text}
        setText={setText}
        type={type}
        setType={setType}
        sort={sort}
        setSort={setSort}
      />

      <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((o) => (
          <OfferCard key={o.id} offer={o} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted-ink)]">
            No encontramos resultados con esos filtros.
          </div>
        )}
      </section>
    </main>
  );
}