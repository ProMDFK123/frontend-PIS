/**
 * Componente genérico de campo de formulario
 * Maneja input, textarea, select con label y error
 */

import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: 'text' | 'textarea' | 'select' | 'date' | 'file';
  value?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  accept?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  error,
  required = false,
  placeholder,
  options,
  rows = 4,
  accept,
  onChange,
  className = '',
}: FormFieldProps) {
  const baseInputClasses = `w-full px-4 py-3 rounded-lg border ${
    error ? 'border-red-500' : 'border-gray-300'
  } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`;

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && '*'}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`${baseInputClasses} resize-none`}
          placeholder={placeholder}
        />
      ) : type === 'select' ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`${baseInputClasses} bg-white`}
        >
          <option value="">Selecciona una opción</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          accept={accept}
          className={baseInputClasses}
          placeholder={placeholder}
        />
      )}

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}