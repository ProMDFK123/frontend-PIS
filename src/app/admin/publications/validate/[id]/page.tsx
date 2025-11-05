"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/Service';
import { ChevronLeft } from 'lucide-react'; // Icono para volver
// Asumimos que AdminDetail y los adaptadores están importados/definidos correctamente
import type { AdminDetail } from '@/types/admin-publications'; 
import { mapOfferDtoToDetail } from '@/services/adapters/adapters';


// --- Funciones Auxiliares (Definidas o importadas) ---
function formatDate(dateString: string | undefined): string {
    if (!dateString) return "N/A";
    try { return new Date(dateString).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return dateString; }
}
function formatPrice(clp: number | undefined | null): string {
    // Aceptamos 0 (cero) como un valor formateable.
    if (clp === undefined || clp === null) return "No disponible";
    return clp.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}
// ----------------------------------------


export default function AdminDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string; 
    
    const [detail, setDetail] = useState<AdminDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- LÓGICA DE CARGA DE DETALLES (Endpoint GET) ---
    const fetchDetails = async () => {
        if (!id || id === 'undefined') {
            setLoading(false);
            setError("ID de publicación no válido en la URL.");
            return;
        }

        setLoading(true);
        try {
            const isBuySell = id.startsWith('bs-');
            const entityId = isBuySell ? id.split('-')[1] : id;
            const typePath = isBuySell ? "buysells" : "offers";

            // Endpoint GET: /publications/{offers/buysells}/{id}/validation
            const endpoint = `/publications/${typePath}/${entityId}/validation`; 
            
            const response = await api.get<any>(endpoint); 
            
            // 🚨 CORRECCIÓN 1 (FLUIDEZ DE DATOS): Desempaquetar el DTO de la propiedad 'data'.
            // Esto transforma { message, data: DTO } en solo DTO.
            const detailDto = response.data?.data ?? response.data; 
            
            if (!detailDto) {
                 throw new Error("Respuesta de API vacía o malformada.");
            }

            let mappedDetail: AdminDetail;
            if (isBuySell) {
                //mappedDetail = mapBuySellDtoToDetail(detailDto);
            } else {
                // Ahora mapOfferDtoToDetail recibe el objeto de datos correcto.
                mappedDetail = mapOfferDtoToDetail(detailDto);
            }
            
            //setDetail({ ...mappedDetail, id: id }); 
            setError(null);

        } catch (err) {
            const status = (err as any).response?.status;
            const errorMessage = (err as any).response?.data?.message || `Error ${status || 'desconocido'}: Fallo al cargar el detalle de la publicación.`;
            setError(errorMessage);
            console.error("GET DETAIL ERROR:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchDetails();
        }
    }, [id]);


    // --- LÓGICA DE VALIDACIÓN (Endpoints PATCH) ---
    const handleAction = async (action: 'publish' | 'reject') => {
        if (!detail) return;

        const isBuySell = detail.id.startsWith('bs-');
        const entityId = isBuySell ? detail.id.split('-')[1] : detail.id;
        const typePath = isBuySell ? "buysells" : "offers";
        
        // Endpoint PATCH: /api/offers/{id}/publish o /api/offers/{id}/reject
        const endpoint = `/api/${typePath}/${entityId}/${action}`; 

        try {
            await api.patch(endpoint);
            alert(`Publicación ${detail.title} (${detail.id}) ${action === 'publish' ? 'APROBADA' : 'RECHAZADA'} con éxito.`);
            router.push('/admin/publications/validate'); // Volver a la lista

        } catch (err) {
            const status = (err as any).response?.status;
            setError(`Fallo al ${action === 'publish' ? 'publicar' : 'rechazar'} la oferta. Código: ${status}`);
            console.error("PATCH ERROR:", err);
        }
    };


    if (loading) return <div className="text-center mt-12 text-[var(--muted-ink)]">Cargando detalles de la publicación...</div>;
    if (error) return <div className="text-center mt-12 text-red-600">Error: {error}</div>;
    if (!detail) return <div className="text-center mt-12 text-[var(--muted-ink)]">No se encontró la publicación pendiente.</div>;

    // --- RENDERIZADO PRINCIPAL (Diseño de Dos Columnas) ---
    return (
        <main className="max-w-6xl mx-auto px-4 py-10">
            <button onClick={() => router.back()} className="mb-6 text-[var(--primary)] hover:underline flex items-center gap-1">
                <ChevronLeft size={20} /> Volver a la lista de pendientes
            </button>

            {/* TÍTULO PRINCIPAL Y TIPO (Arriba del diseño de dos tarjetas) */}
            <h1 className="text-4xl font-extrabold text-[var(--ink)] mb-1">{detail.title || "Sin Título"}</h1>
            <p className="text-lg text-[var(--muted-ink)] mb-6">
                Tipo: {detail.type === 'CompraVenta' ? 'Venta de Artículo' : detail.type === 'Trabajo' ? 'Oferta Laboral' : 'Voluntariado'}
            </p>

            {/* --- GRID PRINCIPAL (DOS COLUMNAS) --- */}
            <div className="grid md:grid-cols-3 gap-6">
                
                {/* COLUMNA 1: DETALLES DE LA PUBLICACIÓN Y ACCIONES (2/3 ancho) */}
                <section className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-[var(--border)] space-y-6">
                    
                    {/* Tarjeta 1: Imagen y Descripción */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Detalles de la Oferta</h2>
                        
                        {/* Imagen (si existe, similar al mockup de voluntariado) */}
                        {detail.images && detail.images.length > 0 && (
                            <div className="mb-4 overflow-hidden rounded-md max-h-96">
                                {/* Placeholder simple de imagen */}
                                <img src={detail.images[0] || "https://placehold.co/800x400/9C27B0/FFFFFF?text=Imagen+de+Publicaci%C3%B3n"} alt={detail.title} className="w-full object-cover" />
                            </div>
                        )}

                        <h3 className="text-xl font-bold mt-4">Descripción Completa</h3>
                        <p className="text-[var(--ink)] whitespace-pre-wrap leading-relaxed">
                            {detail.description || "No hay descripción detallada proporcionada."}
                        </p>
                    </div>

                    {/* Tarjeta 2: Datos Clave */}
                    <div className="pt-4 border-t border-[var(--border)]">
                        <h3 className="text-xl font-bold text-[var(--primary)] mb-3">Información Adicional</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-[var(--ink)]">
                            <div>
                                <strong>Fecha de Publicación:</strong>
                                <p className="font-semibold text-[var(--muted-ink)]">{formatDate(detail.publicationDate)}</p>
                            </div>
                            <div>
                                <strong>Estado Validación:</strong>
                                <p className="font-semibold text-orange-600">{detail.statusValidation}</p>
                            </div>
                            <div>
                                <strong>{detail.type === 'CompraVenta' ? 'Precio Solicitado' : 'Remuneración'}</strong>
                                <p className="font-semibold text-green-700">{formatPrice(detail.price || detail.remuneration)}</p> 
                            </div>
                            <div>
                                <strong>ID de Recurso:</strong>
                                <p className="font-semibold text-[var(--muted-ink)]">{detail.id} (Uso interno)</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* COLUMNA 2: PERFIL DEL PUBLICADOR Y BOTONES (1/3 ancho) */}
                <section className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-[var(--border)] flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Perfil del Contacto</h2>
                        
                        {/* Información del Contacto (Similar al mockup de Pedro Manrique) */}
                        <div className="flex flex-col items-center text-center space-y-3 pt-2">
                            <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold">
                                {detail.companyName ? detail.companyName[0] : 'U'}
                            </div>
                            <p className="font-bold text-xl text-[var(--ink)]">{detail.companyName || "Usuario UCN"}</p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-[var(--border)] text-sm text-[var(--ink)] space-y-3">
                            <p>Docente de la Universidad Católica del Norte y ha participado activamente en iniciativas...</p>
                            <p><strong>Correo electrónico:</strong> usuario@ucn.cl</p>
                            <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
                        </div>
                    </div>

                    {/* Botones de Acción (Aceptar/Rechazar) */}
                    <div className="mt-8 pt-6 border-t border-[var(--border)] space-y-3">
                        <button 
                            onClick={() => handleAction('publish')} 
                            className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                        >
                            ✅ Aceptar y Publicar
                        </button>
                        <button 
                            onClick={() => handleAction('reject')} 
                            className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
                        >
                            ❌ Rechazar
                        </button>
                    </div>
                </section>
            </div>
            {/* FIN DEL GRID */}

            <button onClick={() => router.push('/admin/publications/validate')} className="mt-6 text-[var(--primary)] hover:underline flex items-center gap-1">
                <ChevronLeft size={20} /> Volver a la lista de pendientes
            </button>
        </main>
    );
}