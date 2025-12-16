"use client"
import { useEffect } from 'react';
import LoadingSpinner from './components/loading-spinner';
import { useRouter } from 'next/navigation';
import { usePublicationForm } from './hooks/usePublicationForm';
import { ArrowLeft, Sparkles, BookOpen, Calendar, Clock, MapPin, Mail, Briefcase } from "lucide-react";
import { NotificationBanner } from "@/components/ui/notification";

/**
 * Vista principal para crear una nueva publicación.
 * Renderiza un formulario dinámico que cambia sus campos según si el usuario selecciona
 * "Oferta Laboral" o "Venta de Artículo".
 */
export default function PublicationFormView() {
  const router = useRouter();
  const { 
    formData, 
    errors, 
    isLoading, 
    isSubmitting, 
    handleInputChange, 
    handleSubmit,
    notification,
    isVisible,
    closeNotification
  } = usePublicationForm();

  // Flags para renderizado condicional de secciones del formulario
  const isJobOffer = formData.offerType === '0'; 
  const isProduct = formData.offerType === '1';

  // Efecto para asegurar que "Voluntariado" esté seleccionado visualmente por defecto
  useEffect(() => {
    if (isJobOffer && !formData.jobType) {
        handleInputChange({ target: { name: 'jobType', value: 'JobOffer' } } as any);
    }
  }, [isJobOffer, formData.jobType, handleInputChange]);

  if (isLoading) return <LoadingSpinner />;

  // Clases reutilizables para mantener consistencia en el diseño dark/glass
  const inputClass = (hasError: boolean) => `
    w-full px-4 py-3 rounded-xl 
    bg-gray-50 border ${hasError ? 'border-red-500' : 'border-gray-200'} 
    text-gray-900 placeholder:text-gray-400 
    focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white
    outline-none transition-all
  `;

  const labelClass = "block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide";

  return (
    <div className="flex flex-col min-h-screen relative text-white selection:bg-pink-500 selection:text-white overflow-hidden bg-slate-900">
        
        {/* Background Layers (Igual que ValidationView) */}
        <div className="fixed inset-0 z-0">
            <img 
                src="/fondo.png" 
                alt="Fondo UCN" 
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-violet-900/90 via-purple-800/90 to-fuchsia-800/80 mix-blend-hard-light" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/50 to-purple-950/90" />
        </div>

        <NotificationBanner 
            data={notification}
            isVisible={isVisible}
            onClose={closeNotification}
        />

        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
            
            {/* Header */}
            <header className="mb-10 max-w-3xl mx-auto">
                <button 
                    onClick={() => router.back()} 
                    className="mb-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all font-bold text-sm backdrop-blur-sm border border-white/10"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver
                </button>
                
                <div className="flex flex-col items-start gap-2">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider shadow-lg transform -rotate-1">
                        <Sparkles className="w-3.5 h-3.5" /> Nueva Publicación
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg leading-tight mt-2">
                        Crear <br className="md:hidden"/> Oportunidad
                    </h1>
                    <p className="text-purple-100 text-lg font-medium mt-3 drop-shadow-md">
                        Comparte una oferta laboral o vende un artículo a la comunidad.
                    </p>
                </div>
            </header>

            {/* Form Container (Glassmorphism) */}
            <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] border border-gray-200 p-6 md:p-10 shadow-2xl">
                <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* --- SELECTOR DE TIPO DE PUBLICACIÓN --- */}
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <label className={labelClass}>Tipo de Publicación *</label>
              <div className="relative">
                <select
                    name="offerType"
                    value={formData.offerType} onChange={handleInputChange}
                    className={inputClass(false) + " appearance-none cursor-pointer"}
                >
                    <option value="0" className="text-gray-900 bg-white">Oferta Laboral / Práctica</option>
                    <option value="1" className="text-gray-900 bg-white">Venta de Artículo / Libro</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <Briefcase size={20} />
                </div>
              </div>
            </div>

            {/* --- CAMPOS COMUNES --- */}
            <div className="space-y-6">
                <div>
                <label className={labelClass}>Título *</label>
                <input
                    type="text" name="title"
                    value={formData.title} onChange={handleInputChange}
                    className={inputClass(!!errors.title)}
                    placeholder={isJobOffer ? "Ej: Se busca Ayudante" : "Ej: Vendo Libro"}
                />
                {errors.title && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>{errors.title}</p>}
                </div>

                <div>
                <label className={labelClass}>Descripción *</label>
                <textarea
                    name="description" rows={4}
                    value={formData.description} onChange={handleInputChange}
                    className={inputClass(!!errors.description) + " resize-none"}
                    placeholder="Describe los detalles..."
                />
                {errors.description && <p className="text-red-500 text-xs mt-2 font-medium flex items-center gap-1"><span className="inline-block w-1 h-1 rounded-full bg-red-500"></span>{errors.description}</p>}
                </div>

            </div>
            {/* --- SECCIÓN COMÚN: CONTACTO --- */}
            <div>
               <label className={labelClass}>Información de Contacto *</label>
               <div className="relative">
                    <input
                        type="text" name="contactInfo"
                        value={formData.contactInfo} onChange={handleInputChange}
                        className={inputClass(!!errors.contactInfo)}
                        placeholder="Ej: correo@ucn.cl"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
               </div>
               {errors.contactInfo && <p className="text-red-500 text-xs mt-2 font-medium">{errors.contactInfo}</p>}
            </div>
            {/* --- SECCIÓN ESPECÍFICA: VENTA (TIPO 2) --- */}
            {isProduct && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Categoría *</label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category} onChange={handleInputChange}
                                    className={inputClass(!!errors.category) + " appearance-none"}
                                >
                                    <option value="" className="text-gray-900 bg-white">Selecciona...</option>
                                    <option value="Libros Universitarios" className="text-gray-900 bg-white">Libros Universitarios</option>
                                    <option value="Materiales" className="text-gray-900 bg-white">Materiales / Insumos</option>
                                    <option value="Tutorías" className="text-gray-900 bg-white">Tutorías</option>
                                    <option value="Otros" className="text-gray-900 bg-white">Otros</option>
                                </select>
                                <BookOpen className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                            {errors.category && <p className="text-red-500 text-xs mt-2 font-medium">{errors.category}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Precio (CLP) *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">$</span>
                                <input
                                    type="number" name="price"
                                    value={formData.price} onChange={handleInputChange}
                                    className={inputClass(!!errors.price) + " pl-8"}
                                    placeholder="1000"
                                />
                            </div>
                            {errors.price && <p className="text-red-500 text-xs mt-2 font-medium">{errors.price}</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* --- SECCIÓN ESPECÍFICA: OFERTA LABORAL (TIPO 1) --- */}
            {isJobOffer && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div>
                        <label className={labelClass}>Tipo de Trabajo *</label>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { id: 'JobOffer', label: 'Trabajo' },
                                { id: 'Volunteering', label: 'Voluntariado' },
                            ].map((type) => (
                                <label key={type.id} className={`
                                    cursor-pointer rounded-xl border p-3 text-center transition-all
                                    ${formData.jobType === type.id 
                                        ? 'bg-purple-600 text-white border-purple-600 font-bold shadow-lg scale-105' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}
                                `}>
                                    <input 
                                        type="radio" 
                                        name="jobType" 
                                        value={type.id} 
                                        checked={formData.jobType === type.id} 
                                        onChange={handleInputChange} 
                                        className="hidden"
                                    />
                                    {type.label}
                                </label>
                            ))}
                        </div>
                        {errors.jobType && <p className="text-red-500 text-xs mt-2 font-medium">{errors.jobType}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Cierre Postulaciones *</label>
                            <div className="relative">
                                <input type="date" name="deadlineDate" value={formData.deadlineDate} onChange={handleInputChange} 
                                    className={inputClass(!!errors.deadlineDate)} />
                                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                            {errors.deadlineDate && <p className="text-red-500 text-xs mt-2 font-medium">{errors.deadlineDate}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Fecha de Término *</label>
                            <div className="relative">
                                <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} 
                                    className={inputClass(!!errors.endDate)} />
                                <Clock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                            {errors.endDate && <p className="text-red-500 text-xs mt-2 font-medium">{errors.endDate}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={labelClass}>Remuneración</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                <input
                                    type="number" name="remuneration"
                                    value={formData.remuneration} onChange={handleInputChange}
                                    className={inputClass(!!errors.remuneration) + " pl-8"}
                                    placeholder="0.00"
                                    disabled={formData.jobType === 'Volunteering'}
                                    min={formData.jobType === 'JobOffer' ? "1" : "0"}
                                />
                            </div>
                            {formData.jobType === 'Volunteering' && (
                                <p className="text-yellow-600 text-xs mt-2 font-medium">* Un voluntariado no puede tener remuneración</p>
                            )}
                            {errors.remuneration && <p className="text-red-500 text-xs mt-2 font-medium">{errors.remuneration}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Ubicación *</label>
                            <div className="relative">
                                <input type="text" name="location" value={formData.location} onChange={handleInputChange} 
                                    className={inputClass(!!errors.location)} placeholder="Ej: Coquimbo"/>
                                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                            </div>
                            {errors.location && <p className="text-red-500 text-xs mt-2 font-medium">{errors.location}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={labelClass}>Requisitos</label>
                        <textarea name="requirements" rows={3} value={formData.requirements} onChange={handleInputChange} 
                            className={inputClass(false) + " resize-none"} />
                    </div>

                    <div className="flex items-center p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <input
                            id="isCvRequired" name="isCvRequired" type="checkbox"
                            checked={formData.isCvRequired} onChange={handleInputChange}
                            className="h-5 w-5 text-purple-600 rounded border-gray-300 bg-white focus:ring-purple-500"
                        />
                        <label htmlFor="isCvRequired" className="ml-3 block text-sm font-medium text-gray-700">¿Requiere enviar CV?</label>
                    </div>
                </div>
            )}

           

            {/* Botón de Envío */}
            <button 
                type="submit" 
                disabled={isSubmitting} 
                className="w-full bg-purple-600 text-white hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed font-black text-lg py-4 rounded-xl shadow-xl shadow-purple-600/20 transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
                {isSubmitting ? 'Enviando...' : (isProduct ? 'PUBLICAR VENTA' : 'PUBLICAR OFERTA')}
            </button>

          </form>
        </div>
      </main>
    </div>
  );
}
// 'use client';

