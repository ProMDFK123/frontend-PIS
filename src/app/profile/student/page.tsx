"use client";

import React, { useEffect, useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { formatRut } from "src/utils/Util";
import { profileService, StudentProfileDTO } from "@/services/profileService";
import { validators } from "src/utils/AuthValidatorsUtil";
import ChangePassword from "@/components/profile/ChangePassword";


export default function Page() {
  const [data, setData] = useState<StudentProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({ type: "", text: "" });

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

  // Manejo de subida de archivos (Foto de perfil)
  const profilePhotoRef = useRef<HTMLInputElement | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoUploadStatus, setPhotoUploadStatus] = useState<string | null>(null);

  // Manejo de subida de archivos (CV)
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  //Errores del formulario
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    profileService
      .getStudentProfile()
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
        } else {
          setError(response.message || "Error al cargar perfil");
        }
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setError(err.response?.data?.message || "Error de conexión");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

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
    if (name === "emailLocal") {
      if (newValue.includes("@")) newValue = newValue.split("@")[0];
    }
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    setForm((prev) => ({ ...prev, [name]: newValue }));
  }

  // Validación de campos
  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    // Nombre de usuario
    const userNameError = validators.required(form.userName, "Nombre de usuario") ||
                          validators.minLenght(form.userName, 3, "Nombre de usuario") ||
                          validators.maxLenght(form.userName, 50, "Nombre de usuario");
    if (userNameError) errors.userName = userNameError;

    // Nombre
    const nameError = validators.name(form.name, "Nombre");
    if (nameError) errors.name = nameError;

    // Apellido
    const lastNameError = validators.name(form.lastName, "Apellido");
    if (lastNameError) errors.lastName = lastNameError;

    // RUT
    const rutError = validators.rut(form.rut);
    if (rutError) errors.rut = rutError;

    // Correo
    const emailError = validators.studentEmail(form.emailLocal, "Correo");
    if (emailError) errors.emailLocal = emailError;

    // Teléfono
    const phoneError = validators.phone(form.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;

    // Descripción
    if (form.aboutMe && form.aboutMe.length > 500) {
      errors.aboutMe = "La descripción no puede exceder 500 caracteres";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSave() {
    setStatus({ type: "", text: "" });

    if (!validateForm()) {
      setStatus({ 
        type: "error", 
        text: "Por favor corrige los errores del formulario." 
      });
      return;
    }

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
    };

    try {
      setSaving(true);
      const response = await profileService.updateStudentProfile(payload);
      
      setStatus({
        type: "success",
        text: response.message || "Perfil actualizado",
      });


      setData((prev) => ({
        ...prev!,
        userName: form.userName,
        name: form.name,
        lastName: form.lastName,
        rut: form.rut,
        email: emailFull,
        phoneNumber: form.phoneNumber,
        aboutMe: form.aboutMe,
      }));

      setEditing(false);
      setForm((prev) => ({ ...prev, password: "", confirmPassword: "" }));
      setFieldErrors({});
    } catch (err: any) {
      console.error(err);

      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.Message ||
                          err.message || 
                          "Error al guardar el perfil";

      setStatus({ type: "error", text: errorMessage });
    } finally {
      setSaving(false);
    }
  }

  async function handleProfilePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      const extensions = allowedTypes.map(t => t.replace("image/", ".")).join(", ");
      setPhotoUploadStatus(`Solo se permiten: ${extensions}`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoUploadStatus("La imagen no puede superar 5MB");
      return;
    }

    setUploadingPhoto(true);
    setPhotoUploadStatus(null);

    const payload = { photo: file };

    try {
      const response = await profileService.updateProfilePhoto(payload);
      
      setPhotoUploadStatus("Foto actualizada correctamente");
      
      if (response.data) {
        setData((prev) => ({
          ...prev!,
          profilePhoto: response.data!,
        }));
      }

      setTimeout(() => setPhotoUploadStatus(null), 3000);
    } catch (err: any) {
      console.error("Photo upload failed:", err);
      setPhotoUploadStatus(
        err.response?.data?.message || "Error al subir la foto"
      );
    } finally {
      setUploadingPhoto(false);
    }
  }

  // TODO: backend
  /*
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
  */

  function handlePasswordChangeSuccess() {
    setStatus({
      type: "success",
      text: "Contraseña actualizada correctamente",
    });
    setTimeout(() => setStatus({ type: "", text: "" }), 5000);
  }

  //Rating
  const stars = 6;
  const rawRating = Number(data?.rating ?? 0);
  const rating = Number.isFinite(rawRating) ? Math.max(0, Math.min(stars, rawRating)) : 0;
  const percent = (rating / stars) * 100;

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Perfil — Estudiante</h1>

      {/*Cambio contraseña*/}
      <ChangePassword
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onSuccess={handlePasswordChangeSuccess}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left box - Avatar & Actions */}
        <div className="col-span-1 border rounded-md px-6 py-8 flex flex-col items-center gap-4">
          {/* Profile Picture */}
          <div className="relative w-28 h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-3xl font-bold overflow-hidden">
            {data?.profilePhoto ? (
              <img
                src={data.profilePhoto}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-500">
                {data?.name ? data.name.charAt(0).toUpperCase() : "E"}
              </span>
            )}
          </div>

          {editing && (
            <div className="w-full">
              <input
                ref={profilePhotoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePhotoChange}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => profilePhotoRef.current?.click()}
                className="w-full text-xs"
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? "Subiendo..." : "Cambiar foto"}
              </Button>
              {photoUploadStatus && (
                <p className="text-xs text-center mt-1 text-muted-foreground">
                  {photoUploadStatus}
                </p>
              )}
            </div>
          )}

          <div className="text-lg font-medium">{data?.userName ?? "-"}</div>

          {/* Rating stars */}
          <div className="w-full flex flex-col items-center justify-center my-4">
            <div className="relative inline-flex">
              {/* Gray background stars */}
              <div className="flex gap-1">
                {Array.from({ length: stars }).map((_, i) => (
                  <svg
                    key={`g-${i}`}
                    viewBox="0 0 20 20"
                    className="w-8 h-8 text-gray-300 shrink-0"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.84-.197-1.54-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.642 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z" />
                  </svg>
                ))}
              </div>
              {/* Yellow overlay stars */}
              <div
                className="absolute top-0 left-0 h-full flex gap-1 pointer-events-none overflow-hidden"
                style={{ width: `${percent}%` }}
                aria-hidden
              >
                {Array.from({ length: stars }).map((_, i) => (
                  <svg
                    key={`y-${i}`}
                    viewBox="0 0 20 20"
                    className="w-8 h-8 text-yellow-400 shrink-0"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.455a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.455c-.784.57-1.84-.197-1.54-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.642 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.05 2.927z" />
                  </svg>
                ))}
              </div>
              <div className="sr-only">Valoración: {rating.toFixed(1)} de {stars}</div>
            </div>
            <div className="text-base text-muted-foreground mt-2 font-semibold text-center">
              {rating.toFixed(1)} / {stars}
            </div>
          </div>

          <div className="w-full flex flex-col gap-2 mt-4">
            {editing && (
              <div className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPasswordDialogOpen(true)}
                  className="w-full"
                >
                  Cambiar Contraseña
                </Button>
              </div>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (editing) {
                  handleSave();
                } else {
                  setEditing(true);
                  setStatus({ type: "", text: "" });
                }
              }}
              className="w-full flex text-white bg-(--primary) text-xs"
              disabled={saving}
            >
              {editing ? (saving ? "Guardando..." : "Guardar") : "Editar"}
            </Button>
          </div>
        </div>

        {/* Right box - Profile Fields */}
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
            {/*Nombre de Usuario*/}
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre de usuario
              </label>
              {editing ? (
                <>
                  <Input
                    name="userName"
                    value={form.userName}
                    onChange={handleChange}
                    className={fieldErrors.userName ? "border-red-500" : ""}
                  />
                  {fieldErrors.userName && (
                    <p className="text-red-600 text-xs mt-1">{fieldErrors.userName}</p>
                  )}
                </>
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50">
                  {data?.userName ?? "-"}
                </div>
              )}
            </div>

            <div>
              {/*Nombre*/}
              <label className="block text-sm font-medium mb-1">Nombre</label>
              {editing ? (
                <>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={fieldErrors.name ? "border-red-500" : ""}
                  />
                  {fieldErrors.name && (
                    <p className="text-red-600 text-xs mt-1">{fieldErrors.name}</p>
                  )}
                </>
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50">
                  {data?.name ?? "-"}
                </div>
              )}
            </div>

            <div>
              {/*Apellido*/}
              <label className="block text-sm font-medium mb-1">Apellido</label>
              {editing ? (
                <>
                  <Input
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    className={fieldErrors.lastName ? "border-red-500" : ""}
                  />
                  {fieldErrors.lastName && (
                    <p className="text-red-600 text-xs mt-1">{fieldErrors.lastName}</p>
                  )}
                </>
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50">
                  {data?.lastName ?? "-"}
                </div>
              )}
            </div>

            <div>
              {/*RUT*/}
              <label className="block text-sm font-medium mb-1">RUT</label>
              {editing ? (
                <>
                  <Input
                    name="rut"
                    value={form.rut}
                    onChange={handleChange}
                    className={fieldErrors.rut ? "border-red-500" : ""}
                  />
                  {fieldErrors.rut && (
                    <p className="text-red-600 text-xs mt-1">{fieldErrors.rut}</p>
                  )}
                </>
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50">
                  {data?.rut ?? "-"}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              {/*Correo*/}
              <label className="block text-sm font-medium mb-1">
                Correo electrónico
              </label>
              {editing ? (
                <>
                  <div className="flex">
                    <Input
                      name="emailLocal"
                      value={form.emailLocal}
                      onChange={handleChange}
                      className={`rounded-r-none ${fieldErrors.emailLocal ? "border-red-500" : ""}  `}
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md bg-gray-100 border border-l-0">
                      @alumnos.ucn.cl
                    </span>
                  </div>
                  {fieldErrors.emailLocal && (
                    <p className="text-red-600 text-xs mt-1">{fieldErrors.emailLocal}</p>
                  )}
                </> 
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50">
                  {data?.email ?? "-"}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              {/*Teléfono*/}
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              {editing ? (
                <>
                  <Input
                    name="phoneNumber"
                    type="tel"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className={fieldErrors.phoneNumber ? "border-red-500" : ""}
                  />
                  {fieldErrors.phoneNumber && (
                    <p className="text-red-600 text-xs mt-1">{fieldErrors.phoneNumber}</p>
                  )}
                </> 
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50">
                  {data?.phoneNumber ?? "-"}
                </div>
              )}
            </div>

            <div className="md:col-span-2">
              {/*Descripción*/}
              <label className="block text-sm font-medium mb-1">
                Descripción
              </label>
              {editing ? (
                <>
                  <Textarea
                    name="aboutMe"
                    value={form.aboutMe}
                    onChange={handleChange}
                    rows={10}
                    maxLength={500}
                    className={`resize-y min-h-40 max-h-[400px] ${fieldErrors.aboutMe ? "border-red-500" : ""}`}
                    placeholder="Cuéntanos sobre ti (máximo 500 caracteres)..."
                  />
                  <div className="flex justify-between mt-1">
                    <div className="flex-1">
                      {fieldErrors.aboutMe && (
                        <p className="text-red-600 text-xs">{fieldErrors.aboutMe}</p>
                      )}
                    </div>
                    <p className="text-gray-500 text-xs text-right">
                      {form.aboutMe.length}/500
                    </p>
                  </div>
                </>
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50 min-h-[100px] whitespace-pre-wrap wrap-break-word overflow-wrap-anywhere">
                  {data?.aboutMe || "Sin descripción"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CV upload section
      
      <div className="mt-6 border rounded-md p-6">
        <h2 className="text-lg font-medium mb-3">Curriculum Vitae</h2>
        <div className="flex items-center gap-4">
          <Button onClick={() => fileRef.current?.click()}>
            Subir CV (PDF)
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
              <div className="text-sm">Archivo: {selectedFile.name}</div>
            )}
            {uploading && <div className="text-sm">Subiendo...</div>}
            {uploadStatus && (
              <div className="text-sm text-muted-foreground mt-2">
                {uploadStatus}
              </div>
            )}
            {data?.curriculumVitae && (
              <div className="mt-2">
                <a
                  href={data.curriculumVitae}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Ver CV actual →
                </a>
              </div>
            )}
          </div>
        </div>
      </div>*/}
    </div>
  );
}