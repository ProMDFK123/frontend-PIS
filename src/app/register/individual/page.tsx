"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Colores
const PRIMARY_COLOR = "#2C3E90"; // Color del botón
const OVERLAY_COLOR = "rgba(44, 114, 175, 0.4)"; // Color de la capa de opacidad.

export default function RegisterParticularPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
    if (formData.password !== formData.confirmPassword) {
      console.error("Las contraseñas no coinciden.");
      return;
    }
    // Lógica de registro para particular...
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Contenido Principal con Fondo y Capa Azul */}
      <main
        className="flex-grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/ucnferia.png')" }} 
      >
        {/* Capa de Oscurecimiento AZUL/CELESTE y Desenfoque */}
        <div 
          className="flex-grow flex items-center justify-center backdrop-blur-sm p-4 w-full h-full"
          style={{ backgroundColor: OVERLAY_COLOR }} 
        >
          {/* Contenedor del Formulario (Tarjeta) */}
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative">
            
            {/* Contenido interno de la Tarjeta */}
            <div className="p-8">
              {/* Contenedor del Título con Flecha */}
              <div className="flex items-center justify-start pb-4">
                {/* Botón Volver (Flecha Izquierda) */}
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="text-gray-500 hover:text-gray-800 transition mr-4"
                  aria-label="Volver"
                >
                  <ArrowLeft size={24} />
                </button>
                {/* Título */}
                <h2 className="text-xl font-medium text-gray-800">
                  Registro persona particular
                </h2>
              </div>
              <hr className="mb-6"/>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="text-sm font-medium text-gray-700 block mb-1">
                    Nombre
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    required
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* RUT */}
                <div>
                  <label htmlFor="rut" className="text-sm font-medium text-gray-700 block mb-1">
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
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Correo */}
                <div>
                  <label htmlFor="correo" className="text-sm font-medium text-gray-700 block mb-1">
                    Correo
                  </label>
                  <input
                    id="correo"
                    type="email"
                    name="correo"
                    placeholder="correo@example.com"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="text-sm font-medium text-gray-700 block mb-1">
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
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Repetir Contraseña */}
                <div>
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-1">
                    Repetir Contraseña
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Botón Crear Cuenta */}
                <button
                  type="submit"
                  className="w-full text-white rounded-md py-2 font-medium transition mt-6"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Crear Cuenta
                </button>
              </form>

              {/* Enlace de Inicio de Sesión */}
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
