/**
 * Tipos del formulario de publicaciones
 * Define las interfaces para el estado del formulario y errores
 */

export interface PublicationFormData {
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  remuneration: string;
  image: File | null;
}

export type PublicationFormErrors = Partial<Record<keyof PublicationFormData, string>>;

export interface PublicationFormProps {
  initialData?: Partial<PublicationFormData>;
  onSuccess?: () => void;
  onError?: (error: Error) => void
}