"use client";
import { useMemo, useState } from "react";
import FilterBar from "@/components/offers/FilterBar";
import OfferCard, { Offer } from "@/components/offers/OfferCard";

const SEED: Offer[] = [
  { id:"1", title:"Apoyo en feria UCN", type:"Trabajo", image:"/generic.png",
    deadline:"2025-09-20", postedAt:"2025-09-15", duration:"1 día (evento)", stipend:55000, owner:"FEUCN" },
  { id:"2", title:"Diseño flyer (freelance)", type:"Trabajo", image:"/generic.png",
    deadline:"2025-09-25", postedAt:"2025-09-16", duration:"Entrega única", stipend:40000, owner:"Deportes UCN" },
  { id:"3", title:"Venta de libros usados Cálculo I", type:"CompraVenta", image:"/generic.png",
    postedAt:"2025-09-14", stipend:12000, owner:"Ignacio Rojas" },
  { id:"4", title:"Clases de inglés (B1 → B2)", type:"Trabajo", image:"/generic.png",
    deadline:"2025-10-01", postedAt:"2025-09-17", duration:"2 meses (2h/sem)", stipend:0, owner:"Sofía Campos" },
];


export default function OffersPage() {
  const [text, setText] = useState("");
  const [type, setType] = useState<"Todos" | "Trabajo" | "CompraVenta">("Todos");
  const [sort, setSort] = useState<"recientes" | "fecha" | "monto">("recientes");

  const filtered = useMemo(() => {
    let list = [...SEED];

    if (type !== "Todos") list = list.filter((o) => o.type === type);

    if (text.trim()) {
      const q = text.toLowerCase();
      list = list.filter((o) => o.title.toLowerCase().includes(q));
    }

    switch (sort) {
      case "fecha":
        // primero trabajos por fecha; compra/venta (sin deadline) al final
        list.sort((a, b) => {
          const aj = a.type === "Trabajo";
          const bj = b.type === "Trabajo";
          if (aj && bj) return (a.deadline ?? "").localeCompare(b.deadline ?? "");
          if (aj && !bj) return -1; // trabajos arriba
          if (!aj && bj) return 1;
          return 0; // ambos compra/venta
        });
        break;
      case "monto":
        // precio/remuneración MÁS BAJO primero
        list.sort((a, b) => (a.stipend ?? 0) - (b.stipend ?? 0));
        break;
      default:
        // recientes primero por postedAt
        list.sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    }
    return list;
  }, [text, type, sort]);

  return (

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold">Encuentra tu próximo trabajo</h1>
          <p className="text-[var(--muted-ink)] mt-2">
            Conecta con oportunidades pensadas para la comunidad UCN.
          </p>
        </header>

        {/* Filtros reducidos */}
        <FilterBar
          text={text}
          setText={setText}
          type={type}
          setType={setType}
          sort={sort}
          setSort={setSort}
        />

        {/* Grid de tarjetas */}
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
