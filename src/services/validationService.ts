import { BaseApiService } from "@/services/base-api-service";
import { ApiResponse } from "@/models/generics";
import type { 
    BuySellBasic, 
    PendingOffersForAdmin
} from "@/models/responses";

export class ValidationService extends BaseApiService {
  constructor() {
    super("/publications");
  }

  getPendingOffers() {
    return this.httpClient.get<
      ApiResponse<PendingOffersForAdmin[]> 
    >(`${this.baseURL}/offers/pending`);
  }

  getPendingBuySells() {
    return this.httpClient.get<
      ApiResponse<BuySellBasic[]>
    >(`${this.baseURL}/buysells/pending`);
  }
}

export const validationService = new ValidationService();