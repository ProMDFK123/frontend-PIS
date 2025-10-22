// src/services/adapters/authAdapter.ts

import { LoginResponseDto } from "../dtos/authDto";

export function mapLoginResponse(dto: LoginResponseDto) {
    return {
        message: dto.message,
        token: dto.data ?? null,
    };
}