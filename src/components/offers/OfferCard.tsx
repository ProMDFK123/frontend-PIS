// components/offers/OfferCard.tsx
import Link from "next/link";

export type Offer = {
  id: string;
  title: string;
  type: "Trabajo" | "Voluntariado" | "CompraVenta";
  image: string;
  deadline?: string;
  duration?: string;
  stipend: number;
  postedAt: string;
  owner?: string;
};

function peso(clp: number) {
  if (clp <= 0) return "No disponible";
  return clp.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

export default function OfferCard({ offer }: { offer: Offer }) {
  const { id, title, type, image, deadline, duration, stipend, owner } = offer;
  const isJobLike = type === "Trabajo" || type === "Voluntariado";

  return (
    <Link
      href={`/offers/${id}`}
      className="group block h-full focus:outline-none"              // ⬅️ ocupa toda la celda
      aria-label={`Ver detalles de ${title}`}
    >
      <article
        className="
          relative flex h-full flex-col                              // ⬅️ iguala alturas
          overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]
          shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg
          focus-visible:ring-[3px] focus-visible:ring-[var(--ring)]
        "
      >
        <div className="h-44 w-full overflow-hidden">
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        </div>

        <div className="p-4 flex flex-col flex-1">                   {/* ⬅️ contenido crece */}
          <div className="mb-2">
            <span className="inline-flex items-center rounded-full bg-[var(--chip)] px-3 py-1 text-xs font-medium text-[var(--ink)]/80">
              {type === "Voluntariado"
                ? "Voluntariado"
                : type === "Trabajo"
                ? "Oferta de trabajo"
                : "Compra/venta"}
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-[var(--ink)]">{title}</h3>

          <ul className="mt-3 space-y-2 text-[var(--muted-ink)] text-sm">
            {isJobLike && deadline && (
              <li className="flex items-center gap-2">
                <span>⏰</span>
                <span>
                  Postula hasta:{" "}
                  <strong className="text-[var(--ink)]">
                    {new Date(deadline).toLocaleDateString("es-CL")}
                  </strong>
                </span>
              </li>
            )}

            {isJobLike && duration && (
              <li className="flex items-center gap-2">
                <span>🗓️</span>
                <span>
                  Duración: <strong className="text-[var(--ink)]">{duration}</strong>
                </span>
              </li>
            )}

            <li className="flex items-center gap-2">
              <span>💰</span>
              <span>
                {isJobLike ? "Remuneración" : "Precio"}:{" "}
                <strong className="text-[var(--ink)]">{peso(stipend)}</strong>
              </span>
            </li>

            {owner && (
              <li className="flex items-center gap-2">
                <span>👤</span>
                <span>
                  Oferente: <strong className="text-[var(--ink)]">{owner}</strong>
                </span>
              </li>
            )}
          </ul>

          {/* CTA al fondo para igualar alturas */}
          <div className="mt-auto pt-4">                              {/* ⬅️ empuja al fondo */}
            <span
              className="
                inline-flex items-center justify-center rounded-xl px-4 py-2 text-[15px] font-semibold text-white
                bg-[var(--primary)] hover:opacity-95 transition
              "
            >
              Ver detalles
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
