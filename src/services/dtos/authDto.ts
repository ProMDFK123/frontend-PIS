// src/services/dtos/authDto.ts

// Login DTOs
// Request
export interface LoginRequestDto {
    Email: string;
    Password: string;
    RememeberMe: boolean;
}
// Response
export interface LoginResponseDto {
    message: string;
    data?: string; // Este es el token.
}

// Register DTOs
// Admin
// Request
export interface AdminRequestDto {
    Email: string;
    Password: string;
    ConfirmPassword: string;
    Name: string;
    LastName: string;
    Rut: string;
    PhoneNumber: string;
    SuperAdmin: boolean;
}
// Response
export interface AdminResponseDto{
    message: string;
    data?: any;
}
// Company
// Request
export interface CompanyRequestDto{
    CompanyName: string;
    LegalName: string;
    Email: string;
    Rut: string;
    PhoneNumber: string;
    Password: string;
    ConfirmPassword: string;
}
// Response
export interface CompanyResponsetDto{
    message: string;
}
// Individual
// Request
export interface IndividualRequestDto{
    Name: string;
    LastName: string;
    Email: string;
    Rut: string;
    PhoneNumber: string;
    Password: string;
    ConfirmPassword: string;
}
// Response
export interface IndividualResponseDto{
    message: string;
}
// Student
// Request
export interface StudentRequestDto{
    Name: string;
    LastName: string;
    Email: string;
    Rut: string;
    PhoneNumber: string;
    Password: string;
    ConfirmPassword: string;
    Disability: string;
}
// Response
export interface StudentResponseDto{
    message: string;
}