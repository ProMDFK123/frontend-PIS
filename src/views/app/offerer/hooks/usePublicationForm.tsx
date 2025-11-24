import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { AxiosError } from 'axios';
import { offererPublicationService } from 'src/services/offererPublicationService';
import { buildLoginUrl } from 'src/lib/auth';
import { FormData } from 'src/models/generics';

export const usePublicationForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    offerType: '0',
    endDate: '',
    deadlineDate: '',
    remuneration: '',
    location: '',
    requirements: '',
    contactInfo: '',
    isCvRequired: false,
  });

  // 1. Verificación de Autenticación
  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      const currentPath = window.location.pathname;
      window.location.href = buildLoginUrl(currentPath, 'login_required');
    } else {
      setIsLoading(false);
    }
  }, []);

  // 2. Lógica de Remuneración
  useEffect(() => {
    if (formData.offerType === '1') {
      setFormData((prev) => ({ ...prev, remuneration: '0' }));
    }
  }, [formData.offerType]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));

    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.title.trim()) newErrors.title = 'El título es requerido';
    else if (formData.title.length < 5 || formData.title.length > 200) newErrors.title = 'El título debe tener entre 5 y 200 caracteres';

    if (!formData.description.trim()) newErrors.description = 'La descripción es requerida';
    else if (formData.description.length < 10 || formData.description.length > 2000) newErrors.description = 'La descripción debe tener entre 10 y 2000 caracteres';

    if (!formData.offerType) newErrors.offerType = 'Debes seleccionar un tipo de oferta';

    if (!formData.deadlineDate) newErrors.deadlineDate = 'La fecha límite es requerida';
    else if (new Date(formData.deadlineDate) < today) newErrors.deadlineDate = 'La fecha límite no puede ser pasada';

    if (!formData.endDate) newErrors.endDate = 'La fecha de término es requerida';
    else if (new Date(formData.endDate) < today) newErrors.endDate = 'La fecha de término no puede ser pasada';

    if (!newErrors.endDate && !newErrors.deadlineDate) {
      if (new Date(formData.endDate) <= new Date(formData.deadlineDate)) {
        newErrors.endDate = 'La fecha de término debe ser posterior a la fecha límite';
      }
    }

    if (formData.offerType === '0' && !formData.remuneration) {
      newErrors.remuneration = 'La remuneración es requerida para ofertas de trabajo';
    } else if (formData.remuneration) {
      const val = parseFloat(formData.remuneration);
      if (val < 0) newErrors.remuneration = 'No puede ser negativa';
      if (formData.offerType === '1' && val !== 0) newErrors.remuneration = 'Voluntariado no puede tener remuneración';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const remunerationValue = formData.offerType === '1' ? 0 : (formData.remuneration ? parseFloat(formData.remuneration) : 0);

      await offererPublicationService.create({
        Title: formData.title,
        Description: formData.description,
        OfferType: parseInt(formData.offerType, 10),
        EndDate: formData.endDate || undefined,
        DeadlineDate: formData.deadlineDate || undefined,
        Remuneration: remunerationValue,
        Location: formData.location || undefined,
        Requirements: formData.requirements || undefined,
        ContactInfo: formData.contactInfo || undefined,
        IsCvRequired: formData.isCvRequired,
        ImagesURL: [],
      });

      alert('¡Publicación creada exitosamente!');
      router.push('/offerer/your-publications?success=true');
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.errors) {
         const serverErrors: any = {};
         const errorsData = error.response.data.errors;
         Object.keys(errorsData).forEach(key => {
            serverErrors[key.toLowerCase()] = errorsData[key][0];
         });
         setErrors(serverErrors);
      } else {
        const msg = error instanceof AxiosError ? (error.response?.data?.message || 'Error al conectar') : 'Error inesperado';
        alert(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleSubmit
  };
};