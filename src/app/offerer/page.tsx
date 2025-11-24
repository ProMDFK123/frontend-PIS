import {PublicationFormView } from '@/views/app';

export default function CreatePublicationPage() {
  return <PublicationFormView />;
}
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { publicationService } from 'src/services/publicationService';
// import { AxiosError } from 'axios';
// import Cookies from 'js-cookie';
// import { buildLoginUrl } from 'src/lib/auth';

// // Interfaz para el estado del formulario (usamos camelCase para el estado)
// interface FormData {
//   title: string;
//   description: string;
//   offerType: string; // '0' para Trabajo, '1' para Voluntariado
//   endDate: string;
//   deadlineDate: string;
//   remuneration: string;
//   location: string;
//   requirements: string;
//   contactInfo: string;
//   isCvRequired: boolean;
// }

// export default function PublicationForm() {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga inicial y la verificación
//   const [formData, setFormData] = useState<FormData>({
//     title: '',
//     description: '',
//     offerType: '0', // Por defecto 'Trabajo'
//     endDate: '',
//     deadlineDate: '',
//     remuneration: '',
//     location: '',
//     requirements: '',
//     contactInfo: '',
//     isCvRequired: false,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

//   // ✅ PASO 1: Hook de efecto para verificar la autenticación al cargar el componente
//   useEffect(() => {
//     const token = Cookies.get('token');

//     if (!token) {
//       // Si no hay token, redirigir al login.
//       // Guardamos la ruta actual para que el usuario pueda volver aquí después de iniciar sesión.
//       const currentPath = window.location.pathname;
//       window.location.href = buildLoginUrl(currentPath, 'login_required');
//     } else {
//       // Si hay token, el usuario está (probablemente) autenticado.
//       // Dejamos de cargar y mostramos el formulario.
//       setIsLoading(false);
//       //hay que tener cuidado, porque si esta autenticado como estudiante, puede que tambien pueda acceder
//     }
//   }, []); // El array vacío asegura que esto se ejecute solo una vez, al montar el componente.

//   // ✅ PASO EXTRA: Hook de efecto para limpiar la remuneración si la oferta no es remunerada
//   useEffect(() => {
//     // Si el tipo de oferta es 'Pasantía / Voluntariado' (valor '1'),
//     // forzamos la remuneración a '0' para evitar inconsistencias.
//     if (formData.offerType === '1') {
//       setFormData(prev => ({ ...prev, remuneration: '0' }));
//     }
//   }, [formData.offerType]); // Se ejecuta cada vez que el tipo de oferta cambia


//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
//   ) => {
//     const { name, value, type } = e.target;
//     const checked = (e.target as HTMLInputElement).checked;

//     setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

//     if (errors[name as keyof FormData]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const validateForm = (): boolean => {
//     const newErrors: Partial<Record<keyof FormData, string>> = {};

//     if (!formData.title.trim()) {
//       newErrors.title = 'El título es requerido';
//     } else if (formData.title.length < 5 || formData.title.length > 200) {
//       newErrors.title = 'El título debe tener entre 5 y 200 caracteres';
//     }

//     if (!formData.description.trim()) {
//       newErrors.description = 'La descripción es requerida';
//     } else if (formData.description.length < 10 || formData.description.length > 2000) {
//       newErrors.description =
//         'La descripción debe tener entre 10 y 2000 caracteres';
//     }

//     if (!formData.offerType) {
//       newErrors.offerType = 'Debes seleccionar un tipo de oferta';
//     }

//     // Validar que la fecha límite no sea en el pasado
//     const today = new Date();
//     today.setHours(0, 0, 0, 0); // Normalizar a la medianoche para comparar solo fechas

//     if (!formData.deadlineDate) {
//       newErrors.deadlineDate = 'La fecha límite para postular es requerida';
//     } else if (new Date(formData.deadlineDate) < today) {
//       newErrors.deadlineDate = 'La fecha límite no puede ser una fecha pasada';
//     }

//     if (!formData.endDate) {
//       newErrors.endDate = 'La fecha de término es requerida';
//     } else if (new Date(formData.endDate) < today) {
//       newErrors.endDate = 'La fecha de término no puede ser una fecha pasada';
//     }

//     // Validar que la fecha de término sea posterior a la fecha límite
//     // Solo si ambas fechas son válidas hasta ahora
//     if (!newErrors.endDate && !newErrors.deadlineDate) {
//       if (new Date(formData.endDate) <= new Date(formData.deadlineDate)) {
//         newErrors.endDate =
//           'La fecha de término debe ser posterior a la fecha límite de postulación';
//       }
//     }

