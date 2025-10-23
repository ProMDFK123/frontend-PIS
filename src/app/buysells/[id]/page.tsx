"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/services/Service";

type BuySellDetail = {
  id: number;
  title: string;
  description?: string | null;
  category?: string | null;
  price: number;
  location?: string | null;
  publicationDate: string; // ISO
  contactInfo?: string | null;
  userName: string;
  firstImageUrl?: string | null;
};

function toCLDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(+d) ? "—" : d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
}

export default function BuySellDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<BuySellDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get<{ data?: BuySellDetail }>(`/api/publications/buysells/${id}`);
        const d = (res.data?.data ?? res.data) as BuySellDetail;
        if (mounted) setData(d);
      } catch (e: any) {
        setErr("No se pudo cargar la publicación.");
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  if (loading) return <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">Cargando…</main>;
  if (err || !data) return <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">{err ?? "No encontrada."}</main>;

  const imgSrc = data.firstImageUrl || "/generic.png";
  const isEmail = !!data.contactInfo && /@/.test(data.contactInfo);
  const isPhone = !!data.contactInfo && /\+?\d/.test(data.contactInfo) && !isEmail;

  async function copyContact() {
  if (!data || !data.contactInfo) return; // <-- revisa ambas cosas
  try {
    await navigator.clipboard.writeText(data.contactInfo);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  } catch {
    console.error("No se pudo copiar el contacto.");
  }
}

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      {/* Título + vendedor */}
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{data.title}</h1>
        <p className="mt-2 text-[var(--muted-ink)] flex items-center gap-2">
          <span>🧑‍💼</span>
          <span className="truncate">Oferente: <b className="text-[var(--ink)]">{data.userName}</b></span>
        </p>
      </header>

      {/* Grid principal: Galería + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Galería + descripción */}
        <section className="lg:col-span-8 space-y-6">
          {/* Imagen principal grande */}
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <img
              src={imgSrc}
              alt={data.title}
              className="w-full aspect-[16/10] object-cover"
            />
          </div>

          {/* Descripción */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            <div className="border-b border-[var(--border)] px-5 py-3">
              <h2 className="font-semibold">Descripción</h2>
            </div>
            <div className="p-5">
              {data.description ? (
                <p className="whitespace-pre-wrap leading-7 text-[17px]">{data.description}</p>
              ) : (
                <p className="text-[var(--muted-ink)]">Sin descripción.</p>
              )}
            </div>
          </div>
        </section>

        {/* Sidebar: precio/datos/contacto */}
        <aside className="lg:col-span-4 space-y-4">
          {/* Precio + meta */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
            {data.category && (
              <span className="inline-flex items-center rounded-full bg-[var(--chip)] px-3 py-1 text-xs font-medium text-[var(--ink)]/80 mb-3">
                {data.category}
              </span>
            )}

            <div className="text-sm text-[var(--muted-ink)]">Precio</div>
            <div className="text-3xl font-extrabold mt-1">
              {data.price.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })}
            </div>

            <ul className="mt-4 space-y-2 text-[var(--ink)]/90">
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span><b>Ubicación:</b> {data.location || "—"}</span>
              </li>
              <li className="flex items-center gap-2">
                <span>🗓️</span>
                <span><b>Publicado:</b> {toCLDate(data.publicationDate)}</span>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <h3 className="font-semibold mb-2">Contacto</h3>

            {data.contactInfo ? (
              <div className="flex items-center gap-2">
                {isEmail && (
                  <a href={`mailto:${data.contactInfo}`} className="underline break-all">{data.contactInfo}</a>
                )}
                {isPhone && (
                  <a href={`tel:${data.contactInfo.replace(/\s/g, "")}`} className="underline break-all">{data.contactInfo}</a>
                )}
                {!isEmail && !isPhone && <span className="break-all">{data.contactInfo}</span>}

                <button
                  onClick={copyContact}
                  className="ml-auto rounded-lg border border-green-300 bg-white/70 px-3 py-1 text-sm hover:bg-white transition"
                >
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            ) : (
              <p className="text-[var(--muted-ink)]">El oferente no ha dejado un contacto.</p>
            )}

            {isEmail && <p className="mt-2 text-xs text-green-800/80">Toca para abrir tu cliente de correo.</p>}
            {isPhone && <p className="mt-2 text-xs text-green-800/80">Toca para llamar o enviar WhatsApp.</p>}
          </div>
        </aside>
      </div>
    </main>
  );
}
