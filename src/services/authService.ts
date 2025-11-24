// src/services/authService.ts

import api from "@/services/Service";
import { type LoginRequestDto, type LoginResponseDto, type AdminRequestDto, type AdminResponseDto, type CompanyRequestDto, CompanyResponsetDto, IndividualRequestDto, IndividualResponseDto, StudentRequestDto, VerifyEmailDto, VerifyEmailResponseDto, ResendVerificationDto, ResendVerificationResponseDto, ResetPasswordDto, ResetPasswordResponseDto, VerifyResetCodeDto, VerifyResetCodeResponseDto, StudentResponseDto } from "./dtos/authDto";
import { mapLoginResponse, mapAdminResponse, mapCompanyResponse, mapVerifyEmailResponse, mapResetPaswordResponse, mapIndividualResponse, StudentAdapter, mapStudentResponse, mapResetVerificationResponse } from "./adapters/authAdapter";

// Login Service
export async function loginUser(payload: LoginRequestDto | any) {
  const body = {
    email: payload.Email ?? payload.email,
    password: payload.Password ?? payload.password,
    rememberMe: payload.RememeberMe ?? payload.RememberMe ?? payload.rememberMe ?? false,
  };

  const response = await api.post<LoginResponseDto>("/api/auth/login", body);
  return mapLoginResponse(response.data);
}

// Register Services
export async function registerAdmin(payload: AdminRequestDto | any){
  const response = await api.post<AdminResponseDto>("/api/auth/register/admin", payload);
  return mapAdminResponse(response.data);
}
export async function registerCompany(payload: CompanyRequestDto | any){
  const response = await api.post<CompanyResponsetDto>("/api/auth/register/company", payload);
  return mapCompanyResponse(response.data);
}
export async function registerIndividual(payload: IndividualRequestDto | any) {
  const response = await api.post("/api/auth/register/individual", payload);
  return mapIndividualResponse(response.data);
}
export async function registerStudent(payload: StudentRequestDto) {
  try {
    const response = await api.post<StudentResponseDto>(
      "/api/auth/register/student",
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
export const resendVerification = async () => {
  try {
    const response = await api.post("/api/auth/resend-verification");
    return response.data; // { message, data }
  } catch (err: any) {
    if (err.response?.data?.message) throw new Error(err.response.data.message);
    throw err;
  }
};

// Reset Password
export async function sendCode(payload: ResetPasswordDto){
  const response = await api.post<ResetPasswordResponseDto>("/api/auth/reset-password", payload);
  return mapResetPaswordResponse(response.data);
}
export async function verifyResetCode(payload: VerifyResetCodeDto){
  const response = await api.post<VerifyResetCodeResponseDto>("/api/auth/reset-code/verify", payload);
  return mapResetVerificationResponse(response.data);
}
export async function resendCode(payload: ResetPasswordDto){
  const response = await api.post<ResetPasswordResponseDto>("/api/auth/reset-password", payload);
  return mapResetPaswordResponse(response.data);
}
