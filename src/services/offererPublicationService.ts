import api from "./Service";
import { BaseApiService } from "./base-api-service";
import { ApiResponse } from "@/models/generics";

import type { CreatePublicationData, MyPublishedPublication } from "src/models/responses";
import type { OffererPublication,
  OfferDetail
} from "src/models/generics";


export class OffererPublicationService extends BaseApiService {
  constructor() {
    super("/publications");
  }

  create(data: CreatePublicationData) {
    return this.httpClient.post<ApiResponse<OffererPublication>>(
      `${this.baseURL}/offers`, 
      data
    );
  }
    //  mypublished PublicationsDTO
    //     int IdPublication
    //     int UserId 
    //     string Title 
    //     Types types 
    //     string Description
    //     DateTime PublicationDate
    //     ICollection<Image> Images
    //     bool IsActive
    //     StatusValidation statusValidation

  getMyPublishedPublications() {
    return this.httpClient.get<ApiResponse<MyPublishedPublication[]>>(
      `${this.baseURL}/offerent/my-published`);
  }

  
    getMyRejectedPublications() {
    return this.httpClient.get<ApiResponse<MyPublishedPublication[]>>(
      `${this.baseURL}/offerent/my-rejected`);
  }
  getPMyPendingPublications() {
    return this.httpClient.get<ApiResponse<MyPublishedPublication[]>>(
      `${this.baseURL}/offerent/my-pending`);
  }
  
   //Endpoint: /api/publications/offerent/offer/{id}
   getMyPublicationById(id: number) {
    return this.httpClient.get<
      ApiResponse<OfferDetail>
    >(`${this.baseURL}/offerent/offer/${id}`);

    // OfferDetailDto
    // public int Id 
    //  string Title 
    //  string Description
    //  string CompanyName 
    //  string? Location 
    //  DateTime PostDate 
    //  DateTime EndDate 
    //  int Remuneration 
    //  string OfferType 


  
  }
 //Endpoint: /api/publications/offerent/buysell/{id}

   getMyBullSellById(id: number){
    return this.httpClient.get<
      ApiResponse<OffererPublication>
    >(`${this.baseURL}/offerent/buysell/${id}`);

  } 
}
export const offererPublicationService = new OffererPublicationService();

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

// export const publicationService = {
//   async create(data: CreatePublicationData): Promise<PublicationResponse> {
//     // Enviamos el objeto 'data' directamente como JSON.
//     // La instancia 'api' de Service.tsx ya tiene "Content-Type": "application/json" por defecto.
//     const response = await api.post<PublicationResponse>("/publications/offers", data);

//     return response.data;
//   },

//   async getOffererPublications() {
//     // Realiza una petición GET al endpoint que devuelve las publicaciones del oferente autenticado.
//     // Se espera que la API devuelva un objeto con una propiedad "data" que contiene el array de publicaciones.
//     return api.get<{ data: OffererPublication[] }>("/publications/my-published");
//   },
// };
