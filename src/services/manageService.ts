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
}

export const manageService = new ManageService();