// import LoadingSpinner from './components/loading-spinner';
// import { useRouter } from 'next/navigation';
// import { usePublicationForm } from './hooks/usePublicationForm';

// export default function PublicationFormView() {
//   const router = useRouter();
//   const { formData, errors, isLoading, isSubmitting, handleInputChange, handleSubmit } = usePublicationForm();

//   // Helper para saber qué modo estamos viendo
//   // Asumimos: '1' = Oferta Laboral/Práctica (Tu primer JSON), '2' = Venta/Producto (Tu segundo JSON)
//   const isJobOffer = formData.offerType === '1'; 
//   const isProduct = formData.offerType === '2';

//   if (isLoading) return <LoadingSpinner />;

//   return (
//     <div className="min-h-screen bg-purple-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
        
//         {/* Header */}
//         <div className="mb-8">
//            <button onClick={() => router.back()} className="text-gray-600 hover:text-indigo-600 mb-4 flex items-center gap-2">
//              ← Volver
//            </button>
//            <h1 className="text-3xl font-bold text-gray-900">Crear Publicación</h1>
//         </div>

//         <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
//           <form onSubmit={handleSubmit} className="space-y-6">
            
//             {/* --- SELECTOR DE TIPO (El que controla todo) --- */}
//             <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
//               <label className="block text-sm font-bold text-indigo-900 mb-2">Tipo de Publicación *</label>
//               <select
//                 name="offerType"
//                 value={formData.offerType} onChange={handleInputChange}
//                 className="w-full px-4 py-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 bg-white"
//               >
//                 <option value="1">Oferta Laboral / Práctica</option>
//                 <option value="2">Venta de Artículo / Libro</option>
//               </select>
//             </div>

