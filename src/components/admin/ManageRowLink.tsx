// src/components/admin/ManageRowLink.tsx

import React from 'react';
import Link from 'next/link';
// Asumo que OfferForAdmin está importada de '@/types/admin-publications'
import { OfferForAdmin } from 'src/types/admin-publications'; 

interface ManageRowLinkProps {
    itemId: string;
    item: OfferForAdmin;
}

// Lógica de estilo (sin cambios)
function getTypeInfo(type: OfferForAdmin["type"]) {
    let text: string;
    let colorClass: string;
    if (type === "CompraVenta") {
        text = "Compra y venta";
        colorClass = "bg-[#F3E5F5] text-[#9C27B0]"; 
    } else {
        text = "Ofertas de trabajo";
        colorClass = "bg-[#E3F2FD] text-[#2196F3]"; 
    }
    return { text, colorClass };
}

export default function ManageRowLink({ itemId, item }: ManageRowLinkProps) {
    const { text, colorClass } = getTypeInfo(item.type);
    
    // 🚨 Esta es la parte importante: La URL apunta a la nueva ruta 'manage'
    const detailUrl = `/admin/publications/manage/${itemId}`; 

    return (
        // El resto del componente es idéntico al ValidationRowLink
        <Link href={detailUrl} className="group block w-full focus:outline-none">
            <article 
                className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-white
                           transition duration-200 hover:border-blue-500/50 hover:shadow-md hover:bg-gray-50"
            >
                {/* --- Título Principal --- */}
                <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-semibold text-lg text-[var(--ink)] truncate 
                                   group-hover:text-[var(--primary)] transition duration-150">
                        {item.title}
                    </h3>
                </div>

                {/* --- Botón de Tipo (Badge) --- */}
                <div className="flex items-center gap-4 shrink-0">
                    <span 
                        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-semibold ${colorClass}`}
                    >
                        {text}
                    </span>
                </div>
            </article>
        </Link>
    );
}