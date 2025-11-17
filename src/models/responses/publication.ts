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

export interface OfferForAdmin {
    id: string;
    title: string;
    type: AdminItemType; 
}

export interface ValidationItemFull {
    id: string; 
    item: OfferForAdmin;
}