/**
 * Hook personalizado para el formulario de publicaciones
 * Maneja: estado, validación, cambios de inputs, preview de imagen
 */

import { useState, useCallback } from 'react';
import { PublicationFormData, PublicationFormErrors } from '@/type/forms/publication.types';

const initialFormData: PublicationFormData = {
  title: '',
  description: '',
  category: '',
  startDate: '',
  endDate: '',
  remuneration: '',
  image: null,
};

export function usePublicationForm(defaultValues?: Partial<PublicationFormData>) {
  const [formData, setFormData] = useState<PublicationFormData>({
    ...initialFormData,
    ...defaultValues,
  });
  const [errors, setErrors] = useState<PublicationFormErrors>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  /**
   * Maneja cambios en campos de texto
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      
      // Limpiar error del campo
      if (errors[name as keyof PublicationFormData]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  /**
   * Maneja cambio de imagen y genera preview
   */
  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      
      if (!file) return;

      // Validar tamaño
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: 'La imagen no debe superar los 5MB',
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));

      // Generar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Limpiar error
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: '' }));
      }
    },
    [errors]
  );

  /**
   * Valida el formulario manualmente
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: PublicationFormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La fecha de inicio es requerida';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La fecha de término es requerida';
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) > new Date(formData.endDate)) {
        newErrors.endDate = 'La fecha de término debe ser posterior a la de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /**
   * Resetea el formulario
   */
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setImagePreview('');
  }, []);

  return {
    formData,
    errors,
    imagePreview,
    handleInputChange,
    handleImageChange,
    validateForm,
    resetForm,
    setErrors,
  };
}

