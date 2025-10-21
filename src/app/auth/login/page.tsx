"use client"

import {useState} from "react";
import {useRouter} from "next/navigation";

export default function LoginPage(){
    const router = useRouter();

    const [formData, setFormData] = useState({
        correo: "",
        password: "",
        rememberMe: false,
    });
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value, type, checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try{
            const payload = {
                Email: formData.correo,
                Password: formData.password,
                RememberMe: formData.rememberMe,
            };

            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5185/api";

            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if(!response.ok){
                const errorData = await response.json();
                console.error("Error al iniciar sesión:", errorData);
                alert(errorData.message || "Error al iniciar sesión.");
                return;
            }

            const data = await response.json();
            console.log("Login exitoso:", data);

            if(data.data){
                if(formData.rememberMe){
                    localStorage.setItem("token", data.data);
                } else {
                    sessionStorage.setItem("token", data.data);
                }
            }

            alert(data.message || "Login exitoso.");
            router.push("/");
        } catch (error){
            console.error("Error con la solicitud:", error);
            alert("No se pudo conectar con el servidor. Intente más tarde.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d8ef2]">
            {/* Tarjeta de Login */}
            <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl
            w-[360px] flex flex-col items-center relative">
                <div className="absolute -top-20 flex flex-col items-center">
                    {/* Logo de la FEUCN */}
                    <img
                        src="/feucn_logo.png"
                        alt="Logo FEUCN"
                        className="w-32 h-32 rounded-full border-4 border-white
                        shadow-md object-cover"
                    />
                </div>

                {/* Formulario */}
                <h2 className="text-2xl font-semibold text-white mt-16 mb-6">
                    Inicio de Sesión
                </h2>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    {/* Correo */}
                    <div>
                        <label className="block text-sm text-white mb-1">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            className="w-full px-3 py-2 rpunded-md border
                            border-gray-300 focus:outline-none focus:ring-2 
                            focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm text-white mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="********"
                            className="w-full px-3 py-2 rounded-md border 
                            border-gray-300 focus:outline-none focus:ring-2
                            focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Recordarme */}
                    <div className="flex items-center justify-between text-sm
                    text-white">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                className="accent-blue-500"
                            />
                            Recordarme
                        </label>

                        {/* Olvidé mi Contraseña */}
                        <a href="/auth/reset-password" className="hover:underline">
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* Mensajes de Error */}
                    {error && (
                        <p className="text-red-200 text-sm text-center mt-2">
                            {error}
                        </p>
                    )}

                    {/* Botón de Login */}
                    <button
                        type="submit"
                        className="w-full bg-[#1f2937] text-white py-2 rounded-md
                        hover:bg-[#374151] transition duration-200"
                    >
                        Iniciar Sesión
                    </button>
                </form>

                {/* Registro */}
                <p className="text-sm text-white mt-4">
                    ¿No tienes una cuenta?{" "}
                    <a href="/auth/register" className="underline hover:text-gray-200">
                        Crea una aquí
                    </a>
                </p>

                {/* Volver al Inicio */}
                <button
                    onClick={() => router.push("/")}
                    className="mt-6 px-4 py-2 bg-transparent border border-white
                    text-white rounded-md hover:bg-white hover:text-[#0d8ef2]
                    transition">
                    ← Volver
                </button>
            </div>
        </div>
    );
}