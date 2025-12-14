"use client";

import React from 'react';
import { Search, ListFilter, ArrowUpDown, Users, ArrowUp, ArrowDown } from 'lucide-react';

type UserType = "Todos" | "Estudiante" | "Empresa" | "Particular" | "Administrador";
type BlockedStatus = "Todos" | "Blocked" | "Unblocked";
type SortBy = "UserName" | "Email" | "Rating";
type SortOrder = "asc" | "desc";

interface FilterBarProps {
    searchTerm: string;
    setSearchTerm: (text: string) => void;
    userType: UserType;
    setUserType: (type: UserType) => void;
    blockedStatus: BlockedStatus;
    setBlockedStatus: (status: BlockedStatus) => void;
    sortBy: SortBy;
    setSortBy: (sort: SortBy) => void;
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
    searchTerm, setSearchTerm, userType, setUserType, 
    blockedStatus, setBlockedStatus, sortBy, setSortBy,
    sortOrder, setSortOrder
}) => {
    const inputBaseClass = "w-full bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 rounded-full px-5 py-3.5 text-sm font-bold focus:bg-white focus:text-purple-900 focus:placeholder:text-purple-300 focus:ring-4 focus:ring-white/20 transition-all outline-none shadow-lg hover:bg-white/20 appearance-none";
    const iconClass = "absolute left-4 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none";

    const toggleSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    };

    return (
        <div className="space-y-4">
            {/* Filters Section */}
            <div>
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3 px-1">
                    Filtros
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Buscador */}
                    <div className="flex-1 relative group">
                        <Search className={`${iconClass} w-5 h-5 group-focus-within:text-purple-500 transition-colors`} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email o RUT..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${inputBaseClass} pl-12`} 
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 md:w-auto w-full">
                        {/* Selector Tipo de Usuario */}
                        <div className="relative w-full md:w-48 group">
                            <Users className={`${iconClass} w-4 h-4 group-focus-within:text-purple-500 transition-colors`} />
                            <select
                                value={userType}
                                onChange={(e) => setUserType(e.target.value as UserType)}
                                className={`${inputBaseClass} pl-10 cursor-pointer`}
                            >
                                <option value="Todos" className="text-slate-800">Todos los tipos</option>
                                <option value="Estudiante" className="text-slate-800">Estudiante</option>
                                <option value="Empresa" className="text-slate-800">Empresa</option>
                                <option value="Particular" className="text-slate-800">Particular</option>
                                <option value="Administrador" className="text-slate-800">Administrador</option>
                            </select>
                        </div>

                        {/* Selector Estado de Bloqueo */}
                        <div className="relative w-full md:w-48 group">
                            <ListFilter className={`${iconClass} w-4 h-4 group-focus-within:text-purple-500 transition-colors`} />
                            <select
                                value={blockedStatus}
                                onChange={(e) => setBlockedStatus(e.target.value as BlockedStatus)}
                                className={`${inputBaseClass} pl-10 cursor-pointer`}
                            >
                                <option value="Todos" className="text-slate-800">Todos los estados</option>
                                <option value="Unblocked" className="text-slate-800">Activos</option>
                                <option value="Blocked" className="text-slate-800">Bloqueados</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sort Section */}
            <div>
                <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-3 px-1">
                    Ordenamiento
                </h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Selector Ordenar por */}
                    <div className="relative flex-1 group">
                        <ArrowUpDown className={`${iconClass} w-4 h-4 group-focus-within:text-purple-500 transition-colors`} />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortBy)}
                            className={`${inputBaseClass} pl-10 cursor-pointer`}
                        >
                            <option value="UserName" className="text-slate-800">Nombre</option>
                            <option value="Email" className="text-slate-800">Email</option>
                            <option value="Rating" className="text-slate-800">Calificación</option>
                            <option value="UserType" className="text-slate-800">Tipo</option>
                        </select>
                    </div>

                    {/* Sort Order Toggle Button */}
                    <button
                        onClick={toggleSortOrder}
                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-sm hover:bg-white hover:text-purple-900 transition-all shadow-lg group w-full sm:w-auto"
                    >
                        {sortOrder === "asc" ? (
                            <>
                                <ArrowUp className="w-4 h-4" />
                                <span>Ascendente</span>
                            </>
                        ) : (
                            <>
                                <ArrowDown className="w-4 h-4" />
                                <span>Descendente</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;