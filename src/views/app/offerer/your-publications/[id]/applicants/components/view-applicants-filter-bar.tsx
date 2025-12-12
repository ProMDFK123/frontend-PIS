// import React from 'react';
// import { Search } from 'lucide-react';
// import { ApplicantFilterType } from "@/views/app/admin/manage/[id]/applicants/hooks";

// interface Props {
//   text: string;
//   setText: (v: string) => void;
//   filterType: ApplicantFilterType;
//   setFilterType: (v: ApplicantFilterType) => void;
// }

// export default function ApplicantFilterBar({ text, setText, filterType, setFilterType }: Props) {
//   const statusOptions: { value: ApplicantFilterType; label: string }[] = [
//     { value: "All", label: "Todos" },
//     { value: "Published", label: "Seleccionados" },
//     { value: "Rejected", label: "No Seleccionados" },
//     { value: "Pending", label: "Pendientes" },
//   ];

//   return (
//     <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 md:p-5">
//       <div className="grid gap-3 md:grid-cols-4 lg:grid-cols-5">
//         <div className="relative md:col-span-3 lg:col-span-4">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted-ink)]" />
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="Buscar por nombre o ID..."
//             className="w-full rounded-xl border border-[var(--border)] bg-white pl-12 pr-4 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ring)]"
//           />
//         </div>

//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value as ApplicantFilterType)}
//           className="w-full rounded-xl border border-[var(--border)] bg-white px-4 py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--ring)]"
//         >
//           {statusOptions.map(option => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// }
