import React from 'react';
import Link from 'next/link';
import { cn } from 'src/lib'; 
import { getOfferTypeDisplay } from '@/lib'; 
import { AdminItemBase } from '@/models/responses'; 
import { ArrowRight, Briefcase, Heart, ShoppingBag } from 'lucide-react';

interface ValidationRowLinkProps {
    itemId: string;
    item: AdminItemBase;
}

const getIcon = (type: string) => {
    if (type === "Voluntariado") return <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />;
    if (type === "Compra/Venta") return <ShoppingBag className="w-5 h-5 text-purple-500" />;
    return <Briefcase className="w-5 h-5 text-indigo-500" />;
}

export default function ValidationRowLink({ itemId, item }: ValidationRowLinkProps) {
    const { text } = getOfferTypeDisplay(item.type);
    const detailUrl = `/admin/publications/validate/${itemId}`; 

    return (
        <Link 
            href={detailUrl} 
            className="group block w-full focus:outline-none"
        >
            <div 
                className={cn(
                    "relative flex items-center justify-between p-6 rounded-[2rem] transition-all duration-300",
                    "bg-white text-slate-800 shadow-xl", // Fondo blanco sólido
                    "hover:scale-[1.02] hover:shadow-2xl hover:bg-white", // Efecto hover
                    "border-4 border-transparent hover:border-pink-300" // Borde divertido al hover
                )}
            >
                <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-3 mb-2">
                        {/* Badge de Tipo de Oferta */}
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                            {getIcon(item.type)}
                            <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">
                                {text}
                            </span>
                        </div>
                    </div>
                    
                    {/* Título Grande y Bold */}
                    <h3 className="font-black text-2xl text-slate-900 truncate group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all">
                        {item.title}
                    </h3>
                </div>

                <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-purple-600 transition-colors duration-300">
                        <ArrowRight className="text-slate-400 w-6 h-6 group-hover:text-white transition-colors duration-300" />
                    </div>
                </div>
            </div>
        </Link>
    );
}