//             {/* --- CAMPOS COMUNES (Título y Descripción) --- */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
//               <input
//                 type="text" name="title"
//                 value={formData.title} onChange={handleInputChange}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
//                 placeholder={isJobOffer ? "Ej: Se busca Ayudante de Química" : "Ej: Vendo Libro de Cálculo I"}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
//               <textarea
//                 name="description" rows={4}
//                 value={formData.description} onChange={handleInputChange}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
//               />
//             </div>

//             {/* ========================================================= */}
//             {/* LÓGICA CONDICIONAL: CAMPOS EXCLUSIVOS DE "VENTA" (TIPO 2) */}
//             {/* ========================================================= */}
//             {isProduct && (
//                 <div className="animate-fade-in space-y-6">
//                     {/* Category */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Categoría *</label>
//                         <select
//                             name="category"
//                             value={
//                             1
//                               // formData.category
//                             } onChange={handleInputChange}
//                             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white"
//                         >
//                             <option value="">Selecciona una categoría...</option>
//                             <option value="Libros Universitarios">Libros Universitarios</option>
//                             <option value="Materiales">Materiales / Insumos</option>
//                             <option value="Tutorías">Tutorías</option>
//                             <option value="Otros">Otros</option>
//                         </select>
//                     </div>

//                     {/* Price (Label específico) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Precio (CLP) *</label>
//                         <div className="relative">
//                             <span className="absolute left-3 top-3 text-gray-500">$</span>
//                             <input
//                                 type="number" name="price" // Asegúrate de que tu hook maneje este nombre o usa 'remuneration' si el back lo recicla
//                                 value={
//                                 //  formData.price
//                                 0
//                                 } onChange={handleInputChange}
//                                 className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
//                                 placeholder="1.00"
//                             />
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* ========================================================= */}
//             {/* LÓGICA CONDICIONAL: CAMPOS EXCLUSIVOS DE "OFERTA" (TIPO 1) */}
//             {/* ========================================================= */}
//             {isJobOffer && (
//                 <div className="animate-fade-in space-y-6">
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Trabajo *</label>
//                         <select
//                             name="jobType" // Asegúrate de agregar 'jobType' a tu usePublicationForm/useState
//                             value={
//                              "voluntariado"
//                               // formData.jobType
//                             } 
//                             onChange={handleInputChange}
//                             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 bg-white"
//                         >

