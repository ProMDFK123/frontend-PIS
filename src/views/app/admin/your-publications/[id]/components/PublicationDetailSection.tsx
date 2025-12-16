// src/views/app/offerer/your-publications/[id]/components/PublicationDetailSection.tsx
"use client";
import React from 'react';
import { Info, FileText, MapPin, DollarSign, Calendar, ClockIcon } from 'lucide-react';
import type { OfferDetail, MyBuySell } from "src/models/responses"; 
import { cn, thousandSeparatorPipe, formatDate } from 'src/lib'; 

interface PublicationDetailSectionProps {
    detail: OfferDetail | MyBuySell;
    typeInfo: { text: string; icon: React.ElementType; iconClass: string; };
    statusInfo: { text: string; classes: string; };
}

function formatMoney(n: number | undefined | null): string {
    if (typeof n !== 'number' || isNaN(n) || n === 0) {
        return "A convenir / $0 CLP";
    }
    return `$${thousandSeparatorPipe(n)} CLP`;
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <dt className="text-sm font-semibold text-gray-500">{label}</dt>
    <dd className="mt-1 text-base text-gray-900">{value || "No especificado"}</dd>
  </div>
);


const PublicationDetailSection: React.FC<PublicationDetailSectionProps> = ({ detail, typeInfo, statusInfo }) => {
    
    const isJobOffer = 'remuneration' in detail || 'companyName' in detail;
    const rawDate = ('postDate' in detail && detail.postDate) 
        ? detail.postDate 
        : detail.publicationDate;
    
    const moneyValue = isJobOffer 
        ? (detail as OfferDetail).remuneration 
        : (detail as MyBuySell).price;

    const moneyLabel = isJobOffer ? "Remuneración" : "Precio Solicitado";
    const rawEndDate = 'endDate' in detail ? detail.endDate : undefined;
    const rawDeadlineDate = 'deadlineDate' in detail ? detail.deadlineDate : undefined;
    
    const formattedPubDate = rawDate ? formatDate(rawDate) : "N/A";
    const formattedEndDate = rawEndDate ? formatDate(rawEndDate) : "Indefinido";
    const formattedMoney = formatMoney(moneyValue);
    
    // Se utiliza 'aboutMe' como requisitos para simplificar, si está presente.
    const requirements = (detail as OfferDetail).aboutMe || undefined; 
    
    return (
        <section className="w-full bg-white p-6 rounded-xl shadow-lg border border-[var(--border)] space-y-6">
            
            {/* Imagen (Manteniendo el diseño simple del administrador) */}
            <div className="mb-4 overflow-hidden rounded-xl max-h-96 border border-gray-200">
                <img
                    src={"/logo_feucn_extendido.png"} 
                    alt={detail.title}
                    className="w-full object-cover h-60 md:h-96"
                />
            </div>

            {/* Detalles de la Publicación (Título en el componente padre) */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                    <FileText className="w-5 h-5 text-indigo-600" />
                    Descripción
                </h2>
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {detail.description || "No hay descripción detallada proporcionada."}
                </p>
            </div>
            
            {/* Requisitos (Solo para Ofertas/Voluntariados) */}
            {isJobOffer && requirements && (
                <div className="pt-4 border-t border-gray-200 space-y-4">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b pb-2">
                        <Info className="w-5 h-5 text-red-600" />
                        Requisitos
                    </h2>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {requirements}
                    </p>
                </div>
            )}


            {/* Grid de Información General */}
            <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2 border-b pb-2">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Información General
                </h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    
                    <DetailItem label={moneyLabel} value={formattedMoney} />
                    
                    <DetailItem label="Ubicación" value={detail.location} />
                    
                    
                    {/* Fecha de Término solo si es oferta de trabajo */}
                    {isJobOffer && (
                        <DetailItem label="Fecha de Término" value={formattedEndDate} />
                    )}
                    
                    <DetailItem label="Fecha de Publicación" value={formattedPubDate} />
                    
                    {/* Categoría solo si es Compra/Venta */}
                    {!isJobOffer && 'category' in detail && (
                        <DetailItem label="Categoría" value={(detail as MyBuySell).category} />
                    )}

                    {/* Estado de Validación (Estilo Admin) */}
                    <div>
                        <dt className="text-sm font-semibold text-gray-500">Estado Validación:</dt>
                        <dd className="mt-1">
                            <span className={statusInfo.classes}>
                                {statusInfo.text}
                            </span>
                        </dd>
                    </div>

                </dl>
            </div>
        </section>
    );
}

export default PublicationDetailSection;