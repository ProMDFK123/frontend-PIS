import React from 'react';
import { ChevronRight, Star } from 'lucide-react'; // 1. Importamos Star
import { ViewAppplicantsForAdmin } from "@/models/responses";

interface ApplicantCardProps {
  // Asegúrate de que tu interfaz ViewAppplicantsForAdmin tenga la propiedad 'rating'
  // si no la tiene, puedes extenderla aquí: applicant: ViewAppplicantsForAdmin & { rating: number };
  applicant: ViewAppplicantsForAdmin;
  onViewDetail: (id: number) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Aceptada':
      return { text: 'Aceptada', color: 'bg-green-500 text-white' };
    case 'Rechazada':
      return { text: 'Rechazada', color: 'bg-red-500 text-white' };
    case 'Pendiente':
    default:
      return { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' };
  }
};

export default function ApplicantCard({ applicant, onViewDetail }: ApplicantCardProps) {
  // 2. Extraemos 'rating' (le pongo un default de 0 por si viene null)
  // Nota: Si TS se queja, asegura que 'rating' exista en tu modelo ViewAppplicantsForAdmin
  const { id, applicant: applicantName, status, rating } = applicant as any;
  console.log("Applicant Rating:", rating); // Debugging line
  
  const statusInfo = getStatusBadge(status);
  const initial = applicantName ? applicantName[0].toUpperCase() : 'U';

  return (
    <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm w-full">
      <div className="flex items-center gap-4 flex-grow">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-semibold">
          {initial}
        </div>

        {/* 3. Cambiamos esto a flex-col para poner las estrellas debajo del nombre */}
        <div className="flex flex-col flex-grow">
            <span className="text-lg font-semibold text-[var(--ink)] truncate leading-tight">
            {applicantName}
            </span>
            
            {/* Lógica de las Estrellas */}
            <div className="flex items-center gap-0.5 mt-1">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <Star
                        key={index}
                        size={14}
                        className={`${
                            index <= rating 
                                ? "fill-yellow-400 text-yellow-400" // Estrella llena
                                : "fill-gray-200 text-gray-200"     // Estrella vacía
                        }`}
                    />
                ))}
                {/* Opcional: Mostrar el número al lado */}
                <span className="text-xs text-gray-400 ml-2 font-medium">
                    ({rating}/6)
                </span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className={`px-3 py-1 text-xs font-semibold rounded-full min-w-[100px] text-center ${statusInfo.color}`}>
          {statusInfo.text}
        </span>

        <button
          onClick={() => onViewDetail(id)}
          className="flex items-center px-3 py-2 bg-[var(--primary)] text-white rounded-md font-medium transition text-sm"
        >
          Ver Detalles
          <ChevronRight className="ml-1 w-4 h-4" />
        </button>
      </div>
    </div>
  );
}