//                             <option value="Full Time">Oferta de Trabajo</option>
//                             <option value="Part Time">Voluntariado</option>

//                         </select>
//                     </div>
//                     {/* Fechas (Deadline y EndDate) */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Cierre Postulaciones (Deadline)</label>
//                             <input type="datetime-local" name="deadlineDate" value={formData.deadlineDate} onChange={handleInputChange} 
//                                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500" />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Término (EndDate)</label>
//                             <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleInputChange} 
//                                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500" />
//                         </div>
//                     </div>

//                     {/* Remuneration (Label específico) */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Remuneración</label>
//                         <div className="relative">
//                             <span className="absolute left-3 top-3 text-gray-500">$</span>
//                             <input
//                                 type="number" name="remuneration"
//                                 value={formData.remuneration} onChange={handleInputChange}
//                                 className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
//                                 placeholder="0.00"
//                             />
//                         </div>
//                     </div>

//                     {/* Location */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
//                         <input type="text" name="location" value={formData.location} onChange={handleInputChange} 
//                             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500" placeholder="Ej: Campus Guayacán, Coquimbo"/>
//                     </div>

//                     {/* Requirements */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos</label>
//                         <textarea name="requirements" rows={3} value={formData.requirements} onChange={handleInputChange} 
//                             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Ej: Estudiante de Biología..."/>
//                     </div>

//                     {/* Checkbox CV */}
//                     <div className="flex items-center bg-gray-50 p-3 rounded-lg">
//                         <input
//                             id="isCvRequired" name="isCvRequired" type="checkbox"
//                             checked={formData.isCvRequired} onChange={handleInputChange}
//                             className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                         />
//                         <label htmlFor="isCvRequired" className="ml-3 block text-sm font-medium text-gray-900">¿Requiere enviar CV?</label>
//                     </div>
//                 </div>
//             )}

//             {/* --- CAMPO COMÚN FINAL (Contacto) --- */}
//             <div>
//                <label className="block text-sm font-medium text-gray-700 mb-2">Información de Contacto *</label>
//                <input
//                  type="text" name="contactInfo"
//                  value={formData.contactInfo} onChange={handleInputChange}
//                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
//                  placeholder={isProduct ? "Ej: WhatsApp +569..." : "Ej: correo@ucn.cl"}
//                />
//             </div>

//             {/* Submit Button */}
//             <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all">
//                 {isSubmitting ? 'Enviando...' : (isProduct ? 'PUBLICAR VENTA' : 'PUBLICAR OFERTA')}
//             </button>

//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// 'use client';

// // 1. Corregimos el nombre del archivo y del componente a "Spinner" (doble n)
// // 2. Asegúrate de que este archivo esté en src/views/CreatePublication/index.tsx
// import LoadingSpinner from './components/loading-spinner';
// import { useRouter } from 'next/navigation';
// import { usePublicationForm } from './hooks/usePublicationForm';

// export default function PublicationFormView() {
//   const router = useRouter();

//   // Extraemos la lógica del hook local
//   const { 
//     formData, 
//     errors, 
//     isLoading, 
//     isSubmitting, 
//     handleInputChange, 
//     handleSubmit 
//   } = usePublicationForm();

//   // Estado de carga
//   if (isLoading) {
//     return <LoadingSpinner />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-2xl mx-auto">
        
