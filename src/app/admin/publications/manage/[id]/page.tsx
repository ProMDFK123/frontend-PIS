// src/app/admin/publications/manage/[id]/page.tsx

"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/Service';
import { ChevronLeft } from 'lucide-react'; 
import type { AdminDetail } from '@/types/admin-publications'; 
import { mapOfferDtoToDetail } from '@/services/adapters/adapters';


// --- Funciones Auxiliares (sin cambios) ---
function formatDate(dateString: string | undefined): string {
    if (!dateString) return "N/A";
    try { return new Date(dateString).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return dateString; }
}
function formatPrice(clp: number | undefined | null): string {
    if (clp === undefined || clp === null) return "No disponible";
    return clp.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}
// ----------------------------------------


export default function AdminManageDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string; 
    
    const [detail, setDetail] = useState<AdminDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // --- Lógica de Carga CORREGIDA (Ruta /api y error TS(2454)) ---
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

            // 🚨 CORRECCIÓN 1: Ruta /api (basado en PublicationController.cs)
            const endpoint = `/api/publications/${typePath}/${entityId}/validation`; 
            
            const response = await api.get<any>(endpoint); 
            const detailDto = response.data?.data ?? response.data; 
            
            if (!detailDto) {
                 throw new Error("Respuesta de API vacía o malformada.");
            }

            // ----------------------------------------------------
            // 🚨 CORRECCIÓN 2: Lógica para evitar el error TS(2454)
            // ----------------------------------------------------
            let mappedDetail: AdminDetail;
            
            if (isBuySell) {
                // Como mapBuySellDtoToDetail está comentado,
                // usamos temporalmente mapOfferDtoToDetail para que TypeScript no falle.
                // TODO: Reemplazar esto cuando 'mapBuySellDtoToDetail' esté implementado.
                mappedDetail = mapOfferDtoToDetail(detailDto); 
            } else {
                // Esta parte ya estaba bien
                mappedDetail = mapOfferDtoToDetail(detailDto);
            }
            // ----------------------------------------------------
            // 🚨 FIN DE LA CORRECCIÓN
            // ----------------------------------------------------
            
            setDetail({ ...mappedDetail, id: id }); 
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


    // --- LÓGICA DE GESTIÓN MODIFICADA ---
    const handleAction = async (action: 'unpublish' | 'delete') => {
        if (!detail) return;

        if (action === 'delete') {
            if (!confirm("¿Estás seguro de que quieres ELIMINAR esta publicación? Esta acción no se puede deshacer.")) {
                return;
            }
        }

        const isBuySell = detail.id.startsWith('bs-');
        const entityId = isBuySell ? detail.id.split('-')[1] : id;
        const typePath = isBuySell ? "buysells" : "offers";
        
        let endpoint = `/api/publications/${typePath}/${entityId}`;

        // 🚨 CAMBIO DE LÓGICA:
        if (action === 'unpublish') {
             // Si es oferta (Trabajo/Voluntariado), usamos el endpoint 'close'
             if (!isBuySell) {
                endpoint = `/api/publications/${typePath}/${entityId}/close`; // Llama a CloseOfferForAdmin
             } else {
                 // Si es compra/venta, mantenemos el endpoint 'unpublish' genérico
                 endpoint = `/api/publications/${typePath}/${entityId}/unpublish`;
             }
        } else { // action === 'delete'
             endpoint = `/api/publications/${typePath}/${entityId}/delete`; 
        }

        try {
            if (action === 'delete') {
                await api.delete(endpoint);
            } else {
                // 'unpublish' (que ahora es 'close' para offers) usa PATCH
                await api.patch(endpoint);
            }
            
            const actionText = action === 'unpublish' ? 'DESPUBLICADA/CERRADA' : 'ELIMINADA';
            alert(`Publicación ${detail.title} (${detail.id}) ${actionText} con éxito.`);
            router.push('/admin/publications/manage'); 

        } catch (err) {
            const status = (err as any).response?.status;
            setError(`Fallo al ${action === 'unpublish' ? 'despublicar/cerrar' : 'eliminar'} la oferta. Código: ${status}`);
            console.error("ACTION ERROR:", err);
        }
    };
    // --- FIN DE LÓGICA DE GESTIÓN MODIFICADA ---


    // --- RENDERIZADO (sin cambios) ---
    if (loading) return <div className="text-center mt-12 text-[var(--muted-ink)]">Cargando detalles de la publicación...</div>;
    if (error) return <div className="text-center mt-12 text-red-600">Error: {error}</div>;
    if (!detail) return <div className="text-center mt-12 text-[var(--muted-ink)]">No se encontró la publicación.</div>;

    return (
        <main className="max-w-6xl mx-auto px-4 py-10">
            <button onClick={() => router.back()} className="mb-6 text-[var(--primary)] hover:underline flex items-center gap-1">
                <ChevronLeft size={20} /> Volver a la lista de gestión
            </button>

            <h1 className="text-4xl font-extrabold text-[var(--ink)] mb-1">{detail.title || "Sin Título"}</h1>
            <p className="text-lg text-[var(--muted-ink)] mb-6">
                Tipo: {detail.type === 'CompraVenta' ? 'Venta de Artículo' : detail.type === 'Trabajo' ? 'Oferta Laboral' : 'Voluntariado'}
            </p>

            <div className="grid md:grid-cols-3 gap-6">
                
                <section className="md:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-[var(--border)] space-y-6">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">Detalles de la Oferta</h2>
                        {detail.images && detail.images.length > 0 && (
                            <div className="mb-4 overflow-hidden rounded-md max-h-96">
                                <img src={detail.images[0] || "https://placehold.co/800x400"} alt={detail.title} className="w-full object-cover" />
                            </div>
                        )}
                        <h3 className="text-xl font-bold mt-4">Descripción Completa</h3>
                        <p className="text-[var(--ink)] whitespace-pre-wrap leading-relaxed">
                            {detail.description || "No hay descripción detallada proporcionada."}
                        </p>
                    </div>
                    <div className="pt-4 border-t border-[var(--border)]">
                        <h3 className="text-xl font-bold text-[var(--primary)] mb-3">Información Adicional</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm text-[var(--ink)]">
                            <div>
                                G<strong>Fecha de Publicación:</strong>
                                <p className="font-semibold text-[var(--muted-ink)]">{formatDate(detail.publicationDate)}</p>
                            </div>
                            <div>
                                <strong>Estado Validación:</strong>
                                <p className={`font-semibold ${
                                    detail.statusValidation === 'Published' ? 'text-green-600' : 
                                    detail.statusValidation === 'Rejected' ? 'text-red-600' : 'text-orange-600'
                                }`}>
                                    {detail.statusValidation}
                                </p>
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

                    <div className="mt-8 pt-6 border-t border-[var(--border)] space-y-3">
                        <button 
                            onClick={() => handleAction('unpublish')} 
                            className="w-full flex items-center justify-center px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600 transition"
                        >
                            ⚠️ Despublicar (Ocultar)
                        </button>
                        <button 
                            onClick={() => handleAction('delete')} 
                            className="w-full flex items-center justify-center px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition"
                        >
                            ❌ Eliminar Permanentemente
                        </button>
                    </div>
                </section>
            </div>

            <button onClick={() => router.push('/admin/publications/manage')} className="mt-6 text-[var(--primary)] hover:underline flex items-center gap-1">
                <ChevronLeft size={20} /> Volver a la lista de gestión
            </button>
        </main>
    );
}