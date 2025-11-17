"use client";
import React from "react";
import ProfileCard from "../components/ProfileCard";

export default function CompanyProfile() {
  const company = {
    username: "empresa_user",
    companyName: "Acme S.A.",
    razonSocial: "ACME INDUSTRIES S.A.S.",
    email: "contacto@acme.com",
    phone: "+57 322 222 2222",
    description: "Empresa dedicada a soluciones tecnológicas.",
    avatar: "/company-avatar.png",
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil - Empresa</h1>
      <ProfileCard
        avatarUrl={company.avatar}
        username={company.username}
        email={company.email}
        phone={company.phone}
      >
        <div>
          <p className="font-medium">
            Nombre de la empresa:{" "}
            <span className="font-normal">{company.companyName}</span>
          </p>
          <p className="font-medium mt-1">
            Razón social:{" "}
            <span className="font-normal">{company.razonSocial}</span>
          </p>
          <p className="mt-3">{company.description}</p>
        </div>
      </ProfileCard>
    </main>
  );
}
