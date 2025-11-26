"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from 'src/services/Service';
import { ChevronLeft } from 'lucide-react'; 
import type { AdminDetail } from 'src2/types/admin-publications'; 
// Importamos mapBuySellDtoToDetail y mapOfferDtoToDetail para que no dé error TS
import { mapOfferDtoToDetail, mapBuySellDtoToDetail } from 'src/services/adapters/adapters';


// --- Funciones Auxiliares ---
function formatDate(dateString: string | undefined): string {
    if (!dateString) return "N/A";
    // Corrección para el desfase de zona horaria: se toma solo la fecha.
    const dateOnly = dateString.split('T')[0];
    try { 
        return new Date(dateOnly).toLocaleDateString('es-CL', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        }); 
    } catch { 
        return dateString; 
    }
}
function formatPrice(clp: number | undefined | null): string {
    if (clp === undefined || clp === null) return "No disponible";
    return clp.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}
// Función para traducir el estado (usada para el badge si es necesario)
function translateStatus(status: AdminDetail['statusValidation'] | string): string {
    const map: Record<string, string> = {
        Pending: 'Pendiente',
        Published: 'Publicado',
        Rejected: 'Rechazado',
        // Asumimos que el backend puede enviar "Closed" o "Inactive"
        Closed: 'Cerrada',
        Inactive: 'Inactiva',
    };
    return map[status] || status;
}
// ----------------------------------------


