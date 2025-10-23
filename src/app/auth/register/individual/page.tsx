"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { registerIndividual } from "@/services/authService";
import { IndividualRequestDto } from "@/services/dtos/authDto";

const PRIMARY_COLOR = "#2C3E90";
const OVERLAY_COLOR = "rgba(44, 114, 175, 0.4)";

export default function RegisterParticularPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    rut: "",
    correo: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    const payload: IndividualRequestDto = {
      Name: formData.nombre,
      LastName: formData.apellido,
      Email: formData.correo,
      Rut: formData.rut,
      PhoneNumber: formData.telefono,
      Password: formData.password,
      ConfirmPassword: formData.confirmPassword,
    };

    try {
      const response = await registerIndividual(payload);
      alert(response.message || "Registro exitoso.");
      router.push("/auth/verify-email");
    } catch (error: any) {
      console.error("Error al registrar:", error);
      alert(
        error.response?.data?.Message ||
          "Error al registrarse. Inténtalo nuevamente."
      );
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
                  Registro persona particular
                </h2>
              </div>
              <hr className="mb-6" />

              <form onSubmit={handleSubmit} className="space-y-4">
                <InputField
                  id="nombre"
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Juan"
                />
                <InputField
                  id="apellido"
                  label="Apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Pérez"
                />
                <InputField
                  id="rut"
                  label="RUT"
                  name="rut"
                  value={formData.rut}
                  onChange={handleChange}
                  placeholder="12345678-9"
                />
                <InputField
                  id="correo"
                  label="Correo"
                  name="correo"
                  type="email"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
                <InputField
                  id="telefono"
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="+56912345678"
                />
                <InputField
                  id="password"
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <InputField
                  id="confirmPassword"
                  label="Repetir Contraseña"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                />

                <button
                  type="submit"
                  className="w-full text-white rounded-md py-2 font-medium transition mt-6"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Crear Cuenta
                </button>
              </form>

              <p className="text-center text-sm mt-6 text-gray-600">
                ¿Tienes una cuenta?{" "}
                <a
                  href="/login"
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

// 🔹 Componente reutilizable para campos del formulario
interface InputFieldProps {
  id: string;
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

function InputField({
  id,
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-gray-700 block mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full border border-gray-300 rounded-md p-2 text-sm 
                   focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}
