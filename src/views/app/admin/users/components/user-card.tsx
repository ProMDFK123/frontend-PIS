import { UserForAdminDto } from "@/services/dtos/adminDto";
import { UserIcon, ShieldAlert, Star, ShieldCheck, ShieldX} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ConfirmDialog } from "@/components/ui";

interface UserCardProps {
    user: UserForAdminDto;
    onToggleBlock: (user: UserForAdminDto) => void;
}

export function UserCard({ user, onToggleBlock }: UserCardProps) {
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
        if (rating >= 4.5) return "text-green-600";
        if (rating >= 3.5) return "text-blue-600";
        if (rating >= 2.5) return "text-yellow-600";
        return "text-red-600";
    };

    const handleConfirmToggle = () => {
        onToggleBlock(user);
    }

    return (
        <Link href={`/admin/users/${user.id}`} className="block">
            <article className="relative flex flex-col h-full rounded-[2rem] bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group border-4 border-transparent hover:border-indigo-200 overflow-hidden">
                
                {/* Header */}
                <div className="px-6 pt-6 pb-2 flex justify-between items-start">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider ${getUserTypeColor(user.userType)}`}>
                        {user.userType}
                    </span>
                </div>

                <div className="px-6 py-4 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">
                        {user.userName || "Sin nombre"}
                    </h3>

                    <div className="space-y-3 mt-4">
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                <UserIcon className="w-4 h-4 text-indigo-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</p>
                                <p className="text-sm font-bold text-slate-700 truncate">{user.email}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                <ShieldAlert className="w-4 h-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">RUT</p>
                                <p className="text-sm font-bold text-slate-700">{user.rut}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center shrink-0">
                                <Star className="w-4 h-4 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Calificación</p>
                                <p className={`text-sm font-bold ${getRatingColor(user.rating ?? 0)}`}>
                                    {user.rating?.toFixed(1) ?? "N/A"} / 5.0
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Combined Status & Action Button - Same as List View */}
                <div className="p-4 mt-2">
                    <button 
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsDialogOpen(true)
                        }}
                        className={`w-full flex flex-col items-center gap-1 px-4 py-3 rounded-2xl font-bold transition-all shadow-md hover:shadow-lg active:scale-95 ${
                            user.banned
                                ? "bg-red-500/20 hover:bg-green-500 border-2 border-red-400 hover:border-green-500 text-red-700 hover:text-white"
                                : "bg-green-500/20 hover:bg-red-500 border-2 border-green-400 hover:border-red-500 text-green-700 hover:text-white"
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
            </article>
        </Link>
    );
}