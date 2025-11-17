"use client";
import React from "react";
import ProfileCard from "../components/ProfileCard";

export default function AdminProfile() {
  const admin = {
    username: "admin_user",
    email: "admin@example.com",
    phone: "+57 300 000 0000",
    avatar: "/admin-avatar.png",
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Perfil - Administrador</h1>
      <ProfileCard
        avatarUrl={admin.avatar}
        username={admin.username}
        email={admin.email}
        phone={admin.phone}
      />
    </main>
  );
}
