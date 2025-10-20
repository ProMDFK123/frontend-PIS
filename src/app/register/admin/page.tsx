"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const PRIMARY_COLOR = "#2C3E90"; // Color principal del botón

export default function RegisterAdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rut: "",
    telefono: "",
    password: "",
    confirmPassword: "",
    superAdmin: false,
  });

  const [message, setMessage] = useState({ type: '', text: '' }); // Para mensajes de error/éxito

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

    try {
      const payload = {
        Email: formData.correo,
        Password: formData.password,
        ConfirmPassword: formData.confirmPassword,
        Name: formData.nombre,
        LastName: formData.apellido,
        Rut: formData.rut,
        PhoneNumber: formData.telefono,
        SuperAdmin: formData.superAdmin,
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5185/api";

      const response = await fetch(`${API_URL}/auth/register/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en el registro:", errorData);
        alert(errorData.message || "Error al registrar administrador.");
        return;
      }

      const data = await response.json();
      console.log("Registro exitoso:", data);
      alert(data.message || "Administrador registrado con éxito.");
      router.push("/"); // o la ruta que prefieras

    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("No se pudo conectar con el servidor. Intenta nuevamente más tarde.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-100">
      {/* Contenido Principal con Fondo */}
      <main
        className="flex-grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/ucnferia.png')" }} 
      >
        {/* Capa de Oscurecimiento y Desenfoque*/}
        <div className="flex-grow flex items-center justify-center 
        bg-green-900/40 backdrop-blur-sm p-4 w-full h-full">
          {/* Contenedor del Formulario (Tarjeta) */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md 
          relative animate-in zoom-in duration-300">
            
            {/* Contenido interno de la Tarjeta */}
            <div className="p-8 sm:p-10">
              {/* Contenedor del Título con Flecha */}
              <div className="flex items-center justify-start pb-4">
                {/* Botón Volver (Flecha Izquierda) */}
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-500 hover:text-blue-700 transition mr-4 
                  p-2 -ml-2 rounded-full hover:bg-gray-100"
                  aria-label="Volver"
                >
                  <ArrowLeft size={24} />
                </button>
                {/* Título */}
                <h2 className="text-2xl font-bold text-gray-800">
                  Registro de Administrador
                </h2>
              </div>
              <hr className="mb-6 border-gray-200"/>

              {/* Mensajes de Alerta */}
              {message.text && (
                <div 
                  className={`p-3 mb-4 rounded-lg text-sm font-medium ${
                    message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-300' : 
                    'bg-green-100 text-green-700 border border-green-300'
                  }`}
                  role="alert"
                >
                  {message.text}
                </div>
              )}

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="text-sm font-medium 
                  text-gray-700 block mb-1">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Juan Perez"
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                    transition duration-150"
                  />
                </div>

                {/* Correo */}
                <div>
                  <label htmlFor="correo" className="text-sm font-medium 
                  text-gray-700 block mb-1">
                    Correo
                  </label>
                  <input
                    id="correo"
                    type="email"
                    name="correo"
                    placeholder="correo@ucn.cl"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                    transition duration-150"
                  />
                </div>

                {/* RUT */}
                <div>
                  <label htmlFor="rut" className="text-sm font-medium 
                  text-gray-700 block mb-1">
                    RUT
                  </label>
                  <input
                    id="rut"
                    type="text"
                    name="rut"
                    placeholder="12.345.678-9"
                    value={formData.rut}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                    transition duration-150"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="text-sm font-medium 
                  text-gray-700 block mb-1">
                    Teléfono
                  </label>
                  <input
                    id="telefono"
                    type="tel"
                    name="telefono"
                    placeholder="+56912345678"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                    transition duration-150"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="password" className="text-sm font-medium 
                  text-gray-700 block mb-1">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                    transition duration-150"
                  />
                </div>

                {/* Repetir Contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="text-sm font-medium 
                  text-gray-700 block mb-1">
                    Repetir Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-3 
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                    transition duration-150"
                  />
                </div>

                {/* SuperAdmin */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="superAdmin"
                    name="superAdmin"
                    checked={formData.superAdmin}
                    onChange={(e) => 
                      setFormData((prev) => ({ ...prev, superAdmin: e.target.checked}))
                    }
                  />
                  <label htmlFor="superAdmin" className="text-sm text-gray-700">
                    ¿Es SuperAdmin?
                  </label>
                </div>

                {/* Botón Crear Cuenta */}
                <button
                  type="submit"
                  className="w-full text-white rounded-lg py-3 font-semibold 
                  transition duration-150 hover:opacity-90 shadow-md hover:shadow-lg mt-6"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Crear Cuenta
                </button>
              </form>

              {/* Enlace de Inicio de Sesión */}
              <p className="text-center text-sm mt-6 text-gray-600">
                ¿Tienes una cuenta?{" "}
                <a href="/login" onClick={(e) => { e.preventDefault(); router.push('/login'); }} className="text-blue-600 font-medium hover:underline transition">
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
