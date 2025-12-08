"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/services/Service";
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

type BannerState = {
  title: string;
  message: string;
  type: "success" | "error";
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
  return n.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

export default function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [data, setData] = useState<OfferDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // UI postulación
  const [applyLoading, setApplyLoading] = useState(false);
  const [motivation, setMotivation] = useState("");
  const [cvFile, setCvFile] = useState<File | null>(null);

  const [hasApplied, setHasApplied] = useState(false);
  const [banner, setBanner] = useState<BannerState | null>(null);

  const [bannerVisible, setBannerVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationVisible, setCelebrationVisible] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get<{ data?: OfferDetail }>(
          `/publications/offers/${id}`
        );
        console.log("📦 Respuesta completa del backend:", res.data);
        const d = (res.data?.data ?? res.data) as OfferDetail;
        console.log("📋 Datos procesados:", d);
        if (mounted) setData(d);
      } catch (e) {
        console.error("❌ Error al cargar oferta:", e);
        setErr("No se pudo cargar la publicación.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!banner) return;

    setBannerVisible(true); // entra

    const timer = setTimeout(() => {
      setBannerVisible(false); // empieza a salir
      setTimeout(() => {
        setBanner(null); // se desmonta después de la animación
      }, 200);
    }, 3500); // tiempo que queda visible

    return () => clearTimeout(timer);
  }, [banner]);

  function handleCloseBanner() {
    setBannerVisible(false);
    setTimeout(() => setBanner(null), 200);
  }
  useEffect(() => {
    if (!showCelebration) return;

    setCelebrationVisible(true); // entra

    const timer = setTimeout(() => {
      setCelebrationVisible(false); // empieza a salir
      setTimeout(() => {
        setShowCelebration(false); // se desmonta después
      }, 200);
    }, 1800); // tiempo visible

    return () => clearTimeout(timer);
  }, [showCelebration]);

  const offerType = useMemo(
    () => parseType(data?.offerType),
    [data?.offerType]
  );
  const company = data?.companyName ?? data?.ownerName ?? "Confidencial";
  const published = toCLDate(data?.postDate ?? data?.publicationDate);

  async function handleApply() {
    if (!id || hasApplied) return;

    setApplyLoading(true);
    setBanner(null);

    try {
      if (offerType === "Trabajo" && (cvFile || motivation.trim())) {
        const form = new FormData();
        if (motivation.trim()) form.append("motivation", motivation.trim());
        if (cvFile) form.append("cv", cvFile);
        await api.post(`/publications/offers/${id}/apply`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post(`/publications/offers/${id}/apply`);
      }

      // éxito
      setMotivation("");
      setCvFile(null);
      setHasApplied(true);

      setBanner({
        title: "Postulación enviada",
        message:
          "Tu postulación fue realizada con éxito; se te notificará cuando tu postulación sea aceptada.",
        type: "success",
      });

      // mini-celebración centrada
      setShowCelebration(true);
    } catch (e: any) {
      const raw =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "No se pudo postular. Intenta más tarde.";

      // Verificar si es error 409 (Conflict) o mensaje de "ya has postulado"
      const is409 = e?.response?.status === 409;
      const alreadyApplied = is409 || /ya has postulado/i.test(raw);

      if (alreadyApplied) {
        setHasApplied(true);
        setBanner({
          title: "Ya estás postulado",
          message:
            "Ya tienes una postulación activa para esta oferta. Puedes revisar su estado en tu historial de postulaciones.",
          type: "success",
        });
      } else {
        setBanner({
          title: "No se pudo postular",
          message: raw,
          type: "error",
        });
      }
    } finally {
      setApplyLoading(false);
    }
  }
  useEffect(() => {
    if (!showCelebration) return;
    const t = setTimeout(() => setShowCelebration(false), 2500);
    return () => clearTimeout(t);
  }, [showCelebration]);

  if (loading) return <main className="max-w-4xl mx-auto p-6">Cargando…</main>;
  if (err || !data)
    return (
      <main className="max-w-4xl mx-auto p-6">{err ?? "No encontrada."}</main>
    );

  return (
    <main className="relative max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      {/* Banner flotante arriba (esquina derecha) */}
      {banner && (
        <div
          className={`fixed top-4 right-4 z-50 w-full max-w-sm px-4 transition-all duration-1600 ease-out
            ${
              bannerVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-3 opacity-0"
            }`}
        >
          <div
            className={`rounded-2xl border shadow-lg px-4 py-3 text-sm bg-[var(--card)] ${
              banner.type === "success" ? "border-green-200" : "border-red-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-[var(--ink)]">
                  {banner.title}
                </h2>
                <p className="mt-1 text-[var(--muted-ink)] text-xs md:text-sm">
                  {banner.message}
                </p>
              </div>
              <button
                onClick={handleCloseBanner}
                className="text-xs text-[var(--muted-ink)] hover:text-[var(--ink)]"
                aria-label="Cerrar notificación"
              >
                ✕
              </button>
            </div>

            {banner.type === "success" && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => router.push("/jobs/history")}
                  className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white hover:opacity-95"
                >
                  Ver estado
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popup de celebración liviano */}
      {showCelebration && (
        <div
          className={`fixed left-1/2 top-120 z-40 -translate-x-1/2 transition-all duration-1600 ease-out
            ${
              celebrationVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-3 opacity-0"
            }`}
        >
          <div className="flex items-center gap-2 rounded-full bg-[var(--primary)] text-white px-4 py-2 shadow-lg">
            <span className="text-lg">🎉</span>
            <p className="text-sm font-semibold">¡Postulación enviada!</p>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-extrabold break-words">
            {data.title}
          </h1>
          <p className="text-[var(--muted-ink)] mt-1 flex items-center gap-2">
            <span>🏢</span>
            <span className="truncate">{company}</span>
          </p>
        </div>
        <div className="hidden sm:block">
          <img
            src="/generic.png"
            alt="Publicación"
            className="w-20 h-20 rounded-xl object-cover border border-[var(--border)]"
          />
        </div>
      </section>

      {/* Body */}
      <section className="rounded-2xl bg-[var(--card)] border border-[var(--border)] p-5 space-y-5">
        {/* Meta */}
        <ul className="grid md:grid-cols-3 gap-3 text-[var(--ink)]/90">
          <li>
            📅 <b>Postula hasta:</b>{" "}
            {data?.endDate
              ? new Date(data.endDate).toLocaleDateString("es-CL", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </li>

          <li>
            🕒 <b>Duración:</b>{" "}
            {data?.postDate && data?.endDate ? (
              <>
                {new Date(data.postDate).toLocaleDateString("es-CL", {
                  day: "2-digit",
                  month: "short",
                })}{" "}
                –{" "}
                {new Date(data.endDate).toLocaleDateString("es-CL", {
                  day: "2-digit",
                  month: "short",
                })}
              </>
            ) : (
              "—"
            )}
          </li>

          <li>
            💰 <b>Remuneración:</b> {money(data.remuneration)}
          </li>
        </ul>

        {/* Descripción */}
        {data.description ? (
          <div className="prose max-w-none">
            <h3 className="font-bold mb-2">Descripción:</h3>
            <p className="whitespace-pre-wrap text-[17px] leading-7">
              {data.description}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-yellow-300 bg-yellow-50/90 text-yellow-800 px-3 py-2 text-sm">
            Inicia sesión como estudiante para ver la descripción completa y la
            remuneración.
          </div>
        )}

        {/* Postular */}
        <div className="pt-2">
          {offerType === "Trabajo" && (
            <div className="mb-4 space-y-3">
              <label className="block text-sm font-medium">
                Carta de motivación (opcional)
              </label>
              <textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                placeholder="Escribe brevemente por qué te interesa este cargo…"
                className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ring)] min-h-[90px]"
              />

              {/* Input de archivo mejorado */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--ink)] hover:bg-slate-50">
                  Seleccionar archivo
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setCvFile(e.target.files?.[0] ?? null)}
                    className="hidden"
                  />
                </label>

                <span className="text-sm text-[var(--muted-ink)] truncate max-w-full sm:max-w-[260px]">
                  {cvFile ? cvFile.name : "Sin archivos seleccionados"}
                </span>
              </div>

              <p className="text-xs text-[var(--muted-ink)]">
                Si no tienes CV cargado en tu perfil, puedes adjuntarlo aquí.
                También puedes gestionarlo en{" "}
                <Link href="/profile" className="underline">
                  tu perfil
                </Link>
                .
              </p>
            </div>
          )}

          <button
            onClick={handleApply}
            disabled={applyLoading || hasApplied}
            className={`w-full md:w-auto rounded-xl px-5 py-2 font-semibold disabled:opacity-60 ${
              hasApplied
                ? "bg-[var(--chip)] text-[var(--ink)]"
                : "bg-[var(--primary)] text-white"
            }`}
          >
            {applyLoading ? "Enviando…" : hasApplied ? "Postulado" : "Postular"}
          </button>
        </div>
      </section>

      <div className="text-sm text-[var(--muted-ink)]">
        Publicada: {published}
        {data.location ? ` · Ubicación: ${data.location}` : ""}
      </div>
    </main>
  );
}
