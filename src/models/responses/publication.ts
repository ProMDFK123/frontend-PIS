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