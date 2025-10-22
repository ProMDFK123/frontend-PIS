// src/services/authService.ts

import api from "./Service";
import { type LoginRequestDto, type LoginResponseDto, type AdminRequestDto, type AdminResponseDto, type CompanyRequestDto, CompanyResponsetDto, IndividualRequestDto, IndividualResponseDto, StudentRequestDto, VerifyEmailDto, VerifyEmailResponseDto, ResendVerificationDto, ResendVerificationResponseDto } from "./dtos/authDto";
import { mapLoginResponse, mapAdminResponse, mapCompanyResponse, mapVerifyEmailResponse, mapResendVerificationResponse } from "./adapters/authAdapter";

// Login Serive
export async function loginUser(payload: LoginRequestDto) {
    const response = await api.post<LoginResponseDto>("/auth/login", payload);
    return mapLoginResponse(response.data);
}

// Register Services
// Admin
export async function RegisterAdmin(payload: AdminRequestDto){
    const response = await api.post<AdminResponseDto>(
        "/auth/register/admin",
        payload
    );
    return mapAdminResponse(response.data);
}
// Company
export async function registerCompany(payload: CompanyRequestDto){
    const response = await api.post<CompanyResponsetDto>(
        "/auth/register/company", payload);
    return mapCompanyResponse(response.data);
}
// Individual
export async function registerIndividual(payload: IndividualRequestDto){
    const response = await api.post<IndividualResponseDto>("/auth/register/individual",
        payload);
    return {message: response.data.message};
}
// Student
export async function registerStudent(payload: StudentRequestDto){
    const response = await api.post<IndividualResponseDto>("/auth/register/student",
        payload);
    return {message: response.data.message};
}

// Email Verification Services
// Verify-Email
export async function verifyEmail(payload: VerifyEmailDto){
    const response = await api.post<VerifyEmailResponseDto>("/auth/verify-email", 
        payload);
    return mapVerifyEmailResponse(response.data);
}
// Resend-Verification
export async function resendVerification(payload: ResendVerificationDto) {
    const response = await api.post<ResendVerificationResponseDto>(
        "/auth/resend-verification", payload);
    return mapResendVerificationResponse(response.data);
}