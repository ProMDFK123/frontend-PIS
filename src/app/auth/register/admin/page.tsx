"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { RegisterAdmin } from "@/services/authService";
import type { AdminRequestDto } from "@/services/dtos/authDto";
import { formatRut } from "src/utils/Util"

const PRIMARY_COLOR = "#2C3E90";

export default function RegisterAdminPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rut: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    superAdmin: false,
  });

  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({ type: "", text: "" });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    let newValue = type === "checkbox" ? checked : value;

    if(name === "rut") newValue = formatRut(value);

    setForm((prev) => ({...prev, [name]: newValue,}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (form.password !== form.confirmPassword) {
      setStatus({ type: "error", text: "Las contraseñas no coinciden." });
      return;
    }

    const payload: AdminRequestDto = {
      Email: form.correo,
      Password: form.password,
      ConfirmPassword: form.confirmPassword,
      Name: form.nombre,
      LastName: form.apellido,
      Rut: form.rut,
      PhoneNumber: form.telefono,
      SuperAdmin: form.superAdmin,
    };

    try {
      setLoading(true);
      const result = await RegisterAdmin(payload);

      if (!result.success) {
        setStatus({ type: "error", text: result.message });
        return;
      }

      setStatus({ type: "success", text: result.message });
      setTimeout(() => router.push("/auth/verify-email"), 2000);
    } catch (err) {
      console.error("Error en el registro:", err);
      setStatus({
        type: "error",
        text: "No se pudo conectar con el servidor. Intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100">
      <main
        className="flex-grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/ucnferia.png')" }}
      >
        <div className="flex-grow flex items-center justify-center bg-green-900/40 backdrop-blur-sm p-4 w-full h-full">
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

              {/* Mensajes */}
              {status.text && (
                <div
                  className={`p-3 mb-4 rounded-lg text-sm font-medium ${
                    status.type === "error"
                      ? "bg-red-100 text-red-700 border border-red-300"
                      : "bg-green-100 text-green-700 border border-green-300"
                  }`}
                >
                  {status.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { id: "nombre", label: "Nombre", type: "text", placeholder: "Juan" },
                  { id: "apellido", label: "Apellido", type: "text", placeholder: "Pérez" },
                  { id: "correo", label: "Correo", type: "email", placeholder: "email@example.com" },
                  { id: "rut", label: "RUT", type: "text", placeholder: "12345678-9" },
                  { id: "telefono", label: "Teléfono", type: "tel", placeholder: "+56912345678" },
                  { id: "password", label: "Contraseña", type: "password", placeholder: "••••••••" },
                  { id: "confirmPassword", label: "Repetir Contraseña", type: "password", placeholder: "••••••••" },
                ].map((field) => (
                  <div key={field.id}>
                    <label
                      htmlFor={field.id}
                      className="text-sm font-medium text-gray-700 block mb-1"
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      name={field.id}
                      value={(form as any)[field.id]}
                      onChange={handleChange}
                      placeholder={field.placeholder} // <--- aquí se agrega
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                    />
                  </div>
                ))}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="superAdmin"
                    name="superAdmin"
                    checked={form.superAdmin}
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
