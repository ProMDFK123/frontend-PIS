export interface PendingOffersForAdminDto {
    title: string; 
    type: number; 
    id: number;
}

export interface OfferDetailForAdminDto {
    Id: number; // o string, dependiendo de la API
    Title: string; 
    Description: string;
    Images: string[];
    CompanyName: string; // o OwnerName
    PublicationDate: string;
    Type: number; // 0=Trabajo, 1=Voluntariado
    StatusValidation: "Pending" | "Published" | "Rejected"; 
    Remuneration: number | null; 
    Active: boolean;
    // ... otros campos
}

export interface BuySellDetailForAdminDto {
    Id: number;
    Title: string;
    Description: string;
    Images: string[];
    UserName: string;
    PublicationDate: string;
    Price: number;
    StatusValidation: "Pending" | "Published" | "Rejected"; 
    Active: boolean;
    // ... otros campos
}