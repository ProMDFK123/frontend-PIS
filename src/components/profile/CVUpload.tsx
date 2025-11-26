"use client";

import { useState } from "react";
import { FileUpload } from "@/components/ui/FileUpload";
import { cvService } from "@/services/cvService";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

interface CVUploadProps {
  currentCVUrl?: string | null;
  onUploadSuccess?: (url: string) => void;
}

export function CVUpload({ currentCVUrl, onUploadSuccess }: CVUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [uploadDate, setUploadDate] = useState<string | null>(null);

  const getFullUrl = (url: string): string => {
    if (url.startsWith("http")) {
      return url;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5185";
    return `${baseUrl}${url}`;
  };

  const handleViewCV = async () => {
    setLoading(true);
    try {
      const response = await cvService.getCV();
      
      if (response.data?.url) {
        const fullUrl = getFullUrl(response.data.url);
        window.open(fullUrl, "_blank");
      } else {
        toast.error(response.message || "No se pudo obtener el CV");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error al obtener el CV";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Selecciona un archivo primero");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await cvService.uploadCV(file);

      if (response.data) {
        toast.success("CV subido exitosamente");
        onUploadSuccess?.(response.data);
        setFile(null);
      } else {
        setError(response.message || "Error al subir el CV");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error al subir el archivo";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentCVUrl) return;

    setLoading(true);

    try {
      const response = await cvService.deleteCV();

      if (response.data) {
        toast.success("CV eliminado exitosamente");
        onUploadSuccess?.("");
      } else {
        setError(response.message || "Error al eliminar el CV");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Error al eliminar el archivo";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Curriculum Vitae (PDF)
      </label>

      {/* Current CV Display */}
      {currentCVUrl && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm text-green-700">CV cargado</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleViewCV}
              disabled={loading}
              className="text-sm text-blue-600 hover:underline disabled:opacity-50"
            >
              {loading ? "Cargando..." : "Ver"}
            </button>
            {/*<button
              onClick={handleDelete}
              disabled={loading}
              className="text-sm text-red-600 hover:underline disabled:opacity-50"
            >
              Eliminar
            </button>*/}
          </div>
        </div>
      )}

      {/* Upload Area */}
      <FileUpload
        accept=".pdf,application/pdf"
        maxSizeMB={10}
        onFileSelect={handleFileSelect}
        onError={setError}
        disabled={loading}
      />

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {/* Selected File Preview */}
      {file && (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-700">{file.name}</p>
              <p className="text-xs text-blue-500">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            onClick={() => setFile(null)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <Button
          onClick={handleUpload}
          disabled={loading}
          className="w-full"
          style={{ backgroundColor: "#6D5EF7" }}
        >
          {loading ? "Subiendo..." : "Subir CV"}
        </Button>
      )}
    </div>
  );
}