"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { registerCompany } from "@/services/authService";
import { CompanyAdapter } from "@/services/adapters/authAdapter";
import { formatRut } from "@/utils/Util"
import { useFormValidation } from "@/hooks/auth/useFormValidation";
import { validators } from "@/utils/AuthValidatorsUtil";
import { FormField } from "@/components/forms/FormField";
import { PasswordField } from "@/components/forms/PasswordField";

const PRIMARY_COLOR = "#2C3E90";
const OVERLAY_COLOR = "rgba(44, 114, 175, 0.4)";

//Validaciones del formulario
const individualValidationRules = {
  nombre: (value: string) => validators.name(value, "Nombre Empresa"),
  apellido: (value: string) => validators.name(value, "Razon Social"),
  email: (value: string) => validators.regularEmail(value, "Email"),
  rut: (value: string) => validators.rut(value, "RUT"),
  telefono: (value: string) => validators.phone(value),
  password: (value: string) => validators.password(value, "Contraseña"),
  confirmPassword: (value: string, formData: any) => 
    validators.confirmPassword(value, formData?.password || ""),
};



export default function RegisterCompanyPage() {
  const router = useRouter();
  const {
    formData,
    errors,
    touched,
    handleChange: baseHandleChange,
    handleBlur,
    validateAll,
  } = useFormValidation(
    {
      nombreEmpresa: "",
      razonSocial: "",
      rut: "",
      email: "",
      telefono: "",
      password: "",
      confirmPassword: "",
    },
    individualValidationRules
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === "rutEmpresa") {
      const formatted = formatRut(e.target.value);
      e.target.value = formatted;
    }
    baseHandleChange(e);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateAll()) {
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField!)?.focus();
      return;
    }

    try {
      const payload = CompanyAdapter.toDTO(formData);
      const response = await registerCompany(payload);
        
      alert(response.message || "Registro exitoso. Revisa tu correo para verificar tu cuenta.");
      router.push("/auth/verify-email");
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

      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main
        className="flex-grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/ucnferia.png')" }}
      >
        <div
          className="flex-grow flex items-center justify-center backdrop-blur-sm 
          p-4 w-full h-full"
          style={{ backgroundColor: OVERLAY_COLOR }}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
            <div className="p-8">
              <div className="flex items-center justify-start pb-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-500 hover:text-gray-800 transition mr-4"
                  aria-label="Volver"
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-medium text-gray-800">
                  Registro empresa
                </h2>
              </div>
              <hr className="mb-6" />

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  id="nombreEmpresa"
                  label="Nombre Empresa"
                  placeholder="Ingresa el nombre de la empresa"
                  value={formData.nombreEmpresa}
                  onChange={handleChange}
                  onBlur={() => handleBlur("nombreEmpresa")}
                  error={errors.nombreEmpresa ?? undefined}
                  touched={touched.nombreEmpresa}
                />

                <FormField
                  id="razonSocial"
                  label="Razon Social"
                  placeholder="Ingresa la razon social"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  onBlur={() => handleBlur("razonSocial")}
                  error={errors.razonSocial ?? undefined}
                  touched={touched.razonSocial}
                />

                <div>
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 block mb-1">
                    Correo Empresarial *
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
                      placeholder="empresa@ejemplo.com"
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

                <button
                  type="submit"
                  className="w-full text-white rounded-md py-2 font-medium 
                transition mt-6 shadow-md hover:shadow-lg"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Crear Cuenta
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
                  className="text-blue-600 hover:underline transition"
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
