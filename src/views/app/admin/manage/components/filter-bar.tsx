"use client";

import React from 'react';
import { Search, ListFilter, ArrowUpDown } from 'lucide-react';

type ManageType = "Todos" | "Oferta de Trabajo" | "Voluntariado" | "Compra/Venta";
type SortType = "recientes" | "titulo";

interface FilterBarProps {
    text: string;
    setText: (text: string) => void;
    type: ManageType;
    setType: (type: ManageType) => void;
    sort: SortType;
    setSort: (sort: SortType) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
    text, setText, type, setType, sort, setSort,
}) => {
    // Estilo "Píldora Translúcida"
    const inputBaseClass = "w-full bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 rounded-full px-5 py-3.5 text-sm font-bold focus:bg-white focus:text-purple-900 focus:placeholder:text-purple-300 focus:ring-4 focus:ring-white/20 transition-all outline-none shadow-lg hover:bg-white/20 appearance-none";
    const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none";

    return (
        <div className="flex flex-col md:flex-row gap-4">
            
            {/* Buscador */}
            <div className="flex-1 relative group">
                <Search className={`${iconClass} w-5 h-5 group-focus-within:text-purple-500 transition-colors`} />
                <input
                    type="text"
                    placeholder="Buscar por título..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`${inputBaseClass} pl-12`} 
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 md:w-auto w-full">
                {/* Selector Tipo */}
                <div className="relative w-full md:w-48 group">
                    <ListFilter className={`${iconClass} w-4 h-4 group-focus-within:text-purple-500 transition-colors`} />
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as ManageType)}
                        className={`${inputBaseClass} pl-10 cursor-pointer`}
                    >
                        <option value="Todos" className="text-slate-800">Todos</option>
                        <option value="Oferta de Trabajo" className="text-slate-800">Trabajo</option>
                        <option value="Voluntariado" className="text-slate-800">Voluntariado</option>
                        <option value="Compra/Venta" className="text-slate-800">Compra/Venta</option>
                    </select>
                </div>
                
                {/* Selector Orden */}
                <div className="relative w-full md:w-48 group">
                    <ArrowUpDown className={`${iconClass} w-4 h-4 group-focus-within:text-purple-500 transition-colors`} />
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortType)}
                        className={`${inputBaseClass} pl-10 cursor-pointer`}
                    >
                        <option value="recientes" className="text-slate-800">Más recientes</option>
                        <option value="titulo" className="text-slate-800">A-Z</option>
                    </select>
                </div>
            </div>

        </div>
    );
};

export default FilterBar;