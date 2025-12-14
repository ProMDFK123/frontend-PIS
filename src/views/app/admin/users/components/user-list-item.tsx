import { UserForAdminDto } from "@/services/dtos/adminDto";
import { ShieldCheck, ShieldX } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui";

interface UserListItemProps {
    user: UserForAdminDto;
    onToggleBlock: (user: UserForAdminDto) => void;
}

export function UserListItem({ user, onToggleBlock }: UserListItemProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const getUserTypeColor = (userType: string) => {
        switch (userType) {
            case "Estudiante":
                return "bg-blue-100 text-blue-700";
            case "Empresa":
                return "bg-purple-100 text-purple-700";
            case "Particular":
                return "bg-green-100 text-green-700";
            case "Administrador":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return "text-green-400";
        if (rating >= 3.5) return "text-blue-400";
        if (rating >= 2.5) return "text-yellow-400";
        return "text-red-400";
    };

    const handleConfirmToggle = () => {
        onToggleBlock(user);
    };

    return (
        <Link href={`/admin/users/${user.id}`} className="block">
            <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/15 transition-all group cursor-pointer">
                <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/15 transition-all group">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                {user.userName?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        </div>
                        
                        {/* User Info with Badge */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-white text-lg truncate">{user.userName}</h3>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${getUserTypeColor(user.userType)}`}>
                                    {user.userType}
                                </span>
                            </div>
                            <p className="text-sm text-white/70 truncate">{user.email}</p>
                        </div>
                    </div>

                    {/* Right Section - Stats & Action with Even Spacing */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* RUT Card */}
                        <div className="flex flex-col items-center px-4 py-2 bg-white/10 rounded-xl border border-white/20 w-[150px]">
                            <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">RUT</span>
                            <span className="text-sm font-bold text-white mt-0.5">{user.rut}</span>
                        </div>
                        
                        {/* Rating Card */}
                        <div className="flex flex-col items-center px-4 py-2 bg-white/10 rounded-xl border border-white/20 w-[90px]">
                            <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">Rating</span>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-lg">⭐</span>
                                <span className={`text-sm font-black text-white ${
                                    user.rating ?? 0 >= 4.5 ? "drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]" :
                                    user.rating ?? 0 >= 3.5 ? "drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]" :
                                    user.rating ?? 0 >= 2.5 ? "drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" :
                                    "drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                                }`}>
                                    {user.rating?.toFixed(1) ?? "N/A"}
                                </span>
                            </div>
                        </div>

                        {/* Combined Status & Action Button */}
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsDialogOpen(true);
                            }}
                            className={`cursor-pointer flex flex-col items-center gap-1 px-4 py-3 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 w-[130px] ${
                                user.banned
                                    ? "bg-red-500/20 hover:bg-green-500 border-2 border-red-400 hover:border-green-500 text-red-200 hover:text-white"
                                    : "bg-green-500/20 hover:bg-red-500 border-2 border-green-400 hover:border-red-500 text-green-200 hover:text-white"
                            }`}
                        >
                            {/* Status Icon & Label */}
                            <div className="flex items-center gap-1.5">
                                {user.banned ? (
                                    <>
                                        <ShieldX className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Bloqueado</span>
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase">Activo</span>
                                    </>
                                )}
                            </div>
                            
                            {/* Action Text */}
                            <span className="text-xs opacity-75">
                                {user.banned ? "Click para desbloquear" : "Click para bloquear"}
                            </span>
                        </button>
                    </div>
                    <ConfirmDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        title={user.banned ? "¿Desbloquear usuario?" : "¿Bloquear usuario?"}
                        description={
                            user.banned
                                ? `¿Estás seguro de que deseas desbloquear a ${user.userName}? El usuario podrá volver a acceder a la plataforma.`
                                : `¿Estás seguro de que deseas bloquear a ${user.userName}? El usuario no podrá acceder a la plataforma.`
                        }
                        confirmText={user.banned ? "Desbloquear" : "Bloquear"}
                        cancelText="Cancelar"
                        onConfirm={handleConfirmToggle}
                    />
                </div>
            </div>
        </Link>
    );
}