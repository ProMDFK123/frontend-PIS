/**
 * Campo especializado para upload de imágenes
 * Incluye preview y validación
 */

import React from 'react';

interface ImageUploadFieldProps {
  name: string;
  label: string;
  fileName?: string;
  preview?: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ImageUploadField({
  name,
  label,
  fileName,
  preview,
  error,
  onChange,
}: ImageUploadFieldProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      <label className="flex-1 cursor-pointer">
        <div className="px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-1 text-sm text-gray-600">
            {fileName || 'Haz clic para seleccionar una imagen'}
          </p>
        </div>
        <input
          type="file"
          id={name}
          name={name}
          accept="image/*"
          onChange={onChange}
          className="hidden"
        />
      </label>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="Preview"
            className="max-h-48 rounded-lg shadow-md mx-auto"
          />
        </div>
      )}
    </div>
  );
}