//     // ✅ Validar que la remuneración no sea negativa
//     if (formData.offerType === '0' && !formData.remuneration) {
//       newErrors.remuneration =
//         'La remuneración es requerida para ofertas de trabajo';
//     } else if (formData.remuneration) {
//       const remunerationValue = parseFloat(formData.remuneration);
//       if (remunerationValue < 0) {
//         newErrors.remuneration = 'La remuneración no puede ser un valor negativo';
//       }

//       // ✅ Validar que la remuneración sea 0 si es voluntariado
//       if (formData.offerType === '1' && remunerationValue !== 0) {
//         newErrors.remuneration = 'Un voluntariado no puede tener remuneración';
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const remunerationValue = formData.offerType === '1' ? 0 : (formData.remuneration ? parseFloat(formData.remuneration) : 0);

//       // Construir el objeto con los nombres de campo que el backend espera (PascalCase)
//       const publication = await publicationService.create({
//         Title: formData.title,
//         Description: formData.description,
//         OfferType: parseInt(formData.offerType, 10),
//         EndDate: formData.endDate || undefined,
//         DeadlineDate: formData.deadlineDate || undefined,
//         Remuneration: remunerationValue,
//         Location: formData.location || undefined,
//         Requirements: formData.requirements || undefined,
//         ContactInfo: formData.contactInfo || undefined,
//         IsCvRequired: formData.isCvRequired,
//         // El backend espera ImagesURL como un array. Por ahora, enviamos un array vacío.
//         ImagesURL: [],
//       });

//       console.log('Publicación creada exitosamente:', publication);

//       // Mostrar mensaje de éxito
//       alert('¡Publicación creada exitosamente!');

//       // Redirigir a la página de éxito o listado
//       router.push('/offerer/your-publications?success=true');
//     } catch (error) {
//       // Manejar errores específicos de Axios
//       if (error instanceof AxiosError) {
//         if (error.response) {
//           // El servidor respondió con un error
//           const errorMessage = error.response.data?.message ||
//                              error.response.data?.errors?.[0] ||
//                              'Error al enviar la publicación';
//           alert(errorMessage);

//           // Si hay errores de validación del servidor, mostrarlos
//           if (error.response?.data?.errors) {
//             const serverErrors: any = {};
//             const errorsData = error.response.data.errors;
//             Object.keys(errorsData).forEach(key => {
//               serverErrors[key.toLowerCase()] = errorsData[key][0];
//             });
//             setErrors(serverErrors);
//           }
//         } else if (error.request) {
//           // La petición se hizo pero no hubo respuesta
//           alert('No se pudo conectar con el servidor. Verifica tu conexión.');
//         } else {
//           // Algo pasó al configurar la petición
//           alert('Error al procesar la solicitud. Intenta nuevamente.');
//         }
//       } else {
//         alert('Ocurrió un error inesperado. Por favor, intenta nuevamente.');
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ✅ PASO 2: Mostrar un estado de carga mientras se verifica el token
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 flex items-center justify-center">
//         <div className="text-center text-white">
//           <svg className="animate-spin h-8 w-8 text-white mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//           </svg>
//           <p className="text-lg">Verificando autorización...</p>
//         </div>
//       </div>
//     );
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
//             Completa el siguiente formulario para publicar tu oferta laboral y encontrar al candidato ideal,
//             o para anunciar el producto o artículo que desees ofrecer.
//           </p>
//         </div>

//         {/* Form Container */}
//         <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Título */}
//             <div>
//               <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
//                 Título para la oferta *
//               </label>
//               <input
//                 type="text"
//                 id="title"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 rounded-lg border ${
//                   errors.title ? 'border-red-500' : 'border-gray-300'
//                 } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
//                 placeholder="Ej: Desarrollador Full Stack"
//               />
//               {errors.title && (
//                 <p className="mt-1 text-sm text-red-600">{errors.title}</p>
//               )}
//             </div>

//             {/* Descripción */}
//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
//                 Descripción *
//               </label>
//               <textarea
//                 id="description"
//                 name="description"
//                 value={formData.description}
//                 onChange={handleInputChange}
//                 rows={6}
//                 className={`w-full px-4 py-3 rounded-lg border ${
//                   errors.description ? 'border-red-500' : 'border-gray-300'
//                 } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none`}
//                 placeholder="Describe los detalles de la oferta..."
//               />
//               {errors.description && (
//                 <p className="mt-1 text-sm text-red-600">{errors.description}</p>
//               )}
//             </div>

