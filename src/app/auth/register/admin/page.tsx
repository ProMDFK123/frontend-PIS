"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { registerAdmin } from "@/services/authService";
import { AdminAdapter } from "@/services/adapters/authAdapter";
import { formatRut } from "@/utils/Util"
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { useNotification } from "@/hooks/common/use-notification";
import { validators } from "@/utils/AuthValidatorsUtil";
import { FormField } from "@/components/forms/FormField";
import { PasswordField } from "@/components/forms/PasswordField";
import { NotificationBanner } from "@/components/ui";

const PRIMARY_COLOR = "#2C3E90";
const OVERLAY_COLOR = "rgba(44, 114, 175, 0.4)";

//Validaciones del formulario
const individualValidationRules = {
  nombre: (value: string) => validators.name(value, "Nombre"),
  apellido: (value: string) => validators.name(value, "Apellido"),
  email: (value: string) => validators.regularEmail(value, "Email"),
  rut: (value: string) => validators.rut(value, "RUT"),
  telefono: (value: string) => validators.phone(value),
  password: (value: string) => validators.password(value, "Contraseña"),
  confirmPassword: (value: string, formData: any) => 
    validators.confirmPassword(value, formData?.password || ""),
};

export default function RegisterAdminPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {notification, isVisible, show, close} = useNotification();
  const {
    formData,
    errors,
    touched,
    handleChange: baseHandleChange,
    handleBlur,
    validateAll,
  } = useFormValidation(
    {
      nombre: "",
      apellido: "",
      rut: "",
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
      superAdmin: false,
    },
    individualValidationRules
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === "rut") {
      const formatted = formatRut(e.target.value);
      e.target.value = formatted;
    }
    baseHandleChange(e);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!validateAll()) {
      const firstErrorField = Object.keys(errors)[0];
      document.getElementsByName(firstErrorField)[0]?.focus();
      setLoading(false);
      return;
    }

    try {
      const payload = AdminAdapter.toDTO(formData);
      const response = await registerAdmin(payload);

      show(
        "Registro Exitoso",
        response.message ||"Se ha enviado un correo de verificación a la dirección proporcionada.",
        "success"
      );
      
      setTimeout(() => {
        router.push(`/`);
      }, 2000);
    }catch (error: any) {
      console.error("Error en el registro:", error);

      const backendError = error?.response?.data;
      let errorMessage = "Error al registrarse. Por favor, inténtalo nuevamente.";

      if (backendError.details) {
          errorMessage += `\n${backendError.details}`;
        }

      if (backendError?.errors) {
        errorMessage = Object.entries(backendError.errors)
          .map(([field, messages]) => {
            const friendlyField = field === "Rut" ? "RUT" : field;
            return `${friendlyField}: ${(messages as string[]).join(", ")}`;
          })
          .join("\n");
      } else if (backendError?.message) {
        errorMessage = backendError.message;
        if (backendError.details) {
          errorMessage += `\n${backendError.details}`;
        }
      }

      show(
        "Error de Registro", 
        errorMessage, 
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100">
      <NotificationBanner data={notification} isVisible={isVisible} onClose={close} />
      <main
        className="flex-grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/ucnferia.png')" }}
      >
        <div className="flex-grow flex items-center justify-center bg-green-900/40 backdrop-blur-sm p-4 w-full h-full"
          style={{ backgroundColor: OVERLAY_COLOR }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in zoom-in duration-300">
            <div className="p-8 sm:p-10">
              <div className="flex items-center justify-start pb-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-500 hover:text-blue-700 transition mr-4 p-2 -ml-2 rounded-full hover:bg-gray-100"
                  aria-label="Volver"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                  Registro de Administrador
                </h2>
              </div>
              <hr className="mb-6 border-gray-200" />

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  id="nombre"
                  label="Nombre"
                  placeholder="Juan"
                  value={formData.nombre}
                  onChange={handleChange}
                  onBlur={() => handleBlur("nombre")}
                  error={errors.nombre ?? undefined}
                  touched={touched.nombre}
                />
                <FormField
                  id="apellido"
                  label="Apellido"
                  placeholder="Pérez"
                  value={formData.apellido}
                  onChange={handleChange}
                  onBlur={() => handleBlur("apellido")}
                  error={errors.apellido ?? undefined}
                  touched={touched.apellido}
                />
                
                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
                    Correo Personal *
                  </label>
                  <div
                    className={`flex items-center border ${
                      touched.email && errors.email ? "border-red-500" : "border-gray-300"
                    } rounded-md px-2 focus-within:ring-1 focus-within:ring-blue-500`}
                  >
                    <input
                      id="email"
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur("email")}
                      placeholder="juan.perez@ejemplo.com"
                      className="flex-grow p-2 text-sm focus:outline-none"
                    />
                    <span className="text-gray-600 text-sm"></span>
                  </div>
                  {touched.email && errors.email && (
                    <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <FormField
                  id="rut"
                  label="RUT"
                  placeholder="12345678-9"
                  value={formData.rut}
                  onChange={handleChange}
                  onBlur={() => handleBlur("rut")}
                  error={errors.rut ?? undefined}
                  touched={touched.rut}
                  description="Sin puntos, con guión (ej: 12345678-9)"
                />

                <FormField
                  id="telefono"
                  label="Teléfono"
                  placeholder="+56912345678"
                  value={formData.telefono}
                  onChange={handleChange}
                  onBlur={() => handleBlur("telefono")}
                  error={errors.telefono ?? undefined}
                  touched={touched.telefono}
                />
                
                <PasswordField
                  id="password"
                  label="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={() => handleBlur("password")}
                  error={errors.password ?? undefined}
                  touched={touched.password}
                  showStrength={true}
                />

                <PasswordField
                  id="confirmPassword"
                  label="Confirmar Contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => handleBlur("confirmPassword")}
                  error={errors.confirmPassword ?? undefined}
                  touched={touched.confirmPassword}
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="superAdmin"
                    name="superAdmin"
                    checked={formData.superAdmin}
                    onChange={handleChange}
                  />
                  <label htmlFor="superAdmin" className="text-sm text-gray-700">
                    ¿Es SuperAdmin?
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white rounded-lg py-3 font-semibold transition duration-150 hover:opacity-90 shadow-md hover:shadow-lg mt-6 disabled:opacity-60"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  {loading ? "Creando cuenta..." : "Crear Cuenta"}
                </button>
              </form>

              <p className="text-center text-sm mt-6 text-gray-600">
                ¿Tienes una cuenta?{" "}
                <a
                  href="/login"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/login");
                  }}
                  className="text-blue-600 font-medium hover:underline transition"
                >
                  Inicia sesión aquí
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
