import { BaseApiService } from "@/services/base-api-service";
import { ApiResponse } from "@/models/generics";
import type { BuySellBasic, PendingOffersForAdmin } from "src/models/responses";

export class ValidationService extends BaseApiService {
  constructor() {
    super("/publications");
  }

  getPendingOffers() {
    return this.httpClient.get<ApiResponse<PendingOffersForAdmin[]>>(
      `${this.baseURL}/offers/pending`
    );
  }

  getPendingBuySells() {
    return this.httpClient.get<ApiResponse<BuySellBasic[]>>(
      `${this.baseURL}/buysells/pending`
    );
  }

  getPublicationDetail(typePath: "buysells" | "offers", entityId: string) {
    const endpoint = `${this.baseURL}/${typePath}/${entityId}/validation`;
    return this.httpClient.get<any>(endpoint);
  }

  handleValidationAction(
    typePath: "buysells" | "offers",
    entityId: string,
    action: "publish" | "reject"
  ) {
    const endpoint = `${this.baseURL}/${typePath}/${entityId}/${action}`;
    return this.httpClient.patch<ApiResponse<string>>(endpoint, {});
  }
}

export const validationService = new ValidationService();
