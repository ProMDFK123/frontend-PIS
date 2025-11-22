"use client";

import { useState, ChangeEvent, FormEvent, ChangeEventHandler } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { registerStudent } from "@/services/authService";
import { StudentAdapter } from "@/services/adapters/authAdapter";
import { formatRut } from "src2/utils/Util"

const PRIMARY_COLOR = "#2C3E90";
const OVERLAY_COLOR = "rgba(64, 64, 48, 0.4)";

export default function RegisterStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    rut: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    discapacidad: "Ninguna",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name, value} = e.target;

    let newValue = value;

    if(name === "rut") newValue = formatRut(value);

    setFormData((prev) => ({...prev, [name]: newValue}));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const payload = StudentAdapter.toDTO(formData);
      const response = await registerStudent(payload);

      alert(response.message || "Registro exitoso.");
      router.push("/auth/verify-email");
    } catch (error: any) {
      console.error("Error en el registro:", error);

      const backendError = error?.response?.data;

      let errorMessage = "Error al registrarse. Por favor, inténtalo nuevamente.";

      if (backendError?.errors) {
        // Caso validaciones por campo (ej. RUT inválido)
        errorMessage = Object.entries(backendError.errors)
          .map(([field, messages]) => {
            // Opcional: reemplazar nombres de campo por algo más amigable
            const friendlyField = field === "Rut" ? "RUT" : field;
            return `${friendlyField}: ${(messages as string[]).join(", ")}`;
          })
          .join("\n");
      } else if (backendError?.message) {
        // Caso general con message y optional details
        errorMessage = backendError.message;
        if (backendError.details) {
          errorMessage += `\nDetalles: ${backendError.details}`;
        }
      }

      console.log(errorMessage);
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
                >
                  <ArrowLeft size={24} />
                </button>
                <h2 className="text-xl font-medium text-gray-800">
                  Registro estudiantes
                </h2>
              </div>
              <hr className="mb-6" />

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {renderInput("nombre", "Nombre", formData.nombre, handleChange, "text", "Juan")}
                {renderInput("apellido", "Apellido", formData.apellido, handleChange, "text", "Pérez")}
                <div className="flex items-center border border-gray-300 rounded-md px-2">
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example"
                    className="flex-grow p-2 text-sm focus:outline-none"
                  />
                  <span className="text-gray-600 text-sm">@alumnos.ucn.cl</span>
                </div>
                {renderInput("rut", "RUT", formData.rut, handleChange, "text", "12345678-9")}
                {renderInput("telefono", "Teléfono", formData.telefono, handleChange, "text", "+56912345678")}
                {renderInput("password", "Contraseña", formData.password, handleChange, "password", "••••••••")}
                {renderInput("confirmPassword", "Repetir Contraseña", formData.confirmPassword, handleChange, "password", "••••••••")}

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">
                    Discapacidad
                  </label>
                  <select
                    name="discapacidad"
                    value={formData.discapacidad}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Ninguna">Ninguna</option>
                    <option value="Visual">Visual</option>
                    <option value="Auditiva">Auditiva</option>
                    <option value="Motriz">Motriz</option>
                    <option value="Cognitiva">Cognitiva</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full text-white rounded-md py-2 font-medium transition mt-6"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Crear cuenta
                </button>
              </form>

              <p className="text-center text-sm mt-6 text-gray-600">
                ¿Tienes una cuenta?{" "}
                <a href="/login" className="text-blue-600 hover:underline transition">
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

function renderInput(
  name: string,
  label: string,
  value: string,
  onChange: (e: ChangeEvent<HTMLInputElement>) => void,
  type: string = "text",
  placeholder: string = ""
) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-gray-700 block mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
