"use client";

import { useEffect, useState } from "react";
import {jobApplicationsService} from "@/services/jobApplicationService";
import Cookies from "js-cookie";

interface Application {
  id: number;
  studentName: string;
  studentEmail: string;
  offerTitle: string;
  status: string;
  applicationDate: string;
  curriculumVitae?: string;
  motivationLetter?: string;
}

export default function OffererApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = Cookies.get("authToken");

  useEffect(() => {
    async function load() {
      try {
        if (!token) {
          setError("No autenticado");
          return;
        }

        const res = await jobApplicationsService.getMyOfferApplications(token);

        setApplications(res?.data ?? []);
      } catch (e: any) {
        setError(e?.response?.data?.message || "No se pudieron cargar las postulaciones");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  async function updateStatus(id: number, newStatus: string) {
    if (!token) return;

    try {
      await jobApplicationsService.updateStatus(id, newStatus, token);

      setApplications((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, status: newStatus } : p
        )
      );
    } catch (e: any) {
      alert(e?.response?.data?.message || "Error al actualizar estado");
    }
  }

  if (loading) return <p className="p-6">Cargando postulaciones…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <main className="p-6 space-y-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Postulaciones Recibidas</h1>

      {applications.length === 0 ? (
        <p>No tienes postulaciones aún.</p>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              <h2 className="font-bold text-lg">{app.offerTitle}</h2>

              <p>
                👤 <b>{app.studentName}</b> • {app.studentEmail}
              </p>

              <p>
                📅 <b>Postuló:</b>{" "}
                {new Date(app.applicationDate).toLocaleDateString("es-CL")}
              </p>

              <p>
                📄 CV:{" "}
                {app.curriculumVitae ? (
                  <a
                    href={app.curriculumVitae}
                    className="text-blue-600 underline"
                    target="_blank"
                  >
                    Ver CV
                  </a>
                ) : (
                  "No cargado"
                )}
              </p>

              {app.motivationLetter && (
                <p>
                  📝 Carta: <i>{app.motivationLetter}</i>
                </p>
              )}

              <div className="mt-3 flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-gray-200 text-sm">
                  Estado: {app.status}
                </span>

                <button
                  onClick={() => updateStatus(app.id, "Aceptado")}
                  className="px-3 py-1 rounded-lg bg-green-600 text-white"
                >
                  Aceptar
                </button>

                <button
                  onClick={() => updateStatus(app.id, "Rechazado")}
                  className="px-3 py-1 rounded-lg bg-red-600 text-white"
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
