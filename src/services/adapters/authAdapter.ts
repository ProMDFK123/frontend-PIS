// src/services/adapters/authAdapter.ts

import { AdminResponseDto, CompanyResponsetDto, IndividualResponseDto, LoginResponseDto, ResendVerificationResponseDto, StudentRequestDto, VerifyEmailResponseDto } from "../dtos/authDto";

// Login Adapter
export function mapLoginResponse(dto: LoginResponseDto) {
    return {
        message: dto.message,
        token: dto.data ?? null,
    };
}

// Register Adapters
// Admin
export function mapAdminResponse(dto: AdminResponseDto){
    return {
        message: dto.message,
        success: !!dto.data,
    };
}
// Company
export function mapCompanyResponse(dto: CompanyResponsetDto){
    return{message: dto.message};
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