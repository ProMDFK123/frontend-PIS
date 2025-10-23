"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { registerCompany } from "@/services/authService";
import { CompanyRequestDto } from "@/services/dtos/authDto";

const PRIMARY_COLOR = "#2C3E90";
const OVERLAY_COLOR = "rgba(44, 114, 175, 0.4)";

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    razonSocial: "",
    rutEmpresa: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Las contraseñas no coinciden." });
      return;
    }

    try {
      const payload: CompanyRequestDto = {
        CompanyName: formData.nombre,
        LegalName: formData.razonSocial,
        Email: formData.correo,
        Rut: formData.rutEmpresa,
        PhoneNumber: formData.telefono,
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword,
      };

      const result = await registerCompany(payload);
      setMessage({ type: "success", text: result.message });
      setTimeout(() => router.push("/auth/verify-email"), 1500);
    } catch (error: any) {
      console.error("Error al registrar empresa:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "No se pudo completar el registro. Intenta nuevamente.",
      });
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

              {message && (
                <div
                  className={`p-3 mb-4 rounded-md text-sm font-medium ${
                    message.type === "error"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-green-100 text-green-700 border border-green-300"
                  }`}
                  role="alert"
                >
                  {message.text}
                </div>
              )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {[ 
                { id: "nombre", label: "Nombre", type: "text", placeholder: "Empresa Inc." },
                { id: "razonSocial", label: "Razón social", type: "text", placeholder: "Empresa S.A." },
                { id: "rutEmpresa", label: "RUT Empresa", type: "text", placeholder: "12345678-9" },
                { id: "correo", label: "Correo", type: "email", placeholder: "correo@empresa.cl" },
                { id: "telefono", label: "Teléfono", type: "tel", placeholder: "+56912345678" },
              ].map(({ id, label, type, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700 block mb-1"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type={type}
                    placeholder={placeholder}
                    value={(formData as any)[id]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 
                    text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}

              {/* Contraseñas */}
              {[
                { id: "password", label: "Contraseña", placeholder: "••••••••" },
                { id: "confirmPassword", label: "Repetir Contraseña", placeholder: "••••••••" },
              ].map(({ id, label, placeholder }) => (
                <div key={id}>
                  <label
                    htmlFor={id}
                    className="text-sm font-medium text-gray-700 block mb-1"
                  >
                    {label}
                  </label>
                  <input
                    id={id}
                    name={id}
                    type="password"
                    placeholder={placeholder} // <- agregado
                    value={(formData as any)[id]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 
                    text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}

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
