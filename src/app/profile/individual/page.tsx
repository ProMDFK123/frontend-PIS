"use client";
import React from "react";
import ProfileCard from "../components/ProfileCard";

export default function IndividualProfile() {
  const individual = {
    username: "persona_natural",
    email: "persona@example.com",
    phone: "+57 333 333 3333",
    description: "Descripción breve de la persona natural.",
    avatar: "/individual-avatar.png",
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil - Persona natural</h1>
      <ProfileCard
        avatarUrl={individual.avatar}
        username={individual.username}
        email={individual.email}
        phone={individual.phone}
      >
        <div>
          <p>{individual.description}</p>
        </div>
      </ProfileCard>
    </main>
  );
}
