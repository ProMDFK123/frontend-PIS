"use client";

import { UserProfileForAdminDto } from "@/services/dtos/adminDto";
import { Calendar, Mail, Phone, FileText, Accessibility, Shield } from "lucide-react";
import { formatDate} from "@/utils/Util";

interface UserDetailSectionProps {
    user: UserProfileForAdminDto;
}

export function UserDetailSection({ user }: UserDetailSectionProps) {
    return (
        <section className="w-full space-y-6">
            {/* Status Badge */}
            {user.banned && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-red-600" />
                    <div>
                        <h3 className="font-bold text-red-900">Usuario Bloqueado</h3>
                        <p className="text-sm text-red-700">Este usuario no puede acceder a la plataforma</p>
                    </div>
                </div>
            )}

            {user.superAdmin && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                    <Shield className="w-5 h-5 text-yellow-600" />
                    <div>
                        <h3 className="font-bold text-yellow-900">Super Administrador</h3>
                        <p className="text-sm text-yellow-700">Este usuario tiene privilegios de super administrador</p>
                    </div>
                </div>
            )}

            {/* About Me */}
            {user.aboutMe && (
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-black">Sobre mí</h3>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                        {user.aboutMe}
                    </p>
                </div>
            )}

            {/* Información de Contacto */}
            <div className="pt-4 border-t border-slate-200">
                <h3 className="text-xl font-bold text-black mb-4">
                    Información de Contacto
                </h3>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    {/* Email */}
                    <div>
                        <dt className="font-semibold text-slate-700 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Correo Electrónico:
                        </dt>
                        <dd className="mt-1 text-slate-600 break-all">
                            {user.email}
                        </dd>
                    </div>

                    {/* Phone */}
                    <div>
                        <dt className="font-semibold text-slate-700 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            Teléfono:
                        </dt>
                        <dd className="mt-1 text-slate-600">
                            {user.phoneNumber}
                        </dd>
                    </div>

                    {/* RUT */}
                    <div>
                        <dt className="font-semibold text-slate-700">RUT:</dt>
                        <dd className="mt-1 text-slate-600">
                            {user.rut}
                        </dd>
                    </div>

                    {/* Rating */}
                    {user.rating !== null && (
                        <div>
                            <dt className="font-semibold text-slate-700">Calificación:</dt>
                            <dd className="mt-1 font-semibold text-green-700">
                                ⭐ {user.rating.toFixed(1)} / 5.0
                            </dd>
                        </div>
                    )}
                </dl>
            </div>

            {/* Student Specific Info */}
            {user.userType === "Estudiante" && (user.cvUrl || user.disability) && (
                <div className="pt-4 border-t border-slate-200">
                    <h3 className="text-xl font-bold text-black mb-4">
                        Información Académica
                    </h3>

                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                        {user.cvUrl && (
                            <div>
                                <dt className="font-semibold text-slate-700 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Currículum Vitae:
                                </dt>
                                <dd className="mt-1">
                                    <a 
                                        href={user.cvUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:text-indigo-800 underline font-medium"
                                    >
                                        Ver CV
                                    </a>
                                </dd>
                            </div>
                        )}

                        {user.disability && (
                            <div>
                                <dt className="font-semibold text-slate-700 flex items-center gap-2">
                                    <Accessibility className="w-4 h-4" />
                                    Discapacidad:
                                </dt>
                                <dd className="mt-1 text-slate-600">
                                    {user.disability}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>
            )}

            {/* Activity Info */}
            <div className="pt-4 border-t border-slate-200">
                <h3 className="text-xl font-bold text-black mb-4">
                    Actividad en la Plataforma
                </h3>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    {/* Created At */}
                    <div>
                        <dt className="font-semibold text-slate-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Fecha de Registro:
                        </dt>
                        <dd className="mt-1 text-slate-600">
                            {formatDate(user.createdAt)}
                        </dd>
                    </div>

                    {/* Updated At */}
                    <div>
                        <dt className="font-semibold text-slate-700 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Última Actualización:
                        </dt>
                        <dd className="mt-1 text-slate-600">
                            {formatDate(user.updatedAt)}
                        </dd>
                    </div>

                    {/* Last Login */}
                    {user.lastLoginAt && (
                        <div>
                            <dt className="font-semibold text-slate-700">Último Acceso:</dt>
                            <dd className="mt-1 text-slate-600">
                                {formatDate(user.lastLoginAt)}
                            </dd>
                        </div>
                    )}
                </dl>
            </div>
        </section>
    );
}