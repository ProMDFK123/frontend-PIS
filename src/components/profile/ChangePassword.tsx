"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { profileService } from "@/services/profileService";
import { validators } from "src/utils/AuthValidatorsUtil";

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function ChangePasswordDialog({
  open,
  onOpenChange,
  onSuccess,
}: ChangePasswordDialogProps) {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }

    if (error) setError(null);
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    // Contraseña
    if (!form.currentPassword) {
      errors.currentPassword = "La contraseña actual es requerida";
    }

    // Nueva contraseña
    const newPasswordError = validators.password(form.newPassword, "Nueva contraseña");
    if (newPasswordError) errors.newPassword = newPasswordError;

    // Confirmar nueva contraseña
    const confirmError = validators.confirmPassword(
      form.confirmNewPassword,
      form.newPassword
    );
    if (confirmError) errors.confirmNewPassword = confirmError;
    if (form.newPassword && form.currentPassword === form.newPassword) {
      errors.newPassword = "La nueva contraseña debe ser diferente de la actual";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const response = await profileService.changePassword({
        CurrentPassword: form.currentPassword,
        NewPassword: form.newPassword,
        ConfirmNewPassword: form.confirmNewPassword,
      });

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setFieldErrors({});
      onOpenChange(false);

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Error al cambiar la contraseña", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.Message ||
        err.message ||
        "Error al cambiar la contraseña";

      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  function handleOpenChange(newOpen: boolean) {
    if (!newOpen) {
      setForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setFieldErrors({});
      setError(null);
    }
    onOpenChange(newOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px]"
        style={{ 
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: '12px'
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle style={{ color: '#1F2937', fontSize: '20px', fontWeight: '600' }}>
              Cambiar Contraseña
            </DialogTitle>
            <DialogDescription style={{ color: '#6B7280', fontSize: '14px' }}>
              Ingresa tu contraseña actual y la nueva contraseña que deseas usar.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div 
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FCA5A5',
                  color: '#B91C1C',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {error}
              </div>
            )}

            <div className="grid gap-2">
              <label 
                htmlFor="currentPassword" 
                style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}
              >
                Contraseña Actual
              </label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={handleChange}
                style={{
                  borderColor: fieldErrors.currentPassword ? '#EF4444' : '#E5E7EB',
                  borderWidth: '1px',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                disabled={submitting}
              />
              {fieldErrors.currentPassword && (
                <p style={{ color: '#DC2626', fontSize: '12px' }}>
                  {fieldErrors.currentPassword}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <label 
                htmlFor="newPassword" 
                style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}
              >
                Nueva Contraseña
              </label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                style={{
                  borderColor: fieldErrors.newPassword ? '#EF4444' : '#E5E7EB',
                  borderWidth: '1px',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                disabled={submitting}
              />
              {fieldErrors.newPassword && (
                <p style={{ color: '#DC2626', fontSize: '12px' }}>
                  {fieldErrors.newPassword}
                </p>
              )}
              <p style={{ fontSize: '12px', color: '#6B7280' }}>
                Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
              </p>
            </div>

            <div className="grid gap-2">
              <label 
                htmlFor="confirmNewPassword" 
                style={{ fontSize: '14px', fontWeight: '500', color: '#1F2937' }}
              >
                Confirmar Nueva Contraseña
              </label>
              <Input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={form.confirmNewPassword}
                onChange={handleChange}
                style={{
                  borderColor: fieldErrors.confirmNewPassword ? '#EF4444' : '#E5E7EB',
                  borderWidth: '1px',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                disabled={submitting}
              />
              {fieldErrors.confirmNewPassword && (
                <p style={{ color: '#DC2626', fontSize: '12px' }}>
                  {fieldErrors.confirmNewPassword}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={submitting}
              style={{
                borderColor: '#E5E7EB',
                color: '#1F2937',
                backgroundColor: '#FFFFFF'
              }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={submitting}
              style={{
                backgroundColor: '#6D5EF7', // BolsaUCN primary purple
                color: '#FFFFFF',
                opacity: submitting ? 0.6 : 1
              }}
            >
              {submitting ? "Cambiando..." : "Cambiar Contraseña"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}