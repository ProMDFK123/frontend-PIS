import { BaseApiService } from "./base-api-service";
import { ApiResponse } from "@/models/generics";
import type { MyPublishedPublication } from "src/models/responses";

export class AdminPublicationService extends BaseApiService {
  constructor() {
    super("/publications"); // Base URL
  }

  /**
   * Obtener todas las publicaciones que el admin puede ver
   * Endpoint: /api/publications/admin/my-published
   */
  getMyPublishedPublications() {
    return this.httpClient.get<ApiResponse<MyPublishedPublication[]>>(
      `${this.baseURL}/admin/my-published`
    );
  }

  /**
   * Obtener detalles de una publicación específica por id
   */
  getPublicationById(id: number) {
    return this.httpClient.get<ApiResponse<MyPublishedPublication>>(
      `${this.baseURL}/admin/publication/${id}`
    );
  }
}

export const adminPublicationService = new AdminPublicationService();