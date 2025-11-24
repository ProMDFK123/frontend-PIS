'use client';

// 1. Corregimos el nombre del archivo y del componente a "Spinner" (doble n)
// 2. Asegúrate de que este archivo esté en src/views/CreatePublication/index.tsx
import LoadingSpinner from './components/loading-spinner';
import { useRouter } from 'next/navigation';
import { usePublicationForm } from './hooks/usePublicationForm';

export default function PublicationFormView() {
  const router = useRouter();

  // Extraemos la lógica del hook local
  const { 
    formData, 
    errors, 
    isLoading, 
    isSubmitting, 
    handleInputChange, 
    handleSubmit 
  } = usePublicationForm();

  // Estado de carga
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()} 
            className="text-white hover:text-indigo-200 transition-colors mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Ingresa tu publicación</h1>
          <p className="text-indigo-200">
            Completa el siguiente formulario para publicar tu oferta laboral.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
              <input
                type="text" id="title" name="title"
                value={formData.title} onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                placeholder="Ej: Desarrollador Full Stack"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea
                id="description" name="description" rows={6}
                value={formData.description} onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none`}
                placeholder="Detalles de la oferta..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Tipo de Oferta */}
            <div>
              <label htmlFor="offerType" className="block text-sm font-medium text-gray-700 mb-2">Tipo de Oferta *</label>
              <select
                id="offerType" name="offerType"
                value={formData.offerType} onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${errors.offerType ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 bg-white outline-none`}
              >
                <option value="0">Trabajo (Remunerado)</option>
                <option value="1">Pasantía / Voluntariado</option>
              </select>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="deadlineDate" className="block text-sm font-medium text-gray-700 mb-2">Cierre Postulaciones *</label>
                <input
                  type="date" id="deadlineDate" name="deadlineDate"
                  value={formData.deadlineDate} onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.deadlineDate ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                />
                {errors.deadlineDate && <p className="mt-1 text-sm text-red-600">{errors.deadlineDate}</p>}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">Término de Oferta *</label>
                <input
                  type="date" id="endDate" name="endDate"
                  value={formData.endDate} onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 outline-none`}
                />
                {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Remuneración */}
              <div>
                <label htmlFor="remuneration" className="block text-sm font-medium text-gray-700 mb-2">Remuneración (CLP)</label>
                <input
                  type="number" id="remuneration" name="remuneration"
                  value={formData.remuneration} onChange={handleInputChange}
                  disabled={formData.offerType === '1'}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.remuneration ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-indigo-500 outline-none ${formData.offerType === '1' ? 'bg-gray-100' : ''}`}
                  placeholder="Ej: 500000"
                />
                {errors.remuneration && <p className="mt-1 text-sm text-red-600">{errors.remuneration}</p>}
              </div>
              {/* Ubicación */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input
                  type="text" id="location" name="location"
                  value={formData.location} onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Ej: Coquimbo"
                />
              </div>
            </div>

            {/* Requisitos y Contacto */}
            <div>
               <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">Requisitos</label>
               <textarea
                 id="requirements" name="requirements" rows={3}
                 value={formData.requirements} onChange={handleInputChange}
                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
               />
            </div>
            <div>
               <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">Contacto</label>
               <input
                 type="text" id="contactInfo" name="contactInfo"
                 value={formData.contactInfo} onChange={handleInputChange}
                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>

            {/* Requiere CV */}
            <div className="flex items-center">
              <input
                id="isCvRequired" name="isCvRequired" type="checkbox"
                checked={formData.isCvRequired} onChange={handleInputChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isCvRequired" className="ml-2 block text-sm text-gray-900">¿Requiere CV?</label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit" disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'ENVIAR OFERTA'}
              </button>
            </div>

          </form>
        </div>
        
        <footer className="mt-12 text-center text-indigo-200 text-sm">
          <p>© 2024 Bolsa UCN. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}