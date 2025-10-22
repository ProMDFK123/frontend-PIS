"use client";

import { useState } from "react";
import axios from "axios";

export default function VerifyEmailPage(){
    const [email, setEmail] = useState("");
    const [VerificationCode, setVerificationCode] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    
    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try{
            const response = await axios.post("/auth/verify-email", {
                email,
                VerificationCode,
            });
            setMessage(response.data.data);
        }catch(err: any){
            setError(err.response?.data?.message  || "Error verificando el correo");
        }finally{
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        setError("");
        setMessage("");

        try{
            const response = await axios.post("/auth/resend-verification", {email});
            setMessage(response.data.data);
        }catch(err: any){
            setError(err.response?.data?.message || "Error reenviando el código.");
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-blue-600
        px-4">
            {/* Logo */}
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-8">
                <div className="flex justify-center mb-6">
                    <img src="/feucn_logo.png" alt="Logo FEUCN"
                        className="w-24 h-24 rounded-full border-2 border-gray-300"/>
                </div>
                {/* Título */}
                <h2 className="text-center text-xl font-semibold mb-6">
                    Verificar Correo
                </h2>

                {/* Mensajes */}
                {message && (
                    <div className="bg-green-100 text-green-800 p-2 rounded mb-4
                    text-center">{message}</div>
                )}

                {/* Errores */}
                {error && (
                    <div className="bg-red-100 text-red-800 p-2 rounded mb-4
                    text-center">{error}</div>
                )}

                {/* Formulario */}
                <form onSubmit={handleVerifyEmail} className="space-y-4">
                    {/* Correo */}
                    <div>
                        <input
                            type="email"
                            placeholder="email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border rounded-md
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Código de Verificación */}
                    <div>
                        <input
                            type="text"
                            placeholder="******"
                            value={VerificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            required
                            pattern="\d{6}"
                            className="w-full px-4 py-2 border rounded-md 
                            focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-800 text-white py-2 rounded-md
                        hover:bg-blue-900 transition-colors"
                    >
                        {loading ? "Verificando..." : "Verificar correo"}
                    </button>
                </form>

                {/* Reenviar Código */}
                <div className="mt-4 text-center">
                    <button
                        onClick={handleResendCode}
                        disabled={loading}
                        className="text-blue-700 hover:underline text-sm"
                    >
                        Reenviar código
                    </button>
                </div>

                {/* Volver al Inicio */}
                <div className="mt-6 text-center">
                    <a href="/" className="text-gray-500 hover:underline text-sm">
                        ← Volver
                    </a>
                </div>
            </div>
        </div>
    );
}