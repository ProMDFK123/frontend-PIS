"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/Service";

type JobApplication = {
  id: number;
  studentName: string;
  studentEmail: string;
  offerId?: number | null;
  offerTitle: string;
  status: "Pendiente" | "Seleccionado" | "No seleccionado" | string;
  applicationDate: string;
  curriculumVitae?: string | null;
  motivationLetter?: string | null;
};

type ApiResponse = { message: string; data: JobApplication[] };

function toCLDate(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(+d)
    ? "—"
    : d.toLocaleDateString("es-CL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
}

function StatusBadge({ value }: { value?: string | null }) {
  const v = (value ?? "Pendiente").toLowerCase();
  const map: Record<string, { wrap: string; label: string }> = {
    pendiente: {
      wrap: "bg-yellow-100 text-yellow-800 border-yellow-200",
      label: "Pendiente",
    },
    accepted: {
      wrap: "bg-green-100 text-green-800 border-green-200",
      label: "Aceptada",
    },
    rejected: {
      wrap: "bg-red-100 text-red-800 border-red-200",
      label: "Rechazada",
    },
    seleccionado: {
      wrap: "bg-green-100 text-green-800 border-green-200",
      label: "Seleccionado",
    },
    "no seleccionado": {
      wrap: "bg-red-100 text-red-800 border-red-200",
      label: "No seleccionado",
    },
  };
  const { wrap, label } = map[v] ?? map.pendiente;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm border ${wrap}`}
    >
      {label}
    </span>
  );
}

function cardAccent(status?: string | null) {
  const v = (status ?? "Pendiente").toLowerCase();
  if (v === "accepted" || v === "seleccionado") return "border-green-200 hover:ring-green-100/60";
  if (v === "rejected" || v === "no seleccionado") return "border-red-200 hover:ring-red-100/60";
  return "border-yellow-200 hover:ring-yellow-100/60"; // pendiente
}

export default function JobsHistoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await api.get<ApiResponse>(
          "/job-applications/my-applications"
        );
        if (mounted) setItems(res.data?.data ?? []);
      } catch (e) {
        console.error(e);
        setError(
          "No pudimos cargar tus postulaciones. Inicia sesión nuevamente si el problema persiste."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <main className="max-w-4xl mx-auto p-6">Cargando…</main>;

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold">
          Historial de postulaciones
        </h1>
        <p className="text-[var(--muted-ink)] mt-2">
          Aquí puedes revisar todas las postulaciones que has enviado.
        </p>
        {error && (
          <div className="mt-3 rounded-xl bg-red-50 text-red-700 px-3 py-2 text-sm">
            {error}
          </div>
        )}
      </header>

      {items.length === 0 ? (
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-[var(--muted-ink)]">
          Aún no tienes postulaciones registradas.
        </section>
      ) : (
        <section className="space-y-3">
          {items.map((it) => (
            <article
              key={it.id}
              className={[
                "group relative overflow-hidden rounded-2xl border bg-[var(--card)] p-4 shadow-sm transition",
                "hover:shadow-md hover:ring-4",
                cardAccent(it.status),
              ].join(" ")}
            >
              {/* Accent lateral sutil */}
              <span
                aria-hidden="true"
                className={[
                  "absolute inset-y-0 left-0 w-1",
                  (it.status ?? "Pendiente").toLowerCase() === "accepted" &&
                    "bg-green-400",
                  (it.status ?? "Pendiente").toLowerCase() === "rejected" &&
                    "bg-red-400",
                  (it.status ?? "Pendiente").toLowerCase() === "seleccionado" &&
                    "bg-green-400",
                  (it.status ?? "Pendiente").toLowerCase() === "no seleccionado" &&
                    "bg-red-400",
                  (it.status ?? "Pendiente").toLowerCase() !== "accepted" &&
                    (it.status ?? "Pendiente").toLowerCase() !== "rejected" &&
                    (it.status ?? "Pendiente").toLowerCase() !== "seleccionado" &&
                    (it.status ?? "Pendiente").toLowerCase() !== "no seleccionado" &&
                    "bg-yellow-400",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="font-bold text-[17px] truncate">
                    {it.offerTitle}
                  </h3>
                  <div className="text-sm text-[var(--muted-ink)] mt-0.5">
                    Enviada por {it.studentName}
                  </div>
                </div>
                <StatusBadge value={it.status} />
              </div>

              <div className="mt-3 text-sm text-[var(--muted-ink)]">
                Postulada el {toCLDate(it.applicationDate)}
              </div>

              <div className="mt-3 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex flex-wrap gap-3">
                  {it.curriculumVitae && (
                    <a
                      href={it.curriculumVitae}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline hover:opacity-90"
                    >
                      Ver CV
                    </a>
                  )}
                  {it.motivationLetter && (
                    <p className="text-sm italic text-[var(--ink)]/80 line-clamp-2">
                      "{it.motivationLetter}"
                    </p>
                  )}
                </div>

                {/* BOTÓN VER DETALLES */}
                <button
                  onClick={() => router.push(`/jobs/history/${it.id}`)}
                  className="px-4 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Ver detalles
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}