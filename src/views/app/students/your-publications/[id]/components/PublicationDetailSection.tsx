// src/views/app/students/your-publications/[id]/components/PublicationDetailSection.tsx

import React from 'react';
import { Mail, Phone, MapPin, Clock, DollarSign, Calendar, Target, Briefcase, ShoppingBag } from 'lucide-react';
import { cn, formatDate, thousandSeparatorPipe } from 'src/lib'; 
import type { OfferDetail, MyBuySell } from "src/models/responses";

// --- Helpers para renderizar secciones ---

interface DetailItemProps {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
    className?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value, className }) => (
    <div className={cn("flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-200", className)}>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-1">
            <Icon className="w-4 h-4" />
            {label}
        </div>
        <div className="text-slate-900 font-bold text-lg">
            {value}
        </div>
    </div>
);

// --- Componente Principal ---

interface PublicationDetailSectionProps {
    detail: OfferDetail | MyBuySell;
    typeInfo: { text: string; icon: React.ElementType; iconClass: string; };
    statusInfo: { text: string; classes: string; };
}

const PublicationDetailSection: React.FC<PublicationDetailSectionProps> = ({ detail, typeInfo, statusInfo }) => {
    
    // 1. Verificación de tipo y asignación de datos
    // Utilizamos la propiedad 'remuneration' (o 'companyName') que solo existe en OfferDetail
    const isJobOffer = 'remuneration' in detail || 'companyName' in detail; 
    
    const commonData = detail;

    // Asignar el nombre del dueño
    const ownerName = isJobOffer 
        ? (detail as OfferDetail).companyName || "N/A"
        : (detail as MyBuySell).userName || "N/A";
    
    // Asignar datos específicos para Oferta
    const offerData = isJobOffer ? detail as OfferDetail : null;
    
    // Asignar datos específicos para Compra/Venta
    const buySellData = !isJobOffer ? detail as MyBuySell : null;


    return (
        <section className="space-y-8">
            
            {/* 1. SECCIÓN DE ESTADO Y PUBLICACIÓN */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-slate-100">
                <div className="flex items-center gap-4">
                    {/* Badge de Estado */}
                    <div className={statusInfo.classes}>
                        {statusInfo.text}
                    </div>
                    {/* Fecha de Publicación */}
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                        <Clock className="w-4 h-4" />
                        Publicado: {commonData.publicationDate}
                    </div>
                </div>
            </div>

            {/* 2. DATOS CLAVE DEL DUEÑO/UBICACIÓN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Dueño/Empresa */}
                <DetailItem 
                    icon={isJobOffer ? Briefcase : ShoppingBag} 
                    label={isJobOffer ? "Dueño/Empresa" : "Vendedor/Usuario"} 
                    value={ownerName}
                />
                

                {/* Ubicación */}
                <DetailItem 
                    icon={MapPin} 
                    label="Ubicación" 
                    value={commonData.location || "Antofagasta, Chile"}
                />
            </div>
            
            {/* 3. DESCRIPCIÓN */}
            <div className="space-y-3">
                <h2 className="text-2xl font-bold text-slate-900 border-b pb-2">Descripción Detallada</h2>
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {commonData.description}
                </p>
            </div>

            {/* 4. DETALLES ESPECÍFICOS (Remuneración, Fechas, Precio) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Remuneración/Precio */}
                {isJobOffer && offerData ? (
                    <DetailItem 
                        icon={DollarSign} 
                        label="Remuneración Estimada" 
                        value={`CLP ${offerData.remuneration || 'A convenir'}`}
                    />
                ) : buySellData ? (
                    <DetailItem 
                        icon={DollarSign} 
                        label="Precio" 
                        value={`CLP ${thousandSeparatorPipe(buySellData.price) || 'N/A'}`}
                    />
                ) : null}
                
                {/* Fecha Límite de Postulación (Solo Ofertas/Voluntariado) */}
                {(offerData && offerData.endDate) ? (
                    <DetailItem 
                        icon={Calendar} 
                        label="Límite Postulación" 
                        value={formatDate(offerData.endDate)}
                    />
                ) : null}
                
                {/* Fecha Fin Estimada (Solo Ofertas/Voluntariado) */}
                {(offerData && offerData.endDate) ? (
                    <DetailItem 
                        icon={Calendar} 
                        label="Fecha Fin Estimada" 
                        value={formatDate(offerData.endDate)}
                    />
                ) : null}

                {/* Requisitos (Solo Ofertas/Voluntariado) */}
                {(offerData && offerData.aboutMe) ? (
                    <DetailItem
                        icon={Target}
                        label="Requisitos"
                        value={offerData.aboutMe}
                        className="col-span-1 sm:col-span-2 md:col-span-4"
                    />
                ) : null}
                
                {/* Categoría (Solo Compra/Venta) */}
                {(buySellData && buySellData.category) ? (
                    <DetailItem
                        icon={ShoppingBag}
                        label="Categoría"
                        value={buySellData.category}
                    />
                ) : null}

            </div>
        </section>
    );
}

export default PublicationDetailSection;