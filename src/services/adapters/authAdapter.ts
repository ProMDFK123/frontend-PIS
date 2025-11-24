// src/services/adapters/authAdapter.ts

import { 
  AdminResponseDto,
  AdminRequestDto, 
  CompanyResponsetDto, 
  CompanyRequestDto,
  IndividualResponseDto, 
  IndividualRequestDto,
  StudentResponseDto,
  StudentRequestDto,
  LoginResponseDto, 
  ResendVerificationResponseDto, 
  VerifyEmailResponseDto 
} from "../dtos/authDto";

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

export interface CompanyForm {
  nombreEmpresa: string;
  razonSocial: string;
  rut: string;
  email: string;
  telefono: string;
  password: string;
  confirmPassword: string;
}

export interface IndividualForm {
  nombre: string;
  apellido: string;
  email: string;
  rut: string;
  telefono: string;
  password: string;
  confirmPassword: string;
}

export interface AdminForm {
  nombre: string;
  apellido: string;
  email: string;
  rut: string;
  telefono: string;
  password: string;
  confirmPassword: string;
  superAdmin: boolean;
}

// Login Adapter
export function mapLoginResponse(dto: any) {
  // soporta {token}, {data: token}, {data: {token}}, {message}
  const token = dto?.token ?? dto?.data?.token ?? dto?.data ?? null;
  const message = dto?.message ?? (token ? "Login exitoso" : "Credenciales inválidas");
  return { message, token };
}
// Register Adapters
// Admin
export const AdminAdapter = {
  toDTO(formData: AdminForm): AdminRequestDto {
    return {
      Name: formData.nombre,
      LastName: formData.apellido,
      Email: formData.email,
      Rut: formData.rut,
      PhoneNumber: formData.telefono,
      Password: formData.password,
      ConfirmPassword: formData.confirmPassword,
      SuperAdmin: formData.superAdmin,
    };
  },
  fromResponse(dto: AdminResponseDto): { message: string } {
    return { message: dto.message ?? "Registro de administrador exitoso" };
  },
}

// Company
export const CompanyAdapter = {
  toDTO(formData: CompanyForm): CompanyRequestDto {
    return {
      CompanyName: formData.nombreEmpresa,
      LegalName: formData.razonSocial,
      Rut: formData.rut,
      Email: formData.email,
      PhoneNumber: formData.telefono,
      Password: formData.password,
      ConfirmPassword: formData.confirmPassword,
    };
  },
  fromResponse(dto: CompanyResponsetDto): { message: string } {
    return { message: dto.message ?? "Registro de empresa exitoso" };
  },
}

// Individual
export const IndividualAdapter = {
  toDTO(formData: IndividualForm): IndividualRequestDto {
    return {
      Name: formData.nombre,
      LastName: formData.apellido,
      Email: formData.email,
      Rut: formData.rut,
      PhoneNumber: formData.telefono,
      Password: formData.password,
      ConfirmPassword: formData.confirmPassword,
    };
  },
  fromResponse(dto: IndividualResponseDto): { message: string } {
    return { message: dto.message ?? "Registro de individuo exitoso" };
  },
}
// Student
export const StudentAdapter = {
  toDTO(formData: StudentForm): StudentRequestDto {
    const emailLocalPart = formData.email.replace(/@.*/g, ""); // elimina cualquier dominio si lo escriben
    const finalEmail = `${emailLocalPart}@alumnos.ucn.cl`;

    return {
      Name: formData.nombre,
      LastName: formData.apellido,
      Email: finalEmail,
      Rut: formData.rut,
      PhoneNumber: formData.telefono,
      Password: formData.password,
      ConfirmPassword: formData.confirmPassword,
      Disability: formData.discapacidad,
    };
  },
};

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
