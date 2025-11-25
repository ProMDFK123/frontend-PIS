export interface PendingOffersForAdmin {
    title: string; 
    type: number; 
    id: number;
}
// Interfaz de entrada para todas las interfaces de salida que usen ofertas
export interface OfferDetailForAdmin {
    id: number;
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
// Interfaz de entrada para todas las interfaces de salida que usen compras/ventas
export interface BuySellDetailForAdmin {
    id: number;
    Title: string;
    Description: string;
    Images: string[];
    UserName: string;
    PublicationDate: string;
    Price: number;
    Type: number;
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

export interface PublishedItem {
    title: string;
    type: number;
    name: string;
    publicationDate: string;
    active: boolean;
    id: number;
}

export type PublicationType = "Trabajo" | "Voluntariado" | "CompraVenta"; 
export type ValidationStatus = "Pending" | "Published" | "Rejected";

export interface AdminDetail {
    id: string; 
    title: string;
    description: string;
    images: string[];
    companyName: string; 
    publicationDate: string;
    type: PublicationType; 
    active: boolean; 
    statusValidation: ValidationStatus; 
    price?: number;
    remuneration?: number;
    deadlineDate?: string; 
    endDate?: string;
}

export interface UseAdminDetailResult {
    detail: AdminDetail | null;
    loading: boolean;
    error: string | null;
    isMutating: boolean; 
    handleAction: (action: 'publish' | 'reject') => void;
    handleRetry: () => void;
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