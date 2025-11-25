import { BaseApiService } from "@/services/base-api-service";
import { ApiResponse } from "@/models/generics";
import type { OfferDetailForAdmin, BuySellDetailForAdmin } from "src/models/responses";

export class ManageService extends BaseApiService {
  constructor() {
    super("/publications");
  }
  // lamentablemente por como esta hecha la logica del hook se tiene q utilizar el llamado con los detail
  getPublishedOffers() {
    return this.httpClient.get<ApiResponse<OfferDetailForAdmin[]>>(
      `${this.baseURL}/offers/published`
    );
  }

  getPublishedBuySells() {
    return this.httpClient.get<ApiResponse<BuySellDetailForAdmin[]>>(
        `${this.baseURL}/buysells/published`
    );
  }

  getPublicationManagementDetail(typePath: "buysells" | "offers", entityId: string) {
    const endpoint = `${this.baseURL}/${typePath}/${entityId}/details`;
    return this.httpClient.get<any>(endpoint);
  }

  closePublication(typePath: "buysells" | "offers", publicationId: string) {
    const endpoint = `${this.baseURL}/${typePath}/${publicationId}/close`;
    return this.httpClient.patch<ApiResponse<string>>(endpoint, {});
  }

  getPostulants(publicationId: string) {
    const endpoint = `${this.baseURL}/offers/${publicationId}/applicants`;
    return this.httpClient.get<ApiResponse<any[]>>(endpoint); 
  }
}

export const manageService = new ManageService();