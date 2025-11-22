import React from "react";
import Link from "next/link";

export default function ProfileIndex() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Perfiles de usuario</h1>
      <p className="mb-6">Selecciona el tipo de perfil que quieres ver:</p>
      <ul className="space-y-3">
        <li>
          <Link className="text-blue-600 underline" href="/profile/admin">
            Administrador
          </Link>
        </li>
        <li>
          <Link className="text-blue-600 underline" href="/profile/student">
            Estudiante
          </Link>
        </li>
        <li>
          <Link className="text-blue-600 underline" href="/profile/company">
            Empresa
          </Link>
        </li>
        <li>
          <Link className="text-blue-600 underline" href="/profile/individual">
            Persona natural
          </Link>
        </li>
      </ul>
    </main>
  );
}
