"use client";

import Navbar from "../components/shared/NavBar";
import { Button } from "src/components/ui";
//import { useFetch } from "@/hooks/Hook";
import { formatDate } from "src2/utils/Util";
import { User } from "src/interfaces/Interface";
/**
export default function HomeView() {
  const { data, loading, error } = useFetch<User[]>("/users");

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="p-6">
        <h1 className="text-3xl font-bold mb-4">Usuarios</h1>

        {loading && <p>Cargando...</p>}
        {error && <p className="text-red-500">Error al cargar datos</p>}
        <ul className="space-y-2">
          {data?.map((user) => (
            <li key={user.id} className="p-3 bg-white rounded shadow">
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500 text-sm">
                Registrado: {formatDate(user.createdAt)}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Button>Agregar usuario</Button>
        </div>
      </main>
    </div>
  );
}
  */