"use client";

import React, { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import LogoutButton from "@/components/auth/LogoutButton";
import { formatRut } from "src/utils/Util";

type ProfileData = {
  userName?: string;
  name?: string;
  lastName?: string;
  rut?: string;
  email?: string;
  phoneNumber?: string;
  aboutMe?: string;
};

// Usa la variable CSS --primary desde `globals.css` para colores primarios

export default function Page() {
  const [data, setData] = useState<ProfileData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({ type: "", text: "" });

  const [form, setForm] = useState({
    userName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch("/api/user/profile/admin")
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (json && json.success && json.data) {
          setData(json.data);
          setForm({
            userName: json.data.userName ?? "",
            email: json.data.email ?? "",
            phoneNumber: json.data.phoneNumber ?? "",
            password: "",
            confirmPassword: "",
          });
        } else setError(json?.message ?? "Error fetching profile");
      })
      .catch((err) => setError(String(err)))
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target as HTMLInputElement;
    let newValue = value;
    if (name === "rut") newValue = formatRut(value);
    setForm((prev) => ({ ...prev, [name]: newValue }));
  }

  async function handleSave() {
    setStatus({ type: "", text: "" });

    if (form.password || form.confirmPassword) {
      if (form.password !== form.confirmPassword) {
        setStatus({ type: "error", text: "Las contraseñas no coinciden." });
        return;
      }
    }

    const payload = {
      userName: form.userName,
      name: data.name ?? "",
      lastName: data.lastName ?? "",
      rut: data.rut ?? "",
      email: form.email,
      phoneNumber: form.phoneNumber,
      aboutMe: data.aboutMe ?? "",
      password: form.password || undefined,
      confirmPassword: form.confirmPassword || undefined,
      isSuperAdmin: false,
    };

    try {
      setSaving(true);
      const res = await fetch("/api/user/profile/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();

      if (!json.success) {
        // backend may return validation errors in `errors`
        const backendError = json;
        if (backendError?.errors) {
          const firstKey = Object.keys(backendError.errors)[0];
          const firstMessage = backendError.errors[firstKey][0];
          setStatus({ type: "error", text: firstMessage });
        } else {
          setStatus({
            type: "error",
            text: json.message || "Error al guardar",
          });
        }
        return;
      }

      // success
      setStatus({
        type: "success",
        text: json.message || "Perfil actualizado.",
      });
      setData((prev) => ({
        ...prev,
        userName: form.userName,
        email: form.email,
        phoneNumber: form.phoneNumber,
      }));
      setEditing(false);
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err: any) {
      console.error(err);
      setStatus({ type: "error", text: err?.message || "Error al guardar" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Perfil — Administrador</h1>

      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left box */}
          <div className="col-span-1 border rounded-md px-6 py-12 flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold">
              {data.name ? data.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="text-lg font-medium">{data.userName ?? "-"}</div>

            <div className="w-full flex gap-2 mt-4">
              <Button
                onClick={() => {
                  if (editing) {
                    // if currently editing, act as save
                    handleSave();
                  } else {
                    setEditing(true);
                    setStatus({ type: "", text: "" });
                  }
                }}
                className="flex-1 text-white bg-[var(--primary)]"
                variant={editing ? "secondary" : "secondary"}
                disabled={saving}
              >
                {editing ? (saving ? "Guardando..." : "Guardar") : "Editar"}
              </Button>

              <LogoutButton className="flex-1 text-white bg-[var(--primary)]">
                Salir
              </LogoutButton>
            </div>
          </div>

          {/* Right box spanning two columns */}
          <div className="col-span-1 md:col-span-2 border rounded-md p-6">
            {status.text && (
              <div
                className={`p-3 mb-4 rounded-lg text-sm font-medium ${
                  status.type === "error"
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-green-100 text-green-700 border border-green-300"
                }`}
              >
                {status.text}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nombre de usuario
                </label>
                {editing ? (
                  <Input
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <Textarea value={data.userName ?? ""} readOnly />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Correo electrónico
                </label>
                {editing ? (
                  <Input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <Textarea value={data.email ?? ""} readOnly />
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Teléfono
                </label>
                {editing ? (
                  <Input
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <Textarea value={data.phoneNumber ?? ""} readOnly />
                )}
              </div>

              {editing && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Contraseña
                    </label>
                    <Input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Nueva contraseña"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Confirmar contraseña
                    </label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repetir contraseña"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
