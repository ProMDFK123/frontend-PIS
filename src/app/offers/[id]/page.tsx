"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import api from "public/src/services/Service";
import Link from "next/link";

type OfferDetail = {
  id: number;
  title: string;
  description?: string | null;
  companyName?: string | null;
  ownerName?: string | null;
  location?: string | null;
  postDate?: string | null;
  publicationDate?: string | null;
  endDate?: string | null;
  deadlineDate?: string | null;
  remuneration?: number | null;
  offerType?: number | "Trabajo" | "Voluntariado";
};

function toCLDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(+d) ? "—" : d.toLocaleDateString("es-CL");
}
function parseType(t: OfferDetail["offerType"]) {
  const v = String(t);
  return v === "Voluntariado" || v === "1" ? "Voluntariado" : "Trabajo";
}
function money(n?: number | null) {
  if (typeof n !== "number" || isNaN(n)) return "No disponible";
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [data, setData] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // UI postulación
  const [applyLoading, setApplyLoading] = useState(false);
  const [applyMsg, setApplyMsg] = useState<string | null>(null);
  const [motivation, setMotivation] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get<{ data?: OfferDetail }>(`/api/publications/offers/${id}`);
        const d = (res.data?.data ?? res.data) as OfferDetail;
        if (mounted) setData(d);
      } catch {
        setErr("No se pudo cargar la publicación.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const offerType = useMemo(() => parseType(data?.offerType), [data?.offerType]);
  const company = data?.companyName ?? data?.ownerName ?? "Confidencial";
  const published = toCLDate(data?.postDate ?? data?.publicationDate);
  const deadline = toCLDate(data?.endDate ?? data?.deadlineDate);

  async function handleApply() {
    if (!id) return;
    setApplyLoading(true);
    setApplyMsg(null);
    try {
      // Si es trabajo y adjuntaron algo, manda multipart; si no, POST vacío.
      if (offerType === "Trabajo" && (cvFile || motivation.trim())) {
        const form = new FormData();
        if (motivation.trim()) form.append("motivation", motivation.trim());
        if (cvFile) form.append("cv", cvFile);
        await api.post(`/api/publications/offers/${id}/apply`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(`/api/publications/offers/${id}/apply`);
      }
      setApplyMsg("✅ Postulación enviada.");
      setMotivation("");
      setCvFile(null);
    } catch (e: any) {
      const m =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "No se pudo postular. Intenta más tarde.";
      setApplyMsg(`❌ ${m}`);
    } finally {
      setApplyLoading(false);
    }
  }

  if (loading) return <main className="max-w-4xl mx-auto p-6">Cargando…</main>;
  if (err || !data) return <main className="max-w-4xl mx-auto p-6">{err ?? "No encontrada."}</main>;

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold break-words">{data.title}</h1>
          <p className="text-[var(--muted-ink)] mt-1 flex items-center gap-2">
            <span>🏢</span>
            <span className="truncate">{company}</span>
          </p>
        </div>
        <div className="hidden sm:block">
          <img src="/generic.png" alt="Publicación" className="w-20 h-20 rounded-xl object-cover border border-[var(--border)]" />
        </div>
      </section>

      {/* Body */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 space-y-5">
        {/* Meta */}
        <ul className="grid md:grid-cols-3 gap-3 text-[var(--ink)]/90">
          <li>
            📅 <b>Postula hasta:</b>{" "}
            {data?.endDate
              ? new Date(data.endDate).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })
              : "—"}
          </li>

          <li>
            🕒 <b>Duración:</b>{" "}
            {data?.postDate && data?.endDate ? (
              <>
                {new Date(data.postDate).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })} –{" "}
                {new Date(data.endDate).toLocaleDateString("es-CL", { day: "2-digit", month: "short" })}
              </>
            ) : "—"}
          </li>

          <li>
            💰 <b>Remuneración:</b> {money(data.remuneration)}
          </li>
        </ul>

        {/* Descripción */}
        {data.description ? (
          <div className="prose max-w-none">
            <h3 className="font-bold mb-2">Descripción:</h3>
            <p className="whitespace-pre-wrap text-[17px] leading-7">{data.description}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50/90 text-yellow-800 px-3 py-2 text-sm">
            Inicia sesión como estudiante para ver la descripción completa y la remuneración.
          </div>
        )}

        {/* Postular */}
        <div className="pt-2">
          {offerType === "Trabajo" && (
            <div className="mb-4 space-y-3">
              <label className="block text-sm font-medium">Carta de motivación (opcional)</label>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Escribe brevemente por qué te interesa este cargo…"
                className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ring)] min-h-[90px]"
              />
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                  className="text-sm"
                />
                {cvFile && <span className="text-sm text-[var(--muted-ink)] truncate max-w-[220px]">{cvFile.name}</span>}
              </div>
              <p className="text-xs text-[var(--muted-ink)]">
                Si no tienes CV cargado en tu perfil, puedes adjuntarlo aquí. También puedes gestionarlo en{" "}
                <Link href="/profile" className="underline">tu perfil</Link>.
              </p>
            </div>
          )}

          <button
            onClick={handleApply}
            disabled={applyLoading}
            className="w-full md:w-auto rounded-xl bg-[var(--primary)] text-white px-5 py-2 font-semibold disabled:opacity-60"
          >
            {applyLoading ? "Enviando…" : "Postular"}
          </button>

          {applyMsg && <p className="mt-2 text-sm">{applyMsg}</p>}
        </div>
      </section>

      <div className="text-sm text-[var(--muted-ink)]">
        Publicada: {published}{data.location ? ` · Ubicación: ${data.location}` : ""}
      </div>
    </main>
  );
}
