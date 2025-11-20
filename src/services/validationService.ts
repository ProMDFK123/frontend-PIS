import { BaseApiService } from "public/src/services/base-api-service";
import { ApiResponse } from "public/src/models/generics";
import type { 
    BuySellBasic, 
    PendingOffersForAdmin
} from "public/src/models/responses";

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