
// import React from 'react';
// import { ChevronRight } from 'lucide-react';
// import { ViewAppplicantsForAdmin } from "@/models/responses";

// interface ApplicantCardProps {
//   applicant: ViewAppplicantsForAdmin;
//   onViewDetail: (id: number) => void;
// }

// const getStatusBadge = (status: ViewAppplicantsForAdmin['status']) => {
//   switch (status) {
//     case 'Published':
//       return { text: 'Seleccionado', color: 'bg-indigo-500 text-white' };
//     case 'Rejected':
//       return { text: 'No Seleccionado', color: 'bg-red-500 text-white' };
//     case 'Pending':
//     default:
//       return { text: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' };
//   }
// };

// export default function ApplicantCard({ applicant, onViewDetail }: ApplicantCardProps) {
//   const { id, applicant: applicantName, status } = applicant;
//   const statusInfo = getStatusBadge(status);
//   const initial = applicantName ? applicantName[0].toUpperCase() : 'U';

//   return (
//     <div className="flex items-center justify-between p-5 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm w-full">
//       <div className="flex items-center gap-4 flex-grow">
//         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-semibold">
//           {initial}
//         </div>

//         <span className="text-lg font-semibold text-[var(--ink)] flex-grow truncate">
//           {applicantName}
//         </span>
//       </div>

//       <div className="flex items-center gap-3">
//         <span className={`px-3 py-1 text-xs font-semibold rounded-full min-w-[100px] text-center ${statusInfo.color}`}>
//           {statusInfo.text}
//         </span>

//         <button
//           onClick={() => onViewDetail(id)}
//           className="flex items-center px-3 py-2 bg-[var(--primary)] text-white rounded-md font-medium hover:bg-[var(--primary-dark)] transition text-sm"
//         >
//           Ver Detalles
//           <ChevronRight className="ml-1 w-4 h-4" />
//         </button>
//       </div>
//     </div>
//   );
// }
