"use client";

import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { formatRut } from "src/utils/Util";
import { profileService, StudentProfileDTO } from "@/services/profileService";
import { validators } from "src/utils/AuthValidatorsUtil";
import { CVUpload } from "@/components/profile/CVUpload";
import ChangePassword from "@/components/profile/ChangePassword";

export default function Page() {
  const [data, setData] = useState<StudentProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | ""; text: string }>({ type: "", text: "" });
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [form, setForm] = useState({
    userName: "",
    name: "",
    lastName: "",
    rut: "",
    emailLocal: "",
    phoneNumber: "",
    aboutMe: "",
  });

  const profilePhotoRef = useRef<HTMLInputElement | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUploadStatus, setPhotoUploadStatus] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    profileService.getStudentProfile()
      .then((response) => {
        if (!mounted) return;
        if (response.data) {
          setData(response.data);
          const email = response.data.email || "";
          const local = email.includes("@") ? email.split("@")[0] : email;
          setForm({
            userName: response.data.userName || "",
            name: response.data.name || "",
            lastName: response.data.lastName || "",
            rut: response.data.rut || "",
            emailLocal: local,
            phoneNumber: response.data.phoneNumber || "",
            aboutMe: response.data.aboutMe || "",
          });
        } else setError(response.message || "Error al cargar perfil");
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Error de conexión");
      })
      .finally(() => mounted && setLoading(false));

    return () => { mounted = false; };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target as HTMLInputElement;
    let newValue = value;
    if (name === "rut") newValue = formatRut(value);
    if (name === "emailLocal" && newValue.includes("@")) newValue = newValue.split("@")[0];
    if (fieldErrors[name]) setFieldErrors((prev) => { const copy = { ...prev }; delete copy[name]; return copy; });
    setForm((prev) => ({ ...prev, [name]: newValue }));
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    const userNameError = validators.required(form.userName, "Nombre de usuario") ||
                          validators.minLenght(form.userName, 3, "Nombre de usuario") ||
                          validators.maxLenght(form.userName, 50, "Nombre de usuario");
    if (userNameError) errors.userName = userNameError;

    const nameError = validators.name(form.name, "Nombre");
    if (nameError) errors.name = nameError;

    const lastNameError = validators.name(form.lastName, "Apellido");
    if (lastNameError) errors.lastName = lastNameError;

    const rutError = validators.rut(form.rut);
    if (rutError) errors.rut = rutError;

    const emailError = validators.studentEmail(form.emailLocal, "Correo");
    if (emailError) errors.emailLocal = emailError;

    const phoneError = validators.phone(form.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;

    if (form.aboutMe && form.aboutMe.length > 500) errors.aboutMe = "La descripción no puede exceder 500 caracteres";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    setStatus({ type: "", text: "" });
    if (!validateForm()) return setStatus({ type: "error", text: "Por favor corrige los errores del formulario." });

    const emailFull = form.emailLocal.includes("@") ? form.emailLocal : `${form.emailLocal}@alumnos.ucn.cl`;

    const payload = {
      userName: form.userName,
      name: form.name,
      lastName: form.lastName,
      rut: form.rut,
      email: emailFull,
      phoneNumber: form.phoneNumber,
      aboutMe: form.aboutMe,
    };

    try {
      setSaving(true);
      const response = await profileService.updateStudentProfile(payload);
      setStatus({ type: "success", text: response.message || "Perfil actualizado" });

      setData((prev) => ({ ...prev!, ...payload }));
      setEditing(false);
      setFieldErrors({});
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.response?.data?.Message || err.message || "Error al guardar el perfil";
      setStatus({ type: "error", text: msg });
    } finally { setSaving(false); }
  }

  async function handleProfilePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;

    const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) return setPhotoUploadStatus(`Solo se permiten: ${allowedTypes.map(t => t.replace("image/", ".")).join(", ")}`);
    if (file.size > 5 * 1024 * 1024) return setPhotoUploadStatus("La imagen no puede superar 5MB");

    setUploadingPhoto(true); setPhotoUploadStatus(null);
    try {
      const response = await profileService.updateProfilePhoto({ photo: file });
      setPhotoUploadStatus("Foto actualizada correctamente");
      if (response.data) setData((prev) => ({ ...prev!, profilePhoto: response.data! }));
      setTimeout(() => setPhotoUploadStatus(null), 3000);
    } catch (err: any) { console.error(err); setPhotoUploadStatus(err.response?.data?.message || "Error al subir la foto"); }
    finally { setUploadingPhoto(false); }
  }

  function handlePasswordChangeSuccess() {
    setStatus({ type: "success", text: "Contraseña actualizada correctamente" });
    setTimeout(() => setStatus({ type: "", text: "" }), 5000);
  }

  const stars = 6;
  const rawRating = Number(data?.rating ?? 0);
  const rating = Number.isFinite(rawRating) ? Math.max(0, Math.min(stars, rawRating)) : 0;
  const percent = (rating / stars) * 100;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-white">Cargando perfil...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700">
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-2">Reintentar</Button>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-700 to-fuchsia-700 p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-white">Perfil — Estudiante</h1>

        <ChangePassword open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen} onSuccess={handlePasswordChangeSuccess} />

        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left box */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold overflow-hidden">
              {data?.profilePhoto ? (
                <img src={data.profilePhoto} alt="Foto de perfil" className="w-full h-full object-cover" />
              ) : <span className="text-gray-500">{data?.name?.charAt(0).toUpperCase() || "E"}</span>}
            </div>

            {editing && (
              <div className="w-full">
                <input ref={profilePhotoRef} type="file" accept="image/*" className="hidden" onChange={handleProfilePhotoChange} />
                <Button type="button" variant="outline" size="sm" onClick={() => profilePhotoRef.current?.click()} className="w-full text-xs" disabled={uploadingPhoto}>
                  {uploadingPhoto ? "Subiendo..." : "Cambiar foto"}
                </Button>
                {photoUploadStatus && <p className="text-xs text-center mt-1 text-muted-foreground">{photoUploadStatus}</p>}
              </div>
            )}

            <div className="text-lg font-medium">{data?.userName ?? "-"}</div>

            <div className="w-full flex flex-col gap-2 mt-4">
              {editing && <Button type="button" variant="outline" onClick={() => setPasswordDialogOpen(true)} className="w-full">Cambiar Contraseña</Button>}
              <Button type="button" variant="outline" onClick={() => editing ? handleSave() : setEditing(true)} className="w-full" disabled={saving}>
                {editing ? (saving ? "Guardando..." : "Guardar") : "Editar"}
              </Button>
            </div>

            <div className="w-full mt-6 pt-6 border-t">
              <CVUpload currentCVUrl={data?.curriculumVitae} onUploadSuccess={(url) => setData((prev) => prev ? { ...prev, curriculumVitae: url || undefined } : null)} />
            </div>
          </div>

          {/* Right box */}
          <div className="md:col-span-2 space-y-4">
            {status.text && (
              <div className={`p-3 mb-4 rounded-lg text-sm font-medium ${status.type === "error" ? "bg-red-100 text-red-700 border border-red-300" : "bg-green-100 text-green-700 border border-green-300"}`}>
                {status.text}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField label="Nombre de usuario" name="userName" value={form.userName} editing={editing} fieldErrors={fieldErrors} handleChange={handleChange} data={data?.userName} />
              <ProfileField label="Nombre" name="name" value={form.name} editing={editing} fieldErrors={fieldErrors} handleChange={handleChange} data={data?.name} />
              <ProfileField label="Apellido" name="lastName" value={form.lastName} editing={editing} fieldErrors={fieldErrors} handleChange={handleChange} data={data?.lastName} />
              <ProfileField label="RUT" name="rut" value={form.rut} editing={editing} fieldErrors={fieldErrors} handleChange={handleChange} data={data?.rut} />
              <ProfileField label="Correo electrónico" name="emailLocal" value={form.emailLocal} editing={editing} fieldErrors={fieldErrors} handleChange={handleChange} data={data?.email} colSpan={2} />
              <ProfileField label="Teléfono" name="phoneNumber" value={form.phoneNumber} editing={editing} fieldErrors={fieldErrors} handleChange={handleChange} data={data?.phoneNumber} colSpan={2} />
              <ProfileField label="Descripción" name="aboutMe" value={form.aboutMe} editing={editing} fieldErrors={fieldErrors} handleChange={handleChange} data={data?.aboutMe} textarea colSpan={2} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ProfileField({ label, name, value, editing, fieldErrors, handleChange, data, textarea = false, colSpan = 1 }: {
  label: string; name: string; value: string; editing: boolean;
  fieldErrors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  data?: string; textarea?: boolean; colSpan?: number;
}) {
  return (
    <div className={colSpan > 1 ? `md:col-span-${colSpan}` : ""}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      {editing ? (
        textarea ? (
          <>
            <Textarea name={name} value={value} onChange={handleChange} rows={6} maxLength={500} className={`resize-y min-h-32 ${fieldErrors[name] ? "border-red-500" : ""}`} placeholder={`Escribe ${label}...`} />
            {fieldErrors[name] && <p className="text-red-600 text-xs mt-1">{fieldErrors[name]}</p>}
          </>
        ) : (
          <>
            <Input name={name} value={value} onChange={handleChange} className={fieldErrors[name] ? "border-red-500" : ""} />
            {fieldErrors[name] && <p className="text-red-600 text-xs mt-1">{fieldErrors[name]}</p>}
          </>
        )
      ) : textarea ? (
        <div className="px-3 py-2 border rounded-md bg-gray-50 min-h-[100px] whitespace-pre-wrap">{data || "Sin descripción"}</div>
      ) : (
        <div className="px-3 py-2 border rounded-md bg-gray-50">{data || "-"}</div>
      )}
    </div>
  );
}