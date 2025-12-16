"use client";

import { useRef } from "react";
import { AdminProfileDTO} from "@/services/profileService";
import { Camera, Star } from "lucide-react";

interface ProfileSidebarSectionProps {
    profile: AdminProfileDTO;
    onPhotoUpload: (file: File) => void;
}

export function ProfileSidebarSection({ profile, onPhotoUpload }: ProfileSidebarSectionProps) {
    const photoInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onPhotoUpload(file);
        }
    };

    const fullName = `${profile.name || ""} ${profile.lastName || ""}`.trim();
    const initials = `${profile.name?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`;

    return (
        <section className="w-full">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                Mi Perfil
            </h2>

            {/* Avatar */}
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group" key={profile.profilePhoto || initials}>
                    {profile.profilePhoto ? (
                        <img
                            src={profile.profilePhoto}
                            alt={fullName}
                            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                    ) : null}

                    <div className={`w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-indigo-100 ${profile.profilePhoto ? 'hidden' : ''}`}>
                        {initials}
                    </div>
                    
                    {/* Photo upload button */}
                    <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg border-2 border-indigo-100 hover:bg-indigo-50 transition-colors"
                    >
                        <Camera className="w-4 h-4 text-indigo-600" />
                    </button>
                    
                    <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                </div>

                <p className="font-semibold text-lg text-slate-900">
                    {fullName || "Administrador"}
                </p>
                <p className="text-slate-600 text-sm">
                    @{profile.userName}
                </p>
            </div>

            {/* User Info */}
            <div className="mt-6 pt-5 border-t border-slate-200 text-slate-700 text-sm space-y-4">
                <div className="flex flex-col">
                    <span className="font-semibold mb-1">Tipo de Usuario:</span>
                    <span className="inline-flex self-start px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700">
                        Administrador
                    </span>
                </div>
            </div>
        </section>
    );
}