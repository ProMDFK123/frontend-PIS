// src/services/authService.ts

import api from "./Service";
import { type LoginRequestDto, type LoginResponseDto, type AdminRequestDto, type AdminResponseDto, type CompanyRequestDto, CompanyResponsetDto, IndividualRequestDto, IndividualResponseDto, StudentRequestDto, VerifyEmailDto, VerifyEmailResponseDto, ResendVerificationDto, ResendVerificationResponseDto, ResetPasswordDto, ResetPasswordResponseDto, VerifyResetCodeDto, VerifyResetCodeResponseDto } from "./dtos/authDto";
import { mapLoginResponse, mapAdminResponse, mapCompanyResponse, mapVerifyEmailResponse, mapResendVerificationResponse, mapResetVerificationResponse } from "./adapters/authAdapter";

// Login Service
export async function loginUser(payload: LoginRequestDto | any) {
  // normaliza a camelCase para la API
  const body = {
    email: payload.Email ?? payload.email,
    password: payload.Password ?? payload.password,
    rememberMe: payload.RememeberMe ?? payload.RememberMe ?? payload.rememberMe ?? false,
  };

  // usa el endpoint del Swagger
  const response = await api.post<LoginResponseDto>("/api/Auth/login", body);
  return mapLoginResponse(response.data);
}

// Register Services
export async function RegisterAdmin(payload: AdminRequestDto){
  const response = await api.post<AdminResponseDto>("/api/auth/register/admin", payload);
  return mapAdminResponse(response.data);
}
export async function registerCompany(payload: CompanyRequestDto){
  const response = await api.post<CompanyResponsetDto>("/api/auth/register/company", payload);
  return mapCompanyResponse(response.data);
}
export async function registerIndividual(payload: IndividualRequestDto){
  const response = await api.post<IndividualResponseDto>("/api/auth/register/individual", payload);
  return {message: response.data.message};
}
export async function registerStudent(payload: StudentRequestDto){
  const response = await api.post<IndividualResponseDto>("/api/auth/register/student", payload);
  return {message: response.data.message};
}

// Email Verification
export async function verifyEmail(payload: VerifyEmailDto){
  const response = await api.post<VerifyEmailResponseDto>("/api/auth/verify-email", payload);
  return mapVerifyEmailResponse(response.data);
}
export async function resendVerification(payload: ResendVerificationDto) {
  const response = await api.post<ResendVerificationResponseDto>("/api/auth/resend-verification", payload);
  return mapResendVerificationResponse(response.data);
}

// Reset Password
export async function sendCode(payload: ResetPasswordDto){
  const response = await api.post<ResetPasswordResponseDto>("/api/auth/reset-password", payload);
  return mapResetVerificationResponse(response.data);
}
export async function verifyResetCode(payload: VerifyResetCodeDto){
  const response = await api.post<VerifyResetCodeResponseDto>("/api/auth/reset-code/verify", payload);
  return mapResetVerificationResponse(response.data);
}
export async function resendCode(payload: ResetPasswordDto){
  const response = await api.post<ResetPasswordResponseDto>("/api/auth/reset-password", payload);
  return mapResetVerificationResponse(response.data);
}