//         {/* Header */}
//         <div className="mb-8">
//           <button 
//             onClick={() => router.back()} 
//             className="text-white hover:text-indigo-200 transition-colors mb-4 flex items-center gap-2"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Volver
//           </button>
//           <h1 className="text-3xl font-bold text-white mb-2">Ingresa tu publicación</h1>
//           <p className="text-indigo-200">
//             Completa el siguiente formulario para publicar tu oferta laboral.
//           </p>
//         </div>

//         {/* Form Container */}
//         <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
            
//             {/* Título */}
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
//               <input
//                 type="text" id="title" name="title"
//                 value={formData.title} onChange={handleInputChange}
//                 className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
//                 placeholder="Ej: Desarrollador Full Stack"
//               />
//               {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
//             </div>

//             {/* Descripción */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
//               <textarea
//                 id="description" name="description" rows={6}
//                 value={formData.description} onChange={handleInputChange}
//                 className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none`}
//                 placeholder="Detalles de la oferta..."
//               />
//               {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
//             </div>

//             {/* Tipo de Oferta */}
//             <div>
//               <label htmlFor="offerType" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Oferta *</label>
//               <select
//                 id="offerType" name="offerType"
//                 value={formData.offerType} onChange={handleInputChange}
//                 className={`w-full px-4 py-3 rounded-lg border ${errors.offerType ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 bg-white outline-none`}
//               >
//                 <option value="0">Trabajo (Remunerado)</option>
//                 <option value="1">Pasantía / Voluntariado</option>
//               </select>
//             </div>

//             {/* Fechas */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700 mb-2">Cierre Postulaciones *</label>
//                 <input
//                   type="date" id="deadlineDate" name="deadlineDate"
//                   value={formData.deadlineDate} onChange={handleInputChange}
//                   className={`w-full px-4 py-3 rounded-lg border ${errors.deadlineDate ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 outline-none`}
//                 />
//                 {errors.deadlineDate && <p className="mt-1 text-sm text-red-600">{errors.deadlineDate}</p>}
//               </div>

//               <div>
//                 <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">Término de Oferta *</label>
//                 <input
//                   type="date" id="endDate" name="endDate"
//                   value={formData.endDate} onChange={handleInputChange}
//                   className={`w-full px-4 py-3 rounded-lg border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 outline-none`}
//                 />
//                 {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Remuneración */}
//               <div>
//                 <label htmlFor="remuneration" className="block text-sm font-medium text-gray-700 mb-2">Remuneración (CLP)</label>
//                 <input
//                   type="number" id="remuneration" name="remuneration"
//                   value={formData.remuneration} onChange={handleInputChange}
//                   disabled={formData.offerType === '1'}
//                   className={`w-full px-4 py-3 rounded-lg border ${errors.remuneration ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 outline-none ${formData.offerType === '1' ? 'bg-gray-100' : ''}`}
//                   placeholder="Ej: 500000"
//                 />
//                 {errors.remuneration && <p className="mt-1 text-sm text-red-600">{errors.remuneration}</p>}
//               </div>
//               {/* Ubicación */}
//               <div>
//                 <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
//                 <input
//                   type="text" id="location" name="location"
//                   value={formData.location} onChange={handleInputChange}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
//                   placeholder="Ej: Coquimbo"
//                 />
//               </div>
//             </div>

//             {/* Requisitos y Contacto */}
//             <div>
//                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">Requisitos</label>
//                <textarea
//                  id="requirements" name="requirements" rows={3}
//                  value={formData.requirements} onChange={handleInputChange}
//                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
//                />
//             </div>
//             <div>
//                <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">Contacto</label>
//                <input
//                  type="text" id="contactInfo" name="contactInfo"
//                  value={formData.contactInfo} onChange={handleInputChange}
//                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
//                />
//             </div>

//             {/* Requiere CV */}
//             <div className="flex items-center">
//               <input
//                 id="isCvRequired" name="isCvRequired" type="checkbox"
//                 checked={formData.isCvRequired} onChange={handleInputChange}
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//               />
//               <label htmlFor="isCvRequired" className="ml-2 block text-sm text-gray-900">¿Requiere CV?</label>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit" disabled={isSubmitting}
//                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all disabled:opacity-50"
//               >
//                 {isSubmitting ? 'Enviando...' : 'ENVIAR OFERTA'}
//               </button>
//             </div>

//           </form>
//         </div>
        
//         <footer className="mt-12 text-center text-indigo-200 text-sm">
//           <p>© 2024 Bolsa UCN. Todos los derechos reservados.</p>
//         </footer>
//       </div>
//     </div>
//   );
// }