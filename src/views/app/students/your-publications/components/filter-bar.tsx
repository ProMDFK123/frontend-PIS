// src/views/app/students/your-publications/components/filter-bar.tsx

"use client";
import React from 'react';
import { Search, ListFilter, ArrowUpDown, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/Button'; // Asumiendo que se exporta con nombre
import { cn } from 'src/lib';

// --- Constantes de Filtro y Mapeo (Deben ser las mismas que en index.tsx) ---
const PUBLICATION_TYPES = [
    { value: 0, text: "Oferta de Trabajo", icon: Briefcase, iconClass: "text-indigo-500", bg: "bg-indigo-100", textCol: "text-indigo-800" },
    { value: 1, text: "Compra/Venta", icon: Briefcase, iconClass: "text-purple-500", bg: "bg-purple-100", textCol: "text-purple-800" },
    { value: 2, text: "Voluntariado", icon: Briefcase, iconClass: "text-pink-500", bg: "bg-pink-100", textCol: "text-pink-800" },
];

const PUBLICATION_STATUS = [
    { value: 0, text: "Activa" },
    { value: 1, text: "Pendiente" },
    { value: 2, text: "Rechazada" },
];

type SortType = "recientes" | "titulo";


interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filterStatus: number | 'all';
    setFilterStatus: (status: number | 'all') => void;
    filterType: number | 'all';
    setFilterType: (type: number | 'all') => void;
    sort: SortType;
    setSort: (sort: SortType) => void;
    clearFilters: () => void;
}

// --- FilterBar Estilo Admin (Copiada del Oferente) ---
const FilterBar: React.FC<FilterBarProps> = ({ 
    searchTerm, 
    setSearchTerm, 
    filterStatus, 
    setFilterStatus, 
    filterType, 
    setFilterType, 
    sort,
    setSort,
    clearFilters
}: FilterBarProps) => {
    // Clases adaptadas para el fondo fijo del diseño de Oferente
    const baseClass = "w-full bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 rounded-full px-5 py-3.5 text-sm font-bold focus:bg-white focus:text-purple-900 focus:placeholder:text-purple-300 focus:ring-4 focus:ring-white/20 transition-all outline-none shadow-lg hover:bg-white/20";
    const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none";

    return (
        <div className="p-6 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-xl mb-10 w-full">
            <div className="flex flex-col xl:flex-row gap-4 items-stretch">
                
                {/* Buscador de Título */}
                <div className="flex-1 relative group">
                    <Search className={`${iconClass} w-5 h-5 group-focus-within:text-purple-500`} />
                    <input
                        type="text"
                        placeholder="Buscar por título..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${baseClass} pl-12`} 
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full xl:w-auto">
                    
                    {/* Selector Estado */}
                    <div className="relative w-full group">
                        <ListFilter className={`${iconClass} w-4 h-4 group-focus-within:text-purple-500`} />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                            className={`${baseClass} pl-10 cursor-pointer appearance-none`}
                        >
                            <option value="all" className="text-slate-800">Todos los estados</option>
                            {PUBLICATION_STATUS.map(s => (
                                <option key={s.value} value={s.value} className="text-slate-800">{s.text}</option>
                            ))}
                        </select>
                    </div>

                    {/* Selector Tipo */}
                    <div className="relative w-full group">
                        <Briefcase className={`${iconClass} w-4 h-4 group-focus-within:text-purple-500`} />
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                            className={`${baseClass} pl-10 cursor-pointer appearance-none`}
                        >
                            <option value="all" className="text-slate-800">Todos los tipos</option>
                            {PUBLICATION_TYPES.map(t => (
                                <option key={t.value} value={t.value} className="text-slate-800">{t.text}</option>
                            ))}
                        </select>
                    </div>
                    
                    {/* Selector Orden */}
                    <div className="relative w-full group">
                        <ArrowUpDown className={`${iconClass} w-4 h-4 group-focus-within:text-purple-500`} />
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortType)}
                            className={`${baseClass} pl-10 cursor-pointer appearance-none`}
                        >
                            <option value="recientes" className="text-slate-800">Más recientes</option>
                            <option value="titulo" className="text-slate-800">A-Z</option>
                        </select>
                    </div>

                    {/* Botón Limpiar */}
                    <Button 
                        variant="outline"
                        onClick={clearFilters}
                        className="w-full h-[53px] bg-white/20 text-white hover:bg-white/30 border-white/50 text-sm font-black rounded-full"
                    >
                        Limpiar
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;