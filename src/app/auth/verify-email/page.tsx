"use client";

import { useState } from "react";
import { verifyEmail, resendVerification } from "@/services/authService";
import type { VerifyEmailDto } from "@/services/dtos/authDto";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const payload: VerifyEmailDto = {
      VerificationCode: code,
    };

    try {
      const result = await verifyEmail(payload);
      setMessage(result.data || result.message);
    } catch (err: any) {
      console.error("Error verificando el correo:", err);
      setError(err.message || "Error verificando el correo. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await resendVerification();
      setMessage(result.data || result.message);
    } catch (err: any) {
      console.error("Error reenviando el código:", err);
      setError(err.message || "No se pudo reenviar el código. Intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-600 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/feucn_logo.png"
            alt="Logo FEUCN"
            className="w-24 h-24 rounded-full border-2 border-gray-300"
          />
        </div>

        {/* Título */}
        <h2 className="text-center text-xl font-semibold mb-6">
          Verificar Correo
        </h2>

        {/* Mensajes */}
        {message && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-center">
            {message}
          </div>
        )}

        {/* Errores */}
        {error && (
          <div className="bg-red-100 text-red-800 p-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <div>
            <input
              type="text"
              name="VerificationCode"
              placeholder="******"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              pattern="\d{6}"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition-colors disabled:opacity-60"
          >
            {loading ? "Verificando..." : "Verificar correo"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={handleResendCode}
            disabled={loading}
            className="text-blue-700 hover:underline text-sm disabled:opacity-60"
          >
            Reenviar código
          </button>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-gray-500 hover:underline text-sm">
            ← Volver
          </a>
        </div>
      </div>
    </div>
  );
}
