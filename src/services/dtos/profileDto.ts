export interface UserProfileDto {
    id: number;
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
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string | null;

    // Student
    cvUrl?: string | null;
    disability?: string | null;

    // Admin
    superAdmin?: boolean | null;
}