// src/services/authService.ts

import api from "./Service";
import type { LoginRequestDto, LoginResponseDto } from "./dtos/authDto";
import { mapLoginResponse } from "./adapters/authAdapter";

export async function loginUser(payload: LoginRequestDto) {
    const response = await api.post<LoginResponseDto>("/auth/login", payload);
    return mapLoginResponse(response.data);
}