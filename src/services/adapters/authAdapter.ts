// src/services/adapters/authAdapter.ts

import { AdminResponseDto, CompanyResponsetDto, IndividualResponseDto, LoginResponseDto, ResendVerificationResponseDto, StudentRequestDto, VerifyEmailResponseDto } from "../dtos/authDto";

// Login Adapter
export function mapLoginResponse(dto: any) {
  // soporta {token}, {data: token}, {data: {token}}, {message}
  const token = dto?.token ?? dto?.data?.token ?? dto?.data ?? null;
  const message = dto?.message ?? (token ? "Login successful" : "Invalid credentials");
  return { message, token };
}
// Register Adapters
// Admin
export function mapAdminResponse(dto: AdminResponseDto) {
  return {
    success: true,
    message: dto.data || dto.message,
  };
}

// Company
export function mapCompanyResponse(dto: CompanyResponsetDto | any) {
  return {
    message: dto.data || dto.message || dto.status || "Registro completado con éxito",
  };
}

// Individual
export function mapIndividualResponse(dto: IndividualResponseDto){
    return {message: dto.message};
}
// Student
// Interface
interface StudentForm{
    nombre: string;
    apellido: string;
    email: string;
    rut: string;
    telefono: string;
    password: string;
    confirmPassword: string;
    discapacidad: string;
}
// Request Adapter
export const StudentAdapter = {toDTO(formData: StudentForm): StudentRequestDto{
    const fullEmail = `${formData.email}@alumnos.ucn.cl`;

    return {
        Name: formData.nombre,
        LastName: formData.apellido,
        Email: fullEmail,
        Rut: formData.rut,
        PhoneNumber: formData.telefono,
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword,
        Disability: formData.discapacidad,
    };
},};
// Response Adapter
export function mapStudentResponse(dto: IndividualResponseDto){
    return {message: dto.message};
}

// Email Verification Adapters
// Verify-Email
export function mapVerifyEmailResponse(dto: VerifyEmailResponseDto){
    return{
        message: dto.message,
        info: dto.data ?? null,
    };
}
// Resend-Verification
export function mapResendVerificationResponse(dto: ResendVerificationResponseDto){
    return{
        message: dto.message,
        info: dto.data ?? null,
    };
}

// Reset Password Adapters
// Reset
export function mapResetPaswordResponse(dto: VerifyEmailResponseDto){
    return{message: dto.message,};
}
// Verification
export function mapResetVerificationResponse(dto: ResendVerificationResponseDto){
    return{message: dto.message,};
}