export default function AdminManageDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string; 
    
    const [detail, setDetail] = useState<AdminDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- LÓGICA DE CARGA DE DETALLES ---
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

            // 🚨 CORRECCIÓN 1: Ruta para publicaciones ACTIVAS (manage)
            const endpoint = `/publications/${typePath}/${entityId}/details`; 
            
            const response = await api.get<any>(endpoint); 
            
            const detailDto = response.data?.data ?? response.data; 
            
            if (!detailDto) {
                 throw new Error("Respuesta de API vacía o malformada.");
            }

            let mappedDetail: AdminDetail;
            // 🚨 CORRECCIÓN TS: Se asume que mapBuySellDtoToDetail está en adapters.ts
            if (isBuySell) {
                 mappedDetail = mapBuySellDtoToDetail(detailDto);
            } else {
                 mappedDetail = mapOfferDtoToDetail(detailDto);
            }
            
            setDetail({ ...mappedDetail, id: id }); 
            setError(null);

        } catch (err) {
            const status = (err as any).response?.status;
            
            if (status === 404) {
                 setError("Error 404: No se encontró la publicación activa (el recurso puede no existir).");
                 return;
            }

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


    // --- LÓGICA DE GESTIÓN (Cerrar/Eliminar) ---
    const handleAction = async (action: 'unpublish' | 'delete') => {
        if (!detail) return;
        
        if (action === 'delete') {
            const confirmation = window.prompt("Escribe 'ELIMINAR' para confirmar la eliminación de esta publicación:");
            if (confirmation !== 'ELIMINAR') {
                return;
            }
        }

        const isBuySell = detail.id.startsWith('bs-');
        const entityId = isBuySell ? detail.id.split('-')[1] : detail.id;
        const typePath = isBuySell ? "buysells" : "offers";
        
        let endpoint = `/api/publications/${typePath}/${entityId}`;

        if (action === 'unpublish') {
            if (!isBuySell) {
                 endpoint = `/publications/${typePath}/${entityId}/close`; // Cerrar (PATCH)
            } else {
                 endpoint = `/publications/${typePath}/${entityId}/unpublish`; // Despublicar (PATCH)
            }
        } else { // action === 'delete'
            endpoint = `/api/publications/${typePath}/${entityId}`; // Eliminar (DELETE)
        }

        try {
            if (action === 'delete') {
                await api.delete(endpoint);
            } else {
                await api.patch(endpoint);
            }
            
            const actionText = action === 'unpublish' ? 'CERRADA' : 'ELIMINADA';
            alert(`Publicación ${detail.title} (${detail.id}) ${actionText} con éxito.`);
            router.push('/admin/publications/manage'); 

        } catch (err) {
            const status = (err as any).response?.status;
            setError(`Fallo al ${action === 'unpublish' ? 'cerrar' : 'eliminar'} la oferta. Código: ${status}`);
            console.error("ACTION ERROR:", err);
        }
    };
    // --- FIN DE LÓGICA DE GESTIÓN ---


    if (loading) return <div className="text-center mt-12 text-[var(--muted-ink)]">Cargando detalles de la publicación...</div>;
    if (error) return <div className="text-center mt-12 text-red-600">Error: {error}</div>;
    if (!detail) return <div className="text-center mt-12 text-[var(--muted-ink)]">No se encontró la publicación.</div>;

    // --- RENDERIZADO PRINCIPAL ---
    return (
        <main className="max-w-6xl mx-auto px-4 py-10">
            {/* Botón Volver (superior) */}
            <button onClick={() => router.back()} className="mb-6 text-[var(--primary)] hover:underline flex items-center gap-1">
                <ChevronLeft size={20} /> Volver a la lista de gestión
            </button>

            <h1 className="text-4xl font-extrabold text-[var(--ink)] mb-1">{detail.title || "Sin Título"}</h1>
            <p className="text-lg text-[var(--muted-ink)] mb-6">
                Tipo: {detail.type === 'CompraVenta' ? 'Venta de Artículo' : 'Oferta de Trabajo'}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
                
                {/* COLUMNA 1: DETALLES DE LA PUBLICACIÓN */}
                <section className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-[var(--border)] space-y-6">
                    
                    {/* 🚨 Imagen por defecto si no hay images */}
                    <div className="mb-4 overflow-hidden rounded-md max-h-96">
                        <img 
                            src={(detail.images && detail.images.length > 0) ? detail.images[0] : '/generic.png'}
                            alt={detail.title} 
                            className="w-full object-cover h-64 md:h-96"
                        />
                    </div>
                    
                    {/* Tarjeta 1: Descripción */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Detalles de la Oferta</h2>
                        
                        <h3 className="text-xl font-bold mt-4">Descripción Completa</h3>
                        <p className="text-[var(--ink)] whitespace-pre-wrap leading-relaxed">
                            {detail.description || "No hay descripción detallada proporcionada."}
                        </p>
                    </div>

                    {/* Tarjeta 2: Datos Clave */}
                    <div className="pt-4 border-t border-[var(--border)]">
                        <h3 className="text-xl font-bold text-[var(--primary)] mb-3">Información Adicional</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-[var(--ink)]">
                            
                            {/* Fecha de Publicación */}
                            <div>
                                <strong>Fecha de Publicación:</strong>
                                <p className="font-semibold text-[var(--muted-ink)]">{formatDate(detail.publicationDate)}</p>
                            </div>
                            
                            {/* Estado Validación (lo mantenemos por consistencia) */}
                            <div>
                                <strong>Estado Validación:</strong>
                                <p className={`font-semibold ${
                                     detail.statusValidation === 'Published' ? 'text-green-600' : 
                                     detail.statusValidation === 'Rejected' ? 'text-red-600' : 'text-orange-600'
                                }`}>
                                    {translateStatus(detail.statusValidation)}
                                </p>
                            </div>
                            
                            {/* 🚨 Fechas de Inicio y Fin */}
                            {detail.type !== 'CompraVenta' && (
                                <div>
                                    <strong>Fecha de Inicio:</strong>
                                    <p className="font-semibold text-[var(--muted-ink)]">{formatDate(detail.deadlineDate)}</p>
                                </div>
                            )}
                            {detail.type !== 'CompraVenta' && (
                                <div>
                                    <strong>Fecha de Término:</strong>
                                    <p className="font-semibold text-[var(--muted-ink)]">{formatDate(detail.endDate)}</p>
                                </div>
                            )}
                            
                            {/* Remuneración */}
                            <div>
                                <strong>{detail.type === 'CompraVenta' ? 'Precio Solicitado' : 'Remuneración'}</strong>
                                <p className="font-semibold text-green-700">{formatPrice(detail.price || detail.remuneration)}</p> 
                            </div>
                            
                            {/* El ID de Recurso fue eliminado */}
                        </div>
                    </div>
                </section>

                {/* COLUMNA 2: PERFIL DEL PUBLICADOR Y BOTONES */}
                <section className="md:col-span-1 bg-white p-6 rounded-xl shadow-lg border border-[var(--border)] flex flex-col justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Perfil del Contacto</h2>
                        
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

                    {/* Botones de Gestión (Cerrar/Eliminar) */}
                    <div className="mt-8 pt-6 border-t border-[var(--border)] space-y-3">
                        <button 
                            onClick={() => handleAction('unpublish')} 
                            className="w-full flex items-center justify-center px-6 py-3 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700 transition"
                        >
                            Cerrar Publicacion
                        </button>
                        <button 
                            onClick={() => handleAction('delete')} 
                            className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
                        >
                            Eliminar Publicacion
                        </button>
                    </div>
                </section>
            </div>
            {/* 🚨 El botón de volver inferior se eliminó del JSX final */}
        </main>
    );
}