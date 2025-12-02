export interface PendingOffersForAdmin {
    title: string;
    offerType: number;
    id: number;
}
// Interfaz de entrada para todas las interfaces de salida que usen ofertas
export interface OfferDetailForAdmin {
    id: number;
    title: string; 
    description: string;
    images: string[];
    companyName: string;
    publicationDate: string;
    offerType: number;
    statusValidation: "Pending" | "Published" | "Rejected"; 
    remuneration: number; 
    activa: boolean;
}
// Interfaz de entrada para todas las interfaces de salida que usen compras/ventas
export interface BuySellDetailForAdmin {
    id: number;
    title: string;
    description: string;
    images: string[];
    userName: string;
    publicationDate: string;
    price: number;
    type: number;
    statusValidation: "Pending" | "Published" | "Rejected"; 
    activa: boolean;
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

export type AdminItemType = OfferSubType | "Compra/Venta";

export type ValidationType = "Todos" | AdminItemType;

export interface BuySellForAdmin {
    id: string;
    title: string;
    type: "Compra/Venta";
}
export interface OfferForAdmin {
    id: string;
    title: string;
    offerType: OfferSubType;
}
// solo se usa para que se vea bien el tipo en la pagina
export interface AdminItemBase {
    id: string;
    title: string;
    type: "Oferta de Trabajo" | "Voluntariado" | "Compra/Venta"; 
}
export type AdminItem = OfferForAdmin | BuySellForAdmin;

export type OfferSubType = "Oferta de Trabajo" | "Voluntariado";

export interface OfferTypeForAdmin {
    id: string;
    title: string;
    offerType: OfferSubType; 
}

export interface ValidationItemFull {
    id: string; 
    item: AdminItem;
}

export interface PublishedItem {
    title: string;
    offerType: string;
    name: string;
    publicationDate: string;
    activa: boolean;
    id: number;
}

export type PublicationType = "Trabajo" | "Voluntariado" | "Compra/Venta"; 
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

export interface UseAdminDetailValidateResult {
    detail: AdminDetail | null;
    loading: boolean;
    error: string | null;
    isMutating: boolean; 
    handleAction: (action: 'publish' | 'reject') => void;
    handleRetry: () => void;
}

export interface UseAdminDetailManageResult {
    detail: AdminDetail | null;
    loading: boolean;
    error: string | null;
    isMutating: boolean; 
    handleAction: (action: 'close_publication') => void;
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

    //  mypublished PublicationsDTO
export interface MyPublishedPublication {
    idPublication: number;  // Antes tenías IdPublication o Id
    userId: number;
    title: string;          // Antes Title
    types: number;          // Viene como número (0), no como string
    description: string;    // Antes Description
    publicationDate: string;
    images: string[];
    isActive: boolean;
    statusValidation: number; // Viene como número (0)
}

    //  mypublished PublicationsDTO
export interface MyPublishedPublication {
    idPublication: number;  // Antes tenías IdPublication o Id
    userId: number;
    title: string;          // Antes Title
    types: number;          // Viene como número (0), no como string
    description: string;    // Antes Description
    publicationDate: string;
    images: string[];
    isActive: boolean;
    statusValidation: number; // Viene como número (0)
}

// interfaz para ver los postulantes de una publicación
export interface ViewAppplicantsForAdmin {
  id: number;
  applicant: string;
  status: "Pending" | "Published" | "Rejected" | string;
}