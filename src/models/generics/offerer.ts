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