"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();

  const roles = [
    {
      id: "student",
      title: "Estudiante",
      desc: "Regístrate como estudiante UCN",
    },
    {
      id: "individual",
      title: "Oferente Particular",
      desc: "Publica tus servicios o trabajos personales",
    },
    {
      id: "company",
      title: "Empresa",
      desc: "Crea una cuenta para publicar oportunidades laborales",
    },
    // Esta opción es auxiliar. Eliminar en cuanto se implemente el perfil de admin.
    {
      id: "admin",
      title: "Administrador",
      desc: "Gestión interna del sistema",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center 
    bg-blue-500 text-center px-4">
      {/* Logo */}
      <div className="relative w-24 h-24 mb-4">
        <Image
          src="/feucn_logo.png"
          alt="Logo FEUCN"
          fill
          className="rounded-full object-cover border-4 border-white"
        />
      </div>

      {/* Tarjeta central */}
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
        <h1 className="text-2xl font-bold mb-2">Selecciona tu tipo de cuenta</h1>
        <p className="text-gray-600 mb-6">
          Elige cómo deseas registrarte en BolsaUCN.
        </p>

        <div className="space-y-3">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => router.push(`/register/${role.id}`)}
              className="w-full py-3 px-4 rounded-xl border border-gray-300 
              hover:bg-blue-50 font-medium transition"
            >
              {role.title}
            </button>
          ))}
        </div>

        <p className="text-sm text-gray-600 mt-6">
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Inicia sesión aquí
          </a>
          .
        </p>
      </div>

      {/* Botón volver */}
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-2 rounded-full border border-white text-white 
        hover:bg-white hover:text-blue-600 transition"
      >
        ← Volver
      </button>
    </div>
  );
}