import React from 'react';
import { ChevronRight, CalendarDays } from 'lucide-react';
import { ApplicantResponse } from "@/models/responses";

interface ApplicantCardProps {
  applicant: ApplicantResponse;
  onViewDetail: (id: number) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Aceptada':
      return { text: 'Aceptada', color: 'bg-green-500 text-white shadow-green-200' };
    case 'Rechazada':
      return { text: 'Rechazada', color: 'bg-red-500 text-white shadow-red-200' };
    case 'Pendiente':
    default:
      return { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-800 border border-yellow-200' };
  }
};

export default function ApplicantCard({ applicant, onViewDetail }: ApplicantCardProps) {
  const { studentId, applicantName, status, applicationDate } = applicant;
  const statusInfo = getStatusBadge(status);
  const initial = applicantName ? applicantName[0].toUpperCase() : 'U';
  const formattedDate = new Date(applicationDate).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-5 rounded-xl border border-transparent bg-white shadow-lg hover:shadow-xl transition-all duration-200 w-full group">
      
      <div className="flex items-center gap-4 flex-grow w-full md:w-auto mb-4 md:mb-0">
        <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 text-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shrink-0">
          {initial}
        </div>

        <div className="flex flex-col overflow-hidden">
             <span className="text-lg font-bold text-slate-800 truncate leading-tight">
               {applicantName}
            </span>
            <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                <CalendarDays className="w-3 h-3" />
                Postulado el: {formattedDate}
            </span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-4 md:pl-8 border-t md:border-t-0 border-slate-100 pt-4 md:pt-0">
        <span className={`px-4 py-1.5 text-xs font-bold rounded-full min-w-[110px] text-center shadow-sm ${statusInfo.color}`}>
          {statusInfo.text}
        </span>

        <button
          onClick={() => onViewDetail(studentId)}
          className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-purple-600 transition-all shadow-md text-sm gap-2 whitespace-nowrap"
        >
          Ver Detalles
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}