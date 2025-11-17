"use client";
import React, { useState } from "react";
import ProfileCard from "../components/ProfileCard";

export default function StudentProfile() {
  const student = {
    username: "estudiante_1",
    email: "estudiante@example.com",
    phone: "+57 311 111 1111",
    avatar: "/student-avatar.png",
  };

  const [cv, setCv] = useState<File | null>(null);
  const [letter, setLetter] = useState<File | null>(null);

  function onCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCv(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  }

  function onLetterChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLetter(e.target.files && e.target.files[0] ? e.target.files[0] : null);
  }

  function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    // Aquí sólo mostramos los nombres de archivo. Integrar con backend para subida real.
    alert(
      `CV: ${cv ? cv.name : "No seleccionado"}\nCarta: ${
        letter ? letter.name : "No seleccionada"
      }`
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil - Estudiante</h1>
      <ProfileCard
        avatarUrl={student.avatar}
        username={student.username}
        email={student.email}
        phone={student.phone}
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block font-medium">Subir CV (PDF o DOC)</label>
            <input type="file" accept=".pdf,.doc,.docx" onChange={onCvChange} />
            {cv && <p className="text-sm">Seleccionado: {cv.name}</p>}
          </div>
          <div>
            <label className="block font-medium">Carta de motivación</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={onLetterChange}
            />
            {letter && <p className="text-sm">Seleccionada: {letter.name}</p>}
          </div>
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Guardar / Subir
            </button>
          </div>
        </form>
      </ProfileCard>
    </main>
  );
}
