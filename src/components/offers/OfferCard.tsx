// components/offers/OfferCard.tsx
export type Offer = {
  id: string;
  title: string;
  type: "Trabajo" | "CompraVenta";
  image: string;

  // 👇 campos visibles en la card
  deadline: string;   // fecha límite de postulación (YYYY-MM-DD)
  duration?: string;  // duración del trabajo (texto libre, opcional)
  stipend: number;    // remuneración CLP (0 si no aplica)

  // 👇 campos internos (para ordenar/recientes)
  postedAt: string;   // YYYY-MM-DD

  // ❌ intencionalmente removidos del UI: area, company, location
};

function peso(clp: number) {
  if (clp <= 0) return "No disponible";
  return clp.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export default function OfferCard({ offer }: { offer: Offer }) {
  const { title, type, image, deadline, duration, stipend } = offer;

  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <div className="h-44 w-full overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="p-4">
        {/* Etiqueta “tipo” muy sutil */}
        <div className="mb-2">
          <span className="inline-flex items-center rounded-full bg-[var(--chip)] px-3 py-1 text-xs font-medium text-[var(--ink)]/80">
            {type === "Trabajo" ? "Oferta de trabajo" : "Compra/venta"}
          </span>
        </div>

        <h3 className="text-lg font-extrabold text-[var(--ink)]">{title}</h3>

        <ul className="mt-3 space-y-2 text-[var(--muted-ink)] text-sm">
          <li className="flex items-center gap-2">
            <span>⏰</span>
            <span>
              Postula hasta:{" "}
              <strong className="text-[var(--ink)]">
                {new Date(deadline).toLocaleDateString("es-CL")}
              </strong>
            </span>
          </li>

          {duration && (
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
              Remuneración: <strong className="text-[var(--ink)]">{peso(stipend)}</strong>
            </span>
          </li>
        </ul>

        <div className="mt-4">
          <button
            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-[15px] font-semibold text-white
                       bg-[var(--primary)] hover:opacity-95 transition"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </article>
  );
}
