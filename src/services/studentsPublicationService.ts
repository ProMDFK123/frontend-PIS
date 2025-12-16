// src/services/studentPublicationService.ts

import api from "./Service";
import { BaseApiService } from "./base-api-service";
import { ApiResponse } from "@/models/generics";

import type {
  CreatePublicationData,
  CreateBuySellData,
  MyPublishedPublication,
  ApplicantResponse,
  MyBuySell,
  OfferDetail,
} from "src/models/responses";
import type { OffererPublication } from "src/models/generics";

/**
 * Servicio para manejar las operaciones de publicaciones propias para el rol Estudiante.
 * Utiliza los endpoints /Students/ para listar, ver detalles y cerrar publicaciones.
 */
export class StudentPublicationService extends BaseApiService {
  constructor() {
    super("/publications");
  }

  // --- Rutas de Creación (Compartidas con el backend) ---
  create(data: CreatePublicationData) {
    return this.httpClient.post<ApiResponse<OffererPublication>>(
      `${this.baseURL}/offers`,
      data
    );
  }
  createBuySell(data: CreateBuySellData) {
    return this.httpClient.post<ApiResponse<OffererPublication>>(
      `${this.baseURL}/buysells`,
      data
    );
  }

  // --- Rutas de Listado (Específicas de Estudiante) ---

  getMyPublishedPublications() {
    // Endpoint: /api/publications/Students/my-published
    return this.httpClient.get<ApiResponse<MyPublishedPublication[]>>(
      `${this.baseURL}/students/my-published`
    );
  }

  getMyRejectedPublications() {
    // Endpoint: /api/publications/Students/my-rejected
    return this.httpClient.get<ApiResponse<MyPublishedPublication[]>>(
      `${this.baseURL}/students/my-rejected`
    );
  }
  getPMyPendingPublications() {
    // Endpoint: /api/publications/Students/my-pending
    return this.httpClient.get<ApiResponse<MyPublishedPublication[]>>(
      `${this.baseURL}/students/my-pending`
    );
  }

  // --- Rutas de Detalle (Específicas de Estudiante) ---

  // Endpoint: /api/publications/Students/my-offer/{id}
  getMyPublicationById(id: number) {
    return this.httpClient.get<ApiResponse<OfferDetail>>(
      `${this.baseURL}/students/offer/${id}`
    );
  }
  // Endpoint: /api/publications/Students/my-buysell/{id}
  getMyBullSellById(id: number) {
    return this.httpClient.get<ApiResponse<MyBuySell>>(
      `${this.baseURL}/students/buysell/${id}`
    );
  }

  // --- Métodos de Aplicantes y Cierre (Específicas de Estudiante) ---

  /**
   * Método: GetOfferApplicantsForStudent
   * Endpoint: /api/publications/Students/my-offer/{offerId}/applicants
   * Descripción: Lista los postulantes de una oferta específica (dueño, rol estudiante).
   */
  getOfferApplicantsForStudent(offerId: number | string) {
    return this.httpClient.get<ApiResponse<any[]>>(
      `${this.baseURL}/students/my-offer/${offerId}/applicants`
    );
  }
  /**
   * Método: StudentGetApplicantDetail
   * Endpoint: /api/publications/Students/my-offer/{offerId}/applicants/{studentId}
   * Descripción: Obtiene el detalle de un postulante específico.
   */
  getApplicantDetail(offerId: number | string, studentId: number | string) {
    return this.httpClient.get<ApiResponse<any[]>>(
      `${this.baseURL}/students/my-offer/${offerId}/applicants/${studentId}`
    );
  }
  
  /**
   * Método: AcceptApplication
   * Endpoint: /api/publications/Students/applications/{applicationId}/accept
   * Descripción: Acepta una postulación específica.
   */
  acceptApplication(applicationId: number | string) {
    return this.httpClient.patch<ApiResponse<any[]>>(
      `${this.baseURL}/students/applications/${applicationId}/accept`,
      {} // Body vacío requerido para la firma de PATCH
    );
  }
  /**
   * Rechaza una postulación específica
   * Endpoint: PATCH /api/publications/Student/applications/{applicationId}/reject
   * Nota: El backend usa 'Student' (singular) aquí.
   */
  rejectApplication(applicationId: number | string) {
    return this.httpClient.patch<ApiResponse<any>>(
      `${this.baseURL}/students/applications/${applicationId}/reject`, 
      {} // IMPORTANTE: Body vacío requerido para la firma de PATCH
    );
  }

  /**
   * Cierra una publicación propia (Oferta o Compra/Venta).
   * @param id ID de la publicación.
   * @param type Tipo de publicación (0: Oferta/Trabajo, 1: Compra/Venta, 2: Voluntariado).
   */
  closePublication(id: number, type: number){
    let endpoint: string;

    // Discriminar el endpoint según el tipo de publicación
    if (type === 0 || type === 2) {
        // Oferta de Trabajo (0) o Voluntariado (2) -> offer
        // Endpoint: /api/publications/Students/my-offer/{offerId}/close
        endpoint = `${this.baseURL}/students/my-offer/${id}/close`;
    }
    else if (type === 1) {
        // Compra/Venta (1) -> buysell
        // Endpoint: /api/publications/Students/my-buysell/{buySellId}/close
        endpoint = `${this.baseURL}/students/my-buysell/${id}/close`;
    } else {
        // Manejo de tipo desconocido o inválido
        throw new Error("Tipo de publicación no válido para la acción de cierre.");
    }

    // Realiza la petición patch al endpoint específico
    return this.httpClient.patch<ApiResponse<any>>(endpoint, {}); 
  };
  
  // --- Métodos Compartidos ---

  /**
   * Apela una publicación rechazada enviando una justificación
   * Endpoint: POST /api/publications/{id}/appeal
   */
  appealPublication(id: number | string, justification: string) {
    // Este endpoint es genérico en el backend (no tiene prefijo de rol)
    const body = { justification: justification };

    return this.httpClient.post<ApiResponse<any>>(
      `${this.baseURL}/${id}/appeal`,
      body
    );
  }

  /**
   * Sube una imagen y retorna la URL resultante.
   * Endpoint asumido: /publications/upload (Genérico/Compartido)
   */
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file); // 'file' suele ser el nombre estándar, verifica tu backend

    return this.httpClient.post<ApiResponse<string>>(
      `${this.baseURL}/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  }


}

export const studentPublicationService = new StudentPublicationService();