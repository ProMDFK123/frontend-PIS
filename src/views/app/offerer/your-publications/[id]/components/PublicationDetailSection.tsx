import React from 'react';
import type { OfferDetail, MyBuySell } from "src/models/responses";

interface Props {
  detail: OfferDetail | MyBuySell;
}

const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-base text-gray-900">{value || "No especificado"}</dd>
  </div>
);

export function PublicationDetailSection({ detail }: Props) {
  
  // --- 1. LÓGICA DE NORMALIZACIÓN (TYPE GUARDS) ---
  
  // A. Detectar si es Trabajo o Venta
  // Verificamos si existe la propiedad 'price' (típica de ventas) o 'remuneration' (trabajo)
  const isSale = 'price' in detail; 
  const isJobOffer = !isSale; // O checkear 'remuneration' in detail

  // B. Fecha: Normalizamos postDate vs publicationDate
  const rawDate = 'postDate' in detail && detail.postDate 
    ? detail.postDate 
    : detail.publicationDate;

  // C. Publicador: companyName vs userName
  const displayPublisher = 'companyName' in detail && detail.companyName
    ? detail.companyName 
    : detail.userName; // Fallback al nombre de usuario si no hay empresa

  // D. Dinero: Remuneración vs Precio
  // Usamos 'any' temporalmente si TS se pone muy estricto con la unión de tipos disjuntos,
  // pero con las interfaces corregidas arriba, esto debería funcionar directo.
  const moneyValue = isJobOffer 
    ? (detail as OfferDetail).remuneration 
    : (detail as MyBuySell).price;

  const moneyLabel = isJobOffer ? "Remuneración" : "Precio";

  // E. Fecha Término (Solo suele existir en ofertas, en ventas es indefinido)
  const endDateRaw = 'endDate' in detail ? detail.endDate : null;


  // --- 2. FORMATEO DE DATOS ---
  
  const formattedDate = rawDate 
    ? new Date(rawDate).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric'}) 
    : "Fecha desconocida";

  const formattedEndDate = endDateRaw 
    ? new Date(endDateRaw).toLocaleDateString('es-CL') 
    : "Indefinido";

  const formattedMoney = moneyValue 
    ? `$${moneyValue.toLocaleString("es-CL")}` 
    : "A convenir";


  return (
    <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-6">
      
      {/* Imagen */}
      <div className="mb-4 overflow-hidden rounded-md max-h-96">
        <img
          src={"/generic.png"} 
          alt={detail.title}
          className="w-full object-cover h-64 md:h-96"
        />
      </div>

      {/* Título y Descripción */}
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-4">
            <h2 className="text-2xl font-bold text-indigo-600">
              {detail.title}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                isJobOffer ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
            }`}>
                {isJobOffer ? 'Oferta Laboral' : 'Compra-Venta'}
            </span>
        </div>
        
        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {detail.description}
        </p>
      </div>

      {/* Grid de Detalles */}
      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-xl font-bold text-indigo-600 mb-3">
          Información Adicional
        </h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          
          <DetailItem label={moneyLabel} value={formattedMoney} />
          
          <DetailItem label="Ubicación" value={detail.location} />
          
          <DetailItem label="Publicador" value={displayPublisher} />
          
          {/* Solo mostramos fecha término si existe o es trabajo */}
          {isJobOffer && (
             <DetailItem label="Fecha de Término" value={formattedEndDate} />
          )}
          
          <DetailItem label="Fecha de publicación" value={formattedDate} />
          
          {/* Si es venta, mostramos la categoría */}
          {!isJobOffer && 'category' in detail && (
             <DetailItem label="Categoría" value={detail.category} />
          )}

        </dl>
      </div>

      {/* Footer Condicional */}
      {isJobOffer && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-gray-500 text-xs italic">
             * Esta oferta laboral es gestionada externamente.
          </p>
        </div>
      )}
    </section>
  );
}