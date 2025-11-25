import { ChangeEvent } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormFieldProps {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    error?: string;
    touched?: boolean;
    description?: string;
    required?: boolean;
}

export function FormField({
    id,
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    onBlur,
    error,
    touched = false,
    description,
    required = true,
}: FormFieldProps) {
    const hasValue = value.trim().length > 0;
    const isValid = touched && hasValue && !error;
    const showError = touched && error;

    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-gray-700 block mb-1">
                {label} {required && "*"}
            </label>
            <input
                id={id}
                name={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                className={`w-full border ${
                    showError ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
            />
        
            {description && !showError && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
        
            {showError && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                    {error}
                </p>
            )}
        
            {isValid && (
                <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    Válido
                </p>
            )}
        </div>
    );
}