//             {/* Tipo de Oferta */}
//             <div>
//               <label htmlFor="offerType" className="block text-sm font-medium text-gray-700 mb-2">
//                 Tipo de Oferta *
//               </label>
//               <select
//                 id="offerType"
//                 name="offerType"
//                 value={formData.offerType}
//                 onChange={handleInputChange}
//                 className={`w-full px-4 py-3 rounded-lg border ${
//                   errors.offerType ? 'border-red-500' : 'border-gray-300'
//                 } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white`}
//               >
//                 <option value="0">Trabajo (Remunerado)</option>
//                 <option value="1">Pasantía / Voluntariado</option>
//               </select>
//               {errors.offerType && (
//                 <p className="mt-1 text-sm text-red-600">{errors.offerType}</p>
//               )}
//             </div>

//             {/* Fechas */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700 mb-2">
//                   Fecha Límite de Postulación *
//                 </label>
//                 <input
//                   type="date"
//                   id="deadlineDate"
//                   name="deadlineDate"
//                   value={formData.deadlineDate}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 rounded-lg border ${
//                     errors.deadlineDate ? 'border-red-500' : 'border-gray-300'
//                   } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
//                 />
//                 {errors.deadlineDate && (
//                   <p className="mt-1 text-sm text-red-600">{errors.deadlineDate}</p>
//                 )}
//               </div>

//               <div>
//                 <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
//                   Fecha de Término de la Oferta *
//                 </label>
//                 <input
//                   type="date"
//                   id="endDate"
//                   name="endDate"
//                   value={formData.endDate}
//                   onChange={handleInputChange}
//                   className={`w-full px-4 py-3 rounded-lg border ${
//                     errors.endDate ? 'border-red-500' : 'border-gray-300'
//                   } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
//                 />
//                 {errors.endDate && (
//                   <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Remuneración */}
//               <div>
//                 <label htmlFor="remuneration" className="block text-sm font-medium text-gray-700 mb-2">
//                   Remuneración (CLP)
//                 </label>
//                 <input
//                   type="number"
//                   id="remuneration"
//                   name="remuneration"
//                   value={formData.remuneration}
//                   onChange={handleInputChange}
//                   disabled={formData.offerType === '1'}
//                   className={`w-full px-4 py-3 rounded-lg border ${errors.remuneration ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all ${formData.offerType === '1' ? 'bg-gray-100' : ''}`}
//                   placeholder="Ej: 500000 (0 si no aplica)"
//                 />
//                 {errors.remuneration && (
//                   <p className="mt-1 text-sm text-red-600">{errors.remuneration}</p>
//                 )}
//               </div>
//               {/* Ubicación */}
//               <div>
//                 <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
//                   Ubicación
//                 </label>
//                 <input
//                   type="text"
//                   id="location"
//                   name="location"
//                   value={formData.location}
//                   onChange={handleInputChange}
//                   className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
//                   placeholder="Ej: Campus Guayacán, Coquimbo"
//                 />
//               </div>
//             </div>

//             {/* Requisitos */}
//             <div>
//               <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
//                 Requisitos (opcional)
//               </label>
//               <textarea
//                 id="requirements"
//                 name="requirements"
//                 value={formData.requirements}
//                 onChange={handleInputChange}
//                 rows={3}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
//                 placeholder="Ej: Estudiante de 3er año en adelante, manejo de Excel..."
//               />
//             </div>

//             {/* Contacto */}
//             <div>
//               <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
//                 Información de Contacto (opcional)
//               </label>
//               <input
//                 type="text"
//                 id="contactInfo"
//                 name="contactInfo"
//                 value={formData.contactInfo}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
//                 placeholder="Ej: correo@ejemplo.com o +569..."
//               />
//             </div>

//             {/* Requiere CV */}
//             <div className="flex items-center">
//               <input
//                 id="isCvRequired"
//                 name="isCvRequired"
//                 type="checkbox"
//                 checked={formData.isCvRequired}
//                 onChange={handleInputChange}
//                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//               />
//               <label htmlFor="isCvRequired" className="ml-2 block text-sm text-gray-900">
//                 ¿Se requiere que los postulantes adjunten su CV?
//               </label>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-4">
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? 'Enviando...' : 'ENVIAR OFERTA'}
//               </button>
//             </div>
//           </form>
//         </div>

//         {/* Footer */}
//         <footer className="mt-12 text-center text-indigo-200 text-sm">
//           <p>© 2024 Bolsa UCN. Todos los derechos reservados.</p>
//         </footer>
//       </div>
//     </div>
//   );
// }