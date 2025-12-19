"use client";

import { CompanyProfileDTO } from "@/services/profileService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ProfileDetailSectionProps {
    profile: CompanyProfileDTO;
    formData: {
        userName: string;
        name: string;
        lastName: string;
        rut: string;
        emailLocal: string;
        phoneNumber: string;
        aboutMe: string;
    };
    isEditing: boolean;
    fieldErrors: Record<string, string>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

function ProfileField({ 
    label, 
    name, 
    value, 
    displayValue, 
    textarea = false,
    colSpan = 1,
    isEditing,
    fieldErrors,
    handleChange
}: {
    label: string;
    name: string;
    value: string;
    displayValue?: string;
    textarea?: boolean;
    colSpan?: number;
    isEditing: boolean;
    fieldErrors: Record<string, string>;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
    return (
        <div className={colSpan > 1 ? `md:col-span-${colSpan}` : ""}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
                {label}
            </label>
            {isEditing ? (
                <>
                    {textarea ? (
                        <Textarea
                            name={name}
                            value={value}
                            onChange={handleChange}
                            rows={6}
                            maxLength={500}
                            className={`resize-y min-h-32 ${fieldErrors[name] ? "border-red-500 focus:ring-red-500" : ""}`}
                            placeholder={`Escribe ${label.toLowerCase()}...`}
                        />
                    ) : (
                        <Input
                            name={name}
                            value={value}
                            onChange={handleChange}
                            className={fieldErrors[name] ? "border-red-500 focus:ring-red-500" : ""}
                        />
                    )}
                    {fieldErrors[name] && (
                        <p className="text-red-600 text-xs mt-1">{fieldErrors[name]}</p>
                    )}
                </>
            ) : textarea ? (
                <div className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 min-h-[100px] whitespace-pre-wrap text-slate-700">
                    {displayValue || "Sin descripción"}
                </div>
            ) : (
                <div className="px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700">
                    {displayValue || "-"}
                </div>
            )}
        </div>
    );
}

export function ProfileDetailSection({ 
    profile, 
    formData, 
    isEditing, 
    fieldErrors, 
    handleChange 
}: ProfileDetailSectionProps) {
    return (
        <section className="w-full space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Información Personal
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ProfileField
                        label="Nombre de usuario"
                        name="userName"
                        value={formData.userName}
                        displayValue={profile.userName}
                        isEditing={isEditing}
                        fieldErrors={fieldErrors}
                        handleChange={handleChange}
                    />
                    <ProfileField
                        label="RUT"
                        name="rut"
                        value={formData.rut}
                        displayValue={profile.rut}
                        isEditing={isEditing}
                        fieldErrors={fieldErrors}
                        handleChange={handleChange}
                    />
                    <ProfileField
                        label="Nombre Compañia"
                        name="companyName"
                        value={formData.name}
                        displayValue={profile.companyName}
                        isEditing={isEditing}
                        fieldErrors={fieldErrors}
                        handleChange={handleChange}
                    />
                    <ProfileField
                        label="Razón Social"
                        name="legalName"
                        value={formData.lastName}
                        displayValue={profile.legalName}
                        isEditing={isEditing}
                        fieldErrors={fieldErrors}
                        handleChange={handleChange}
                    />
                    
                    <ProfileField
                        label="Correo electrónico"
                        name="emailLocal"
                        value={formData.emailLocal}
                        displayValue={profile.email}
                        colSpan={2}
                        isEditing={isEditing}
                        fieldErrors={fieldErrors}
                        handleChange={handleChange}
                    />
                    <ProfileField
                        label="Teléfono"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        displayValue={profile.phoneNumber}
                        colSpan={2}
                        isEditing={isEditing}
                        fieldErrors={fieldErrors}
                        handleChange={handleChange}
                    />
                    <ProfileField
                        label="Sobre mí"
                        name="aboutMe"
                        value={formData.aboutMe}
                        displayValue={profile.aboutMe}
                        textarea
                        colSpan={2}
                        isEditing={isEditing}
                        fieldErrors={fieldErrors}
                        handleChange={handleChange}
                    />
                </div>
            </div>
        </section>
    );
}