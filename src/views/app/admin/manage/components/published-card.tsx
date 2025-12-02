import { PublishedItem } from "@/models/responses";
import { ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';

function peso(clp: number): string {
    if (clp <= 0) return "No disponible";
    return clp.toLocaleString("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    });
}

interface PublishedItemCardProps {
    item: PublishedItem;
    onViewDetail: (id: number) => void;
}

export default function PublishedCard({ item, onViewDetail }: PublishedItemCardProps) {
    const { id, title, offerType, name, publicationDate, activa } = item; 
    const typeText = typeof offerType === 'string' ? offerType : 'Compra/Venta'; 
    const statusClasses = activa
        ? { icon: CheckCircleIcon, text: "ACTIVA", color: "bg-green-100 text-green-800" }
        : { icon: XCircleIcon, text: "INACTIVA", color: "bg-red-100 text-red-800" };
    const handleClick = () => {
        onViewDetail(id);
    };
    return (
        <article className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]
                            shadow-sm transition hover:shadow-lg">
            <div className={`absolute top-0 right-0 m-3 z-10 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusClasses.color}`}>
                <statusClasses.icon className="w-4 h-4 mr-1" />
                {statusClasses.text}
            </div>
            <div className="p-4 flex flex-col flex-1">
                <div className="mb-2">
                    <span className="inline-flex items-center rounded-full bg-[var(--chip)] px-3 py-1 text-xs font-medium text-[var(--ink)]/80">
                        {typeText}
                    </span>
                </div>

                <h3 className="text-xl font-extrabold text-[var(--ink)] mb-4">{title || "Publicación sin título"}</h3>

                <ul className="space-y-2 text-[var(--muted-ink)] text-sm">
                    {/* Publicado por */}
                    <li className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>Publicado por: <strong className="text-[var(--ink)]">{name}</strong></span>
                    </li>
                    {/* Fecha de Publicación */}
                    <li className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>
                            Fecha: <strong className="text-[var(--ink)]">
                                {publicationDate && new Date(publicationDate).getTime() > 0 
                                    ? new Date(publicationDate).toLocaleDateString("es-CL")
                                    : "Fecha no disponible"}
                            </strong>
                        </span>
                    </li>
                </ul>

                <div className="mt-auto pt-4 flex gap-3">
                    <button 
                        className="flex-1 inline-flex items-center justify-center rounded-xl px-4 py-2 text-[15px] font-semibold text-white bg-[var(--primary)] hover:opacity-95 transition"
                        onClick={handleClick} 
                    >
                        Ver Detalles
                    </button>
                </div>
            </div>
        </article>
    );
}