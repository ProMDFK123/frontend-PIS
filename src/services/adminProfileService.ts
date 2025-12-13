import api from "./Service";

// DTO
export interface UserProfileForAdminDTO {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    rut: string;
    rating?: number | null;
    profilePictureUrl?: string | null;
    aboutMe?: string | null;
    userType: string;
    banned: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt?: Date | null;

    // Student fields
    cvUrl?: string | null;
    disability?: string | null;

    // Admin fields
    superAdmin?: boolean | null;
}

// Mapper
export function mapUserProfileForAdmin(dto: any): UserProfileForAdminDTO {
    return {
        id: dto.id,
        username: dto.username,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phoneNumber: dto.phoneNumber,
        rut: dto.rut,
        rating: dto.rating ?? null,
        profilePictureUrl: dto.profilePictureUrl ?? null,
        aboutMe: dto.aboutMe ?? null,
        userType: dto.userType,
        banned: dto.banned,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        lastLoginAt: dto.lastLoginAt ?? null,
        cvUrl: dto.cvUrl ?? null,
        disability: dto.disability ?? null,
        superAdmin: dto.superAdmin ?? null,  
    };
}

// Service
export class AdminUserService {
    static async getUserProfileById(userId: string): Promise<UserProfileForAdminDTO> {
        const response = await api.get(`/admin/users/${userId}`);
        return mapUserProfileForAdmin(response.data.data);
    }
}