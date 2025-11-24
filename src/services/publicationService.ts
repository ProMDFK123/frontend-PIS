import api from "./Service";
import { BaseApiService } from "./base-api-service";
import { ApiResponse } from "@/models/generics";


/** 
 * export interface CreatePublicationData {
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

}**/




export const publicationService = {
  async create(data: CreatePublicationData): Promise<PublicationResponse> {
    // Enviamos el objeto 'data' directamente como JSON.
    // La instancia 'api' de Service.tsx ya tiene "Content-Type": "application/json" por defecto.
    const response = await api.post<PublicationResponse>("/publications/offers", data);

    return response.data;
  },

  async getOffererPublications() {
    // Realiza una petición GET al endpoint que devuelve las publicaciones del oferente autenticado.
    // Se espera que la API devuelva un objeto con una propiedad "data" que contiene el array de publicaciones.
    return api.get<{ data: OffererPublication[] }>("/publications/my-published");
  },
};
