import { PublishedItem } from "@/models/responses";
import { ClockIcon, UserIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';

interface PublishedItemCardProps {
    item: PublishedItem;
    onViewDetail: (id: number) => void;
}

export default function PublishedCard({ item, onViewDetail }: PublishedItemCardProps) {
    const { id, title, offerType, name, publicationDate, activa } = item; 
    const typeText = typeof offerType === 'string' ? offerType : 'Compra/Venta'; 
    
    // Colores más llamativos para los estados
    const statusClasses = activa
        ? { icon: CheckCircleIcon, text: "ACTIVA", bg: "bg-green-100", textCol: "text-green-700" }
        : { icon: XCircleIcon, text: "INACTIVA", bg: "bg-red-100", textCol: "text-red-700" };

    const handleClick = () => {
        onViewDetail(id);
    };

    return (
        <article className="relative flex flex-col h-full rounded-[2rem] bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group border-4 border-transparent hover:border-indigo-200 overflow-hidden">
            
            {/* Header de la tarjeta */}
            <div className="px-6 pt-6 pb-2 flex justify-between items-start">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 uppercase tracking-wider">
                    {typeText}
                </span>
                
                <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${statusClasses.bg} ${statusClasses.textCol}`}>
                    <statusClasses.icon className="w-4 h-4" />
                    {statusClasses.text}
                </div>
            </div>

            <div className="px-6 py-4 flex-1 flex flex-col">
                <h3 className="text-2xl font-black text-slate-900 leading-tight line-clamp-3 mb-6 group-hover:text-indigo-600 transition-colors">
                    {title || "Sin título"}
                </h3>

                <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                            <UserIcon className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 truncate">{name}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 px-3">
                        <ClockIcon className="w-4 h-4 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500">
                            Publicado: {publicationDate && new Date(publicationDate).getTime() > 0
                                ? new Date(publicationDate).toLocaleDateString("es-CL")
                                : "—"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="p-4 mt-2">
                <button 
                    className="w-full inline-flex items-center justify-center rounded-full px-4 py-4 text-sm font-black text-white bg-slate-900 hover:bg-indigo-600 transition-all duration-300 shadow-md transform active:scale-95"
                    onClick={handleClick} 
                >
                    Administrar
                </button>
            </div>
        </article>
    );
}