export interface FormData {
  title: string;
  description: string;
  offerType: string; // '0' para Trabajo, '1' para Voluntariado
  endDate: string;
  deadlineDate: string;
  remuneration: string;
  location: string;
  requirements: string;
  contactInfo: string;
  isCvRequired: boolean;
}
export interface CreatePublicationData {
  Title: string;
  Description: string;
  EndDate?: string; // Fecha de término de la oferta/pasantía
  DeadlineDate?: string; // Fecha límite para postular
  Remuneration?: number;
  OfferType: number; // 0 para Trabajo, 1 para Voluntariado/Pasantía
  Location?: string;
  Requirements?: string;
  ContactInfo?: string;
  ImagesURL: string[];
  IsCvRequired: boolean;
}

export interface OffererPublication {
  id: number;
  title: string;
  description: string;
  offerType: number;
  publicationDate: string;
  deadlineDate: string;
  endDate?: string;
  remuneration?: number;
  location?: string;
  status: number;
}