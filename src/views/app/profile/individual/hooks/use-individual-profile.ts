"use client";

import { useState, useEffect } from "react";
import { profileService, IndividualProfileDTO } from "@/services/profileService";
import { useNotification } from "@/hooks/common/use-notification";
import { validators } from "@/utils/AuthValidatorsUtil";
import { formatRut } from "@/utils/Util";

export const useIndividualProfile = () => {
    const [profile, setProfile] = useState<IndividualProfileDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    
    const { notification, isVisible, show, close } = useNotification();

    const [formData, setFormData] = useState({
        userName: "",
        name: "",
        lastName: "",
        rut: "",
        emailLocal: "",
        phoneNumber: "",
        aboutMe: "",
    });

    const [originalData, setOriginalData] = useState(formData);

    const fetchProfile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await profileService.getIndividualProfile();
            
            if (response.data) {
                setProfile(response.data);
                const email = response.data.email || "";
                const local = email.includes("@") ? email.split("@")[0] : email;
                
                const data = {
                    userName: response.data.userName || "",
                    name: response.data.name || "",
                    lastName: response.data.lastName || "",
                    rut: response.data.rut || "",
                    emailLocal: email,
                    phoneNumber: response.data.phoneNumber || "",
                    aboutMe: response.data.aboutMe || "",
                };
                
                setFormData(data);
                setOriginalData(data);
            } else {
                setError(response.message || "Error al cargar perfil");
            }
        } catch (err: any) {
            setError(err.response?.data?.message || "Error de conexión");
            console.error("Error fetching profile:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();

    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let newValue = value;
        
        if (name === "rut") newValue = formatRut(value);
        if (name === "emailLocal" && newValue.includes("@")) newValue = newValue.split("@")[0];
        
        if (fieldErrors[name]) {
            setFieldErrors((prev) => {
                const copy = { ...prev };
                delete copy[name];
                return copy;
            });
        }
        
        setFormData((prev) => ({ ...prev, [name]: newValue }));
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};

        const userNameError = validators.required(formData.userName, "Nombre de usuario") ||
                              validators.minLenght(formData.userName, 3, "Nombre de usuario") ||
                              validators.maxLenght(formData.userName, 50, "Nombre de usuario");
        if (userNameError) errors.userName = userNameError;

        const nameError = validators.name(formData.name, "Nombre");
        if (nameError) errors.name = nameError;

        const lastNameError = validators.name(formData.lastName, "Apellido");
        if (lastNameError) errors.lastName = lastNameError;

        const rutError = validators.rut(formData.rut);
        if (rutError) errors.rut = rutError;

        const emailError = validators.regularEmail(formData.emailLocal, "Correo");
        if (emailError) errors.emailLocal = emailError;

        const phoneError = validators.phone(formData.phoneNumber);
        if (phoneError) errors.phoneNumber = phoneError;

        if (formData.aboutMe && formData.aboutMe.length > 500) {
            errors.aboutMe = "La descripción no puede exceder 500 caracteres";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSave = async (): Promise<boolean> => {
        if (!validateForm()) {
            show("Error de validación", "Por favor corrige los errores en el formulario", "error");
            return false;
        }

        try {
            setIsSaving(true);
            const emailFull = formData.emailLocal.includes("@") 
                ? formData.emailLocal 
                : `${formData.emailLocal}@alumnos.ucn.cl`;

            const payload = {
                userName: formData.userName,
                name: formData.name,
                lastName: formData.lastName,
                rut: formData.rut,
                email: emailFull,
                phoneNumber: formData.phoneNumber,
                aboutMe: formData.aboutMe,
            };

            const response = await profileService.updateIndividualProfile(payload);
            
            if (response.data) {
                // Update profile state with the new form data since API returns string, not full profile
                setProfile(prev => prev ? { 
                    ...prev, 
                    userName: formData.userName,
                    name: formData.name,
                    lastName: formData.lastName,
                    rut: formData.rut,
                    email: emailFull,
                    phoneNumber: formData.phoneNumber,
                    aboutMe: formData.aboutMe
                } : null);
                setOriginalData(formData);
                show("Éxito", response.message || "Perfil actualizado correctamente", "success");
                return true;
            } else {
                show("Error", response.message || "No se pudo actualizar el perfil", "error");
                return false;
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.response?.data?.Message || err.message || "Error al guardar el perfil";
            show("Error", msg, "error");
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
        setFieldErrors({});
    };

    const handlePhotoUpload = async (file: File) => {
        const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            show("Error", `Solo se permiten: ${allowedTypes.map(t => t.replace("image/", ".")).join(", ")}`, "error");
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            show("Error", "La imagen no puede superar 5MB", "error");
            return;
        }

        try {
            const response = await profileService.updateProfilePhoto({ photo: file });
            
            if (response.data) {
                setProfile(prev => prev ? { ...prev, profilePhoto: response.data } : null);
                show("Éxito", "Foto de perfil actualizada", "success");
                await fetchProfile();
                window.dispatchEvent(new Event('profilePhotoUpdated'));
            } else {
                show("Error", "No se pudo actualizar la foto", "error");
            }
        } catch (err: any) {
            show("Error", err.response?.data?.message || "Error al subir la foto", "error");
        }
    };

    const handleCVUploadSuccess = (url: string | undefined) => {
        setProfile(prev => prev ? { ...prev, curriculumVitae: url } : null);
    };

    return {
        profile,
        isLoading,
        error,
        isSaving,
        formData,
        fieldErrors,
        handleChange,
        handleSave,
        handleCancel,
        handlePhotoUpload,
        handleCVUploadSuccess,
        notification,
        isVisible,
        close,
        refetch: fetchProfile,
    };
};