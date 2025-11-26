"use client";

import React from 'react';

type ValidationType = "Todos" | "Ofertas" | "CompraVenta";
type SortType = "recientes" | "titulo";

interface FilterBarProps {
    text: string;
    setText: (text: string) => void;
    type: ValidationType;
    setType: (type: ValidationType) => void;
    sort: SortType;
    setSort: (sort: SortType) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
    text,
    setText,
    type,
    setType,
    sort,
    setSort,
}) => {
    // Usamos elementos HTML estándar <input> y <select> para evitar errores de componentes faltantes.
    return (
        <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-border bg-card shadow-sm">
            
            {/* 1. Campo de Búsqueda por Título (Input HTML) */}
            <input
                type="text"
                placeholder="Buscar por título..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                // Clases Tailwind para estilos básicos consistentes
                className="flex-1 p-2 border border-input bg-background rounded-md text-sm shadow-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition-colors" 
            />

            {/* 2. Selector de Tipo (Select HTML) */}
            <select
                value={type}
                onChange={(e) => setType(e.target.value as ValidationType)}
                className="md:w-1/4 p-2 border border-input bg-background rounded-md text-sm shadow-sm cursor-pointer"
            >
                <option value="Todos">Todos los tipos</option>
                <option value="Ofertas">Ofertas de trabajo</option>
                <option value="CompraVenta">Compra y venta</option>
            </select>
            
            {/* 3. Selector de Orden (Select HTML) */}
            <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortType)}
                className="md:w-1/4 p-2 border border-input bg-background rounded-md text-sm shadow-sm cursor-pointer"
            >
                <option value="recientes">Más recientes</option>
                <option value="titulo">Título (A-Z)</option>
            </select>

        </div>
    );
};

export default FilterBar;