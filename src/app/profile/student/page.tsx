"use client";

import React, { useEffect, useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import LogoutButton from "@/components/auth/LogoutButton";
import { formatRut } from "src/utils/Util";
import Cookies from "js-cookie";
import { getTokenFromCookie } from "@/lib";

type ProfileData = {
  userName?: string;
  name?: string;
  lastName?: string;
  rut?: string;
  email?: string;
  phoneNumber?: string;
  rating?: number;
  aboutMe?: string;
  curriculumVitae?: string;
};

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

  // form state
  const [form, setForm] = useState({
    userName: "",
    name: "",
    lastName: "",
    rut: "",
    emailLocal: "", // local part shown in input; domain displayed fixed
    phoneNumber: "",
    aboutMe: "",
    password: "",
    confirmPassword: "",
  });

  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const token = getTokenFromCookie();

    fetch("http://localhost:5185/api/user/profile/student", {headers: {Authorization: `Bearer ${token}`,},})
      .then((r) => r.json())
      .then((json) => {
        if (!mounted) return;
        if (json && json.data) {
          setData(json.data);
          const email = String(json.data.email ?? "");
          const local = email.includes("@") ? email.split("@")[0] : email;
          setForm({
            userName: json.data.userName ?? "",
            name: json.data.name ?? "",
            lastName: json.data.lastName ?? "",
            rut: json.data.rut ?? "",
            emailLocal: local,
            phoneNumber: json.data.phoneNumber ?? "",
            aboutMe: json.data.aboutMe ?? "",
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
    // if emailLocal contains @user entered domain, strip domain to keep only local part
    if (name === "emailLocal") {
      if (newValue.includes("@")) newValue = newValue.split("@")[0];
    }
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

    // build email: if user typed a full email (contains @) keep it; otherwise append @alumnos.ucn.cl
    let emailFull = form.emailLocal;
    if (!emailFull.includes("@")) emailFull = `${emailFull}@alumnos.ucn.cl`;

    const payload = {
      userName: form.userName,
      name: form.name,
      lastName: form.lastName,
      rut: form.rut,
      email: emailFull,
      phoneNumber: form.phoneNumber,
      aboutMe: form.aboutMe,
      password: form.password || undefined,
      confirmPassword: form.confirmPassword || undefined,
    };

    try {
      setSaving(true);
      const res = await fetch("/api/user/profile/student", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        setStatus({ type: "error", text: json.message || "Error al guardar" });
        return;
      }
      setStatus({
        type: "success",
        text: json.message || "Perfil actualizado",
      });
      // update local data
      setData((prev) => ({
        ...prev,
        userName: form.userName,
        email: emailFull,
        phoneNumber: form.phoneNumber,
        aboutMe: form.aboutMe,
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

  // upload CV (frontend attempts POST; backend implementation pending)
  async function uploadCV(file: File) {
    setUploading(true);
    setUploadStatus(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      // endpoint placeholder; backend must implement
      const res = await fetch("/api/user/profile/student/cv", {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(`Error ${res.status}`);
      const json = await res.json();
      setUploadStatus("CV subido correctamente.");
      // if backend returns URL, update data.curriculumVitae
      if (json && json.url)
        setData((prev) => ({ ...prev, curriculumVitae: json.url }));
    } catch (err: any) {
      console.warn("Upload failed (backend may not exist):", err);
      setUploadStatus(
        "No se pudo subir el CV. Implementa el endpoint en el backend."
      );
    } finally {
      setUploading(false);
    }
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setSelectedFile(f);
    if (f) uploadCV(f);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Perfil — Estudiante</h1>

      {loading ? (
        <div>Cargando...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left box */}
          <div className="col-span-1 border rounded-md px-6 py-8 flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold">
              {data.name ? data.name.charAt(0).toUpperCase() : "E"}
            </div>

            <div className="text-lg font-medium">{data.userName ?? "-"}</div>

            {/* Rating bar: 5 stars, colored proportionally */}
            <div className="w-full mt-2">
              <div className="relative inline-block whitespace-nowrap">
                {/* Gray stars (base) */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={`g-${i}`}
                      viewBox="0 0 20 20"
                      className="w-5 h-5 text-gray-300 flex-shrink-0"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.84-.197-1.54-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.642 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z" />
                    </svg>
                  ))}
                </div>

                {/* Yellow overlay clipped to rating percent */}
                <div
                  className="absolute top-0 left-0 overflow-hidden pointer-events-none"
                  style={{ width: `${((data.rating ?? 0) / 5) * 100}%` }}
                >
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={`y-${i}`}
                        viewBox="0 0 20 20"
                        className="w-5 h-5 text-yellow-400 flex-shrink-0"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.84-.197-1.54-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.642 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {(data.rating ?? 0).toFixed(1)} / 5
              </div>
            </div>

            <div className="w-full flex gap-2 mt-4">
              <Button
                onClick={() => {
                  if (editing) handleSave();
                  else {
                    setEditing(true);
                    setStatus({ type: "", text: "" });
                  }
                }}
                className="flex-1 text-white bg-(--primary)"
                disabled={saving}
              >
                {editing ? (saving ? "Guardando..." : "Guardar") : "Editar"}
              </Button>

              <LogoutButton className="flex-1 text-white bg-(--primary)">
                Salir
              </LogoutButton>
            </div>
          </div>

          {/* Right box */}
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Correo electrónico
                </label>
                {editing ? (
                  <div className="flex">
                    <Input
                      name="emailLocal"
                      value={form.emailLocal}
                      onChange={handleChange}
                      required
                    />
                    <span className="inline-flex items-center px-3 ml-2 rounded-md bg-gray-100">
                      @alumnos.ucn.cl
                    </span>
                  </div>
                ) : (
                  <Textarea
                    value={(data.email ?? "").split("@")[0] ?? ""}
                    readOnly
                  />
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Descripción
                </label>
                {editing ? (
                  <Textarea
                    name="aboutMe"
                    value={form.aboutMe}
                    onChange={handleChange}
                  />
                ) : (
                  <Textarea value={data.aboutMe ?? ""} readOnly />
                )}
              </div>
            </div>

            {/* CV upload placeholder removed from right box; moved below the grid */}
          </div>
        </div>
      )}

      {/* CV upload box (separate, below the main grid) */}
      <div className="mt-6 border rounded-md p-6">
        <h2 className="text-lg font-medium mb-3">Curriculum Vitae</h2>
        <div className="flex items-center gap-4">
          <Button
            className="bg-(--primary) text-white"
            onClick={() => fileRef.current?.click()}
          >
            Sube tu curriculum Vitae
          </Button>

          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handleFileSelected}
          />

          <div className="flex-1">
            {selectedFile && (
              <div>Archivo seleccionado: {selectedFile.name}</div>
            )}
            {uploading && <div>Subiendo CV...</div>}
            {uploadStatus && (
              <div className="text-sm text-muted-foreground mt-2">
                {uploadStatus}
              </div>
            )}
            {data.curriculumVitae && (
              <div className="mt-2">
                <a
                  href={data.curriculumVitae}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Ver CV actual
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
