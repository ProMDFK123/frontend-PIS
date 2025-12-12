// src/components/ApplicantsPage.tsx
"use client"
import React from 'react';
import { useApplicantsView } from './hooks'; // Importamos el hook nuevo
import type { ApplicantResponse } from '@/models/responses';

interface Props {
  offerId: number | string;
}

 const ApplicantsPageView = ({ offerId }: Props) => {
  // CONEXIÓN: Usamos el hook para obtener lógica y datos
  const { 
    applicants, 
    totalCount, 
    isLoading, 
    isError, 
    searchTerm, 
    setSearchTerm 
  } = useApplicantsView(offerId);

  // Renderizado de estados de carga/error
  if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando postulantes...</div>;
  if (isError) return <div className="p-10 text-center text-red-500">Error al cargar datos.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      
      {/* --- HEADER --- */}
      <div className="relative bg-gradient-to-r from-violet-900 via-purple-800 to-fuchsia-800 px-6 py-8 md:px-10 md:py-12 shadow-md overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-pink-500 opacity-10 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Postulantes de la oferta
          </h1>
          <p className="text-purple-200 text-sm md:text-base font-medium">
            Gestionando <span className="text-yellow-400 font-bold">{totalCount}</span> postulaciones activas.
          </p>
        </div>
      </div>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 -mt-6 relative z-20">
        
        {/* BARRA DE BÚSQUEDA */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex items-center border border-gray-100">
          <div className="pl-4 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar postulante..."
            className="w-full p-3 text-gray-700 rounded-xl focus:outline-none placeholder-gray-400"
            value={searchTerm}
            // Aquí conectamos el input con el hook
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* LISTA DE CARDS */}
        <div className="space-y-4">
          {applicants.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron coincidencias.' : 'No hay postulantes aún.'}
              </p>
            </div>
          ) : (
            applicants.map((app) => (
              <ApplicantCard key={app.applicationId} applicant={app} />
            ))
          )}
        </div>
      </div>
    </div>
  );
  
};
export default ApplicantsPageView;
// --- SUB-COMPONENTE: ApplicantCard (Solo visual) ---
// Puedes mover esto a su propio archivo ApplicantCard.tsx si prefieres
const ApplicantCard = ({ applicant }: { applicant: ApplicantResponse }) => {
  const initial = applicant.applicantName.charAt(0).toUpperCase();

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'Aceptada': return 'bg-green-500 text-white';
      case 'Rechazada': return 'bg-red-500 text-white';
      case 'Pendiente': default: return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 transition-transform hover:scale-[1.01] duration-200">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shrink-0">
          {initial}
        </div>
        <div className="text-left">
          <h3 className="text-gray-800 font-bold text-lg leading-tight">{applicant.applicantName}</h3>
          <span className="text-xs text-gray-400 font-medium">
            Solicitado: {new Date(applicant.applicationDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-4 pl-16 md:pl-0">
        <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${getStatusStyles(applicant.status)}`}>
          {applicant.status}
        </span>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-colors">
          Ver Detalles
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

  // const { applicants, isLoading, error, refetch, totalCount, filterState } =
  //   useGetOffererApplicantsView(id);

  //   const { filterType, setFilterType, text, setText } = filterState;

  //   const handleViewDetail = (applicantId: number) => {
  //     router.push(
  //       `/offerer/your-publications/${id}/applicants/${applicantId}/detail`
  //     );
  //   };

  //   const renderContent = () => {
  //     if (isLoading) {
  //       return (
  //         <div className="text-center mt-12 text-[var(--muted-ink)]">
  //           Cargando lista de postulantes...
  //         </div>
  //       );
  //     }
  //     if (error) {
  //       return (
  //         <div className="max-w-xl mx-auto p-8 mt-12 bg-red-50 border border-red-200 rounded-lg text-center">
  //           <h2 className="text-xl font-semibold text-red-600 mb-4 flex justify-center items-center gap-2">
  //             <AlertCircle size={24} /> Error al cargar postulantes
  //           </h2>
  //           <p className="text-sm text-red-500 mb-6">{error}</p>
  //           <button
  //             onClick={refetch}
  //             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold"
  //           >
  //             Reintentar
  //           </button>
  //         </div>
  //       );
  //     }
  //     if (totalCount === 0) {
  //       return (
  //         <div className="text-center mt-12 p-8 border border-[var(--border)] rounded-xl text-[var(--muted-ink)]">
  //           No hay postulantes registrados para esta publicación.
  //         </div>
  //       );
  //     }
  //     return (
  //       <div className="mt-6 space-y-3">
  //         {applicants.map((applicant: ViewAppplicantsForAdmin, index) => (
  //           <ApplicantCard
  //             key={applicant.id || index}
  //             applicant={applicant}
  //             onViewDetail={handleViewDetail}
  //           />
  //         ))}
  //       </div>
  //     );
  //   };

  //   return (
  //     <main className="max-w-7xl mx-auto px-4 py-6">
  //       <button
  //         onClick={() => router.push(backRoute)}
  //         className="mb-4 text-[var(--primary)] hover:underline flex items-center gap-1"
  //       >
  //         <ChevronLeft size={20} /> Volver al detalle
  //       </button>

  //       <h1 className="text-3xl font-extrabold text-[var(--ink)] mb-1">
  //         Postulantes de la oferta
  //       </h1>

  //       <p className="text-base text-[var(--muted-ink)] mb-4">
  //         {totalCount} postulantes encontrados.
  //       </p>

  //       <ApplicantFilterBar
  //         text={text}
  //         setText={setText}
  //         filterType={filterType}
  //         setFilterType={setFilterType}
  //       />

  //       {renderContent()}
  //     </main>
  //   );

