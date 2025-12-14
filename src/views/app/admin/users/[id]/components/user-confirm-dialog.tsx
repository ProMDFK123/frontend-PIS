import { ConfirmDialog } from "@/components/ui";
import { UserForAdminDto } from "@/services/dtos/adminDto";

interface UserConfirmDialogProps {
    user: UserForAdminDto;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
}

export function UserConfirmDialog({ user, isOpen, onOpenChange, onConfirm }: UserConfirmDialogProps) {
    return (
        <ConfirmDialog
            open={isOpen}
            onOpenChange={onOpenChange}
            title={user.banned ? "¿Desbloquear usuario?" : "¿Bloquear usuario?"}
            description={
                user.banned
                    ? `¿Estás seguro de que deseas desbloquear a ${user.userName}? El usuario podrá volver a acceder a la plataforma.`
                    : `¿Estás seguro de que deseas bloquear a ${user.userName}? El usuario no podrá acceder a la plataforma.`
            }
            confirmText={user.banned ? "Desbloquear" : "Bloquear"}
            cancelText="Cancelar"
            onConfirm={onConfirm}
        />
    );
}