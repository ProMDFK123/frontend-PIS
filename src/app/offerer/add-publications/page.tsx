/**
 * Componente principal del formulario de publicaciones
 * Orquesta: hooks, validación, UI
 */

'use client';

import { useRouter } from 'next/navigation';
import { usePublicationForm } from '@/hooks/forms/usePublicationForm';
import { useCreatePublication } from '@/hooks/api/useCreatePublication';
import { FormField } from '@/components/ui/FormField/FormField';
import { ImageUploadField } from '@/components/offerer/features/publications/ImageUploadField';
import { PUBLICATION_CATEGORIES } from '@/lib/utils/constants';

export default function PublicationForm() {
  const router = useRouter();
  const {
    formData,
    errors,
    imagePreview,
    handleInputChange,
    handleImageChange,
    validateForm,
  } = usePublicationForm();

  const createMutation = useCreatePublication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      startDate: formData.startDate,
      endDate: formData.endDate,
      remuneration: formData.remuneration || undefined,
      image: formData.image || undefined,
    });
  };

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
            Completa el siguiente formulario para publicar tu oferta laboral y encontrar al
            candidato ideal, o para anunciar el producto o artículo que desees ofrecer.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField
              label="Título para la oferta"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              error={errors.title}
              required
              placeholder="Ej: Desarrollador Full Stack"
            />

            <FormField
              label="Descripción"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleInputChange}
              error={errors.description}
              required
              rows={6}
              placeholder="Describe los detalles de la oferta..."
            />

            <FormField
              label="Categoría"
              name="category"
              type="select"
              value={formData.category}
              onChange={handleInputChange}
              error={errors.category}
              required
              options={PUBLICATION_CATEGORIES.map((cat) => ({
                value: cat,
                label: cat,
              }))}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Fecha de inicio"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                error={errors.startDate}
              />

              <FormField
                label="Fecha de término"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                error={errors.endDate}
              />
            </div>

            <FormField
              label="Remuneración"
              name="remuneration"
              value={formData.remuneration}
              onChange={handleInputChange}
              placeholder="Ej: $500.000 - $800.000 CLP"
            />

            <ImageUploadField
              name="image"
              label="Adjunta una imagen"
              fileName={formData.image?.name}
              preview={imagePreview}
              error={errors.image}
              onChange={handleImageChange}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? 'Enviando...' : 'ENVIAR OFERTA'}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-indigo-200 text-sm">
          <p>© 2024 Bolsa UCN. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}