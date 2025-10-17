type Props = {
    text: string;
    setText: (v: string) => void;

    type: "Todos" | "Trabajo" | "CompraVenta";
    setType: (v: "Todos" | "Trabajo" | "CompraVenta") => void;

    sort: "recientes" | "fecha" | "monto";
    setSort: (v: "recientes" | "fecha" | "monto") => void;
};

export default function FilterBar({ text, setText, type, setType, sort, setSort }: Props) {
    return (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 md:p-5">
            <div className="grid gap-3 md:grid-cols-4">
                {/* Buscar */}
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Buscar por título..."
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ring)]"
                />

                {/* Tipo */}
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as Props["type"])}
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ring)]"
                >
                    <option>Todos</option>
                    <option>Trabajo</option>
                    <option>CompraVenta</option>
                </select>

                {/* Ordenar por */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as Props["sort"])}
                    className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ring)] md:col-span-2"
                >
                    <option value="recientes">Ordenar: más recientes</option>
                    <option value="fecha">Ordenar: fecha límite</option>
                    <option value="monto">Ordenar: precio/remuneración (menor primero)</option>
                </select>
            </div>
        </div>
    );
}