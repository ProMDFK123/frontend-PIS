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
    Remuneration: number; 
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

export interface UsersForAdminDto {
        users: UserForAdminDto[]
        totalCount: number
        totalPages: number
        currentPage: number
        pageSize: number
}

export interface UserForAdminDto {
    id: number;
    userName: string;
    email: string;
    rut: string;
    userType: string;
    rating: number | null;
    banned: boolean;
}

export interface UserProfileForAdminDto {
    id: number;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    rut: string;
    rating: number | null;
    profilePictureUrl: string | null;
    aboutMe: string | null;
    userType: string;
    banned: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
    // Student specific fields
    cvUrl: string | null;
    disability: string | null;
    // Admin specific fields
    superAdmin: boolean | null;
}