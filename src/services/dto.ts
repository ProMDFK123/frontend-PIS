// services/dto.ts
export type OfferBasicDto = {
  id: number;
  title: string;
  remuneration: number | null;
  deadlineDate?: string;
  publicationDate: string;
  ownerName?: string;
  offerType?: number | "Trabajo" | "Voluntariado";
};

export type BuySellBasicDto = {
  id: number;
  title: string;
  category: string;
  price: number;
  location: string;
  publicationDate: string;
  userName: string;        
};

export type ApiListResponse<T> = {
  message: string;
  data: T[];
};