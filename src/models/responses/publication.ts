export interface PendingOffersForAdmin {
    title: string; 
    type: number; 
    id: number;
}

export interface OfferDetailForAdmin {
    Id: number;
    Title: string; 
    Description: string;
    Images: string[];
    CompanyName: string;
    PublicationDate: string;
    Type: number;
    StatusValidation: "Pending" | "Published" | "Rejected"; 
    Remuneration: number; 
    Active: boolean;
}

export interface BuySellDetailForAdmin {
    Id: number;
    Title: string;
    Description: string;
    Images: string[];
    UserName: string;
    PublicationDate: string;
    Price: number;
    StatusValidation: "Pending" | "Published" | "Rejected"; 
    Active: boolean;
}

export type BuySellBasic = {
  id: number;
  title: string;
  category: string;
  price: number;
  location: string;
  publicationDate: string;
  userName: string;        
};

export type AdminItemType = "Trabajo" | "CompraVenta"; 

export type ValidationType = "Todos" | AdminItemType;

export interface OfferForAdmin {
    id: string;
    title: string;
    type: AdminItemType; 
}

export interface ValidationItemFull {
    id: string; 
    item: OfferForAdmin;
}

  export interface PublicationResponse {
  message: string;
  data: string; // e.g., "Oferta ID: 14
  }

export interface CreatePublicationData {
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