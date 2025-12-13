"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, User } from "lucide-react";
import { AdminUserService, UserProfileForAdminDTO } from "@/services/adminProfileService";

export default function AdminUserProfilePage() {
    const { userId } = useParams();
    const router = useRouter();

    const [loading, setLoading] = useState<boolean>(true);
    const [profile, setProfile] = useState<UserProfileForAdminDTO | any>(null);

    useEffect(() => {
        AdminUserService.getUserProfileById(userId as string)
            .then(data => {
                setProfile(data);
                console.log("Datos de Perfil Recibidos (profile):", data); 
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [userId]);

    if(loading){return <div className="p-10 text-white">Cargando perfil...</div>;}

    if (!profile) {return <div className="p-10 text-white">Perfil no encontrado.</div>;}

    return (
        <main className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 p-10">
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    className="text-white mb-6"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Volver al panel
                </Button>

                <Card className="rounded-2xl shadow-xl bg-white">
                    <CardContent className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-purple-100 text-purple-700 p-4 rounded-full">
                                <User className="w-6 h-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Perfil de Usuario</h1>
                                <p className="text-sm text-muted-foreground">Vista administrativa</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Info label="Username" value={profile.username} />
                            <Info label="Email" value={profile.email} />
                            <Info 
                                label="Nombre" 
                                value={(profile.firstName && profile.lastName) 
                                    ? `${profile.firstName} ${profile.lastName}` 
                                    : (profile.username || "—")} 
                            />
                            <Info label="RUT" value={profile.rut} />
                            <Info label="Teléfono" value={profile.phoneNumber} />
                            <Info label="Tipo de usuario" value={profile.userType} />
                            <Info label="Rating" value={profile.rating?.toString() ?? "—"} />
                            <Info label="Baneado" value={profile.banned ? "Sí" : "No"} />
                            <Info label="Último login" value={profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : "—"} />
                            <Info label="Creado" value={new Date(profile.createdAt).toLocaleDateString()} />
                            <Info label="Actualizado" value={new Date(profile.updatedAt).toLocaleDateString()} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted rounded-xl p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}