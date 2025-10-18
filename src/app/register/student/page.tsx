"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

// Colores
const PRIMARY_COLOR = "#2C3E90"; // Color del botón
const OVERLAY_COLOR = "rgba(64, 64, 48, 0.4)"; // Color de la capa de opacidad.

export default function RegisterStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    email: "", // Manteniendo 'email' para el formato @alumnos.ucn.cl
    rut: "",
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
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Contenido Principal con Fondo y Capa Cálida */}
      <main
        className="flex-grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/ucnferia.png')" }} 
      >
        {/* Capa de Oscurecimiento y Desenfoque */}
        <div 
          className="flex-grow flex items-center justify-center backdrop-blur-sm 
          p-4 w-full h-full"
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
                  Registro estudiantes
                </h2>
              </div>
              <hr className="mb-6"/>

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
                    placeholder="Juan Pérez"
                    required
                    className="w-full border border-gray-300 rounded-md p-2 
                    text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Correo Electrónico (con sufijo @alumnos.ucn.cl) */}
                <div>
                  <label htmlFor="email" className="text-sm font-medium 
                  text-gray-700 block mb-1">
                    Correo electrónico
                  </label>
                  <div className="flex">
                    <input
                      id="email"
                      type="text"
                      name="email"
                      placeholder="ejemplo"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-l-md p-2 
                      text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <span className="border border-l-0 border-gray-300 
                    rounded-r-md p-2 bg-gray-100 text-gray-600 text-sm flex items-center">
                      @alumnos.ucn.cl
                    </span>
                  </div>
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
                    className="w-full border border-gray-300 rounded-md p-2 
                    text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-md p-2 
                    text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-md p-2 
                    text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-md p-2 
                    text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                {/* Botón Crear Cuenta */}
                <button
                  type="submit"
                  className="w-full text-white rounded-md py-2 font-medium 
                  transition mt-6"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Crear cuenta
                </button>
              </form>

              {/* Enlace login */}
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