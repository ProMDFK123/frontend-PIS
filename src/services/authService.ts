// src/services/authService.ts

import api from "@/services/Service";
import { type LoginRequestDto, type LoginResponseDto, type AdminRequestDto, type AdminResponseDto, type CompanyRequestDto, CompanyResponsetDto, IndividualRequestDto, IndividualResponseDto, StudentRequestDto, VerifyEmailDto, VerifyEmailResponseDto, ResendVerificationDto, ResendVerificationResponseDto, ResetPasswordDto, ResetPasswordResponseDto, VerifyResetCodeDto, VerifyResetCodeResponseDto, StudentResponseDto } from "./dtos/authDto";
import { mapLoginResponse, mapAdminResponse, mapCompanyResponse, mapVerifyEmailResponse, mapResetPaswordResponse, mapIndividualResponse, StudentAdapter, mapStudentResponse, mapResetVerificationResponse, mapResendVerificationResponse } from "./adapters/authAdapter";

// Login Service
export async function loginUser(payload: LoginRequestDto | any) {
  const body = {
    email: payload.Email ?? payload.email,
    password: payload.Password ?? payload.password,
    rememberMe: payload.RememeberMe ?? payload.RememberMe ?? payload.rememberMe ?? false,
  };

  const response = await api.post<LoginResponseDto>("/auth/login", body);
  return mapLoginResponse(response.data);
}

// Register Services
export async function RegisterAdmin(payload: AdminRequestDto | any){
  const response = await api.post<AdminResponseDto>("/auth/register/admin", payload);
  return mapAdminResponse(response.data);
}
export async function registerCompany(payload: CompanyRequestDto | any){
  const response = await api.post<CompanyResponsetDto>("/auth/register/company", payload);
  return mapCompanyResponse(response.data);
}
export async function registerIndividual(payload: IndividualRequestDto | any) {
  const response = await api.post("/auth/register/individual", payload);
  return mapIndividualResponse(response.data);
}
export async function registerStudent(payload: StudentRequestDto) {
  try {
    const response = await api.post<StudentResponseDto>(
      "/auth/register/student",
      payload
    );
    return mapStudentResponse(response.data);
  } catch (error: any) {
    console.error("Error al registrar estudiante:", error.response?.data?.details);
    throw error;
  }
}

// Email Verification
export async function verifyEmail(payload: VerifyEmailDto | any){
  const response = await api.post<VerifyEmailResponseDto>("/auth/verify-email", payload);
  return mapVerifyEmailResponse(response.data);
}
export async function resendVerification() {
  const response = await api.post<ResendVerificationResponseDto>(
    "/auth/resend-verification"
  );
  return mapResendVerificationResponse(response.data);
}

// Reset Password
export async function sendCode(payload: ResetPasswordDto){
  const response = await api.post<ResetPasswordResponseDto>("/auth/reset-password", payload);
  return mapResetVerificationResponse(response.data);
}
export async function verifyResetCode(payload: VerifyResetCodeDto){
  const response = await api.post<VerifyResetCodeResponseDto>("/auth/reset-code/verify", payload);
  return mapResetVerificationResponse(response.data);
}
export async function resendCode(payload: ResetPasswordDto){
  const response = await api.post<ResetPasswordResponseDto>("/auth/reset-password", payload);
  return mapResetVerificationResponse(response.data);
}
