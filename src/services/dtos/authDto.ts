// src/services/dtos/authDto.ts

export interface LoginRequestDto {
    Email: string;
    Password: string;
    RememeberMe: boolean;
}

export interface LoginResponseDto {
    message: string;
    data?: string; // Este es el token.
}