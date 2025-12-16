"use client";

import { useState } from "react";
import { ArrowLeft, User, Edit2, Save, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button, NotificationBanner } from "@/components/ui";
import { useIndividualProfile } from "./hooks";
import { 
    ProfileDetailSection, 
    ProfileSidebarSection, 
    ProfileSkeleton,
    ChangePasswordDialog
} from "./components";

export function IndividualProfileView() {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

    const {
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
        notification,
        isVisible,
        close,
        refetch,
    } = useIndividualProfile();

    if (isLoading || !profile) {
        return (
            <div className="flex flex-col min-h-screen relative text-white selection:bg-pink-500 selection:text-white overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <img src="/fondo.png" alt="Fondo UCN" className="w-full h-full object-cover opacity-60"/>
                    <div className="absolute inset-0 bg-linear-to-r from-violet-900/90 via-purple-800/90 to-fuchsia-800/80 mix-blend-hard-light" />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-900/50 to-purple-950/90" />
                </div>
                <ProfileSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 relative">
                <div className="absolute inset-0 bg-linear-to-br from-violet-900 to-slate-900" />
                <div className="relative z-10 max-w-xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] text-center text-white shadow-2xl">
                    <h2 className="text-2xl font-bold mb-2">Error al cargar</h2>
                    <p className="text-white/80 mb-6">{error}</p>
                    <button
                        onClick={refetch}
                        className="px-6 py-3 bg-white text-purple-900 rounded-full font-bold hover:bg-purple-100 transition shadow-lg"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    const handleEditToggle = () => {
        if (isEditing) {
            handleCancel();
        }
        setIsEditing(!isEditing);
    };

    const handleSaveClick = async () => {
        const success = await handleSave();
        if (success) {
            setIsEditing(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen relative text-white selection:bg-pink-500 selection:text-white overflow-hidden bg-slate-900">
            
            {/* Fondo Morado Continuo */}
            <div className="absolute inset-0 z-0">
                <img src="/fondo.png" alt="Fondo UCN" className="w-full h-full object-cover opacity-60"/>
                <div className="absolute inset-0 bg-linear-to-r from-violet-900/90 via-purple-800/90 to-fuchsia-800/80 mix-blend-hard-light" />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-purple-900/50 to-purple-950/90" />
            </div>

            <NotificationBanner
                data={{ 
                    title: notification?.title || "", 
                    message: notification?.message || "", 
                    type: notification?.type || "success" 
                }}
                isVisible={isVisible}
                onClose={close}
            />

            <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-0">
                
                {/* Header Flotante */}
                <header className="mb-8">
                    <Button
                        onClick={() => router.back()}
                        className="cursor-pointer mb-6 flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all font-bold text-sm backdrop-blur-sm border border-white/10"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex flex-col gap-2">
                            <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                                <User className="w-3 h-3" />
                                Estudiante
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight drop-shadow-lg leading-tight">
                                Mi Perfil
                            </h1>
                            <p className="text-lg md:text-xl text-white/80 font-medium">
                                @{profile.userName}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleSaveClick}
                                        disabled={isSaving}
                                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        {isSaving ? "Guardando..." : "Guardar"}
                                    </button>
                                    <Button
                                        onClick={handleEditToggle}
                                        disabled={isSaving}
                                        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold transition shadow-lg flex items-center gap-2 disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                        Cancelar
                                    </Button>
                                </>
                            ) : (
                                <button
                                    onClick={handleEditToggle}
                                    className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white rounded-full font-bold transition shadow-lg flex items-center gap-2"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Editar Perfil
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Tarjeta Principal Blanca */}
                <div className="bg-white text-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        
                        {/* Columna Izquierda: Información Principal */}
                        <div className="w-full md:w-3/4 space-y-8">
                            <ProfileDetailSection 
                                profile={profile}
                                formData={formData}
                                isEditing={isEditing}
                                fieldErrors={fieldErrors}
                                handleChange={handleChange}
                            />

                            {/* Change Password Button */}
                            {isEditing && (
                                <div className="pt-4 border-t border-slate-100">
                                    <Button
                                        type="button"
                                        onClick={() => setIsPasswordDialogOpen(true)}
                                        className="w-full px-6 py-4 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl font-bold hover:bg-indigo-100 transition shadow-lg flex justify-center items-center gap-2"
                                    >
                                        Cambiar Contraseña
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Columna Derecha: Perfil Sidebar */}
                        <div className="w-full md:w-1/4 space-y-6">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <ProfileSidebarSection 
                                    profile={profile}
                                    onPhotoUpload={handlePhotoUpload}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Change Password Dialog */}
                <ChangePasswordDialog
                    isOpen={isPasswordDialogOpen}
                    onClose={() => setIsPasswordDialogOpen(false)}
                />
            </main>
        </div>
    );
}