import { ChangeEvent, useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { getPasswordStrength } from "@/utils/AuthValidatorsUtil";

interface PasswordFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur: () => void;
    error?: string;
    touched?: boolean;
    showStrength?: boolean;
    placeholder?: string;
}

export function PasswordField({
    id,
    label,
    value,
    onChange,
    onBlur,
    error,
    touched = false,
    showStrength = false,
    placeholder = "••••••••",
}: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);
    const passwordStrength = showStrength && value ? getPasswordStrength(value) : null;

    return (
        <div>
            <label htmlFor={id} className="text-sm font-medium text-gray-700 block mb-1">
                {label} *
            </label>
            <div className="relative">
                <input
                    id={id}
                    name={id}
                    type={showPassword ? "text" : "password"}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    className={`w-full border ${
                        touched && error ? "border-red-500" : "border-gray-300"
                    } rounded-md p-2 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {passwordStrength && (
                <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Seguridad:</span>
                    <span
                    className={`font-medium ${
                        passwordStrength.strength <= 2
                        ? "text-red-600"
                        : passwordStrength.strength === 3
                        ? "text-yellow-600"
                        : passwordStrength.strength === 4
                        ? "text-blue-600"
                        : "text-green-600"
                        }`}
                    >
                        {passwordStrength.label}
                    </span>
                </div>
                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-1 flex-1 rounded ${
                        i < passwordStrength.strength ? passwordStrength.color : "bg-gray-200"
                        }`}
                    />
                    ))}
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-500 mt-1">
                Mínimo 8 caracteres con mayúsculas, minúsculas, números y símbolos
            </p>

            {touched && error && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                <AlertCircle size={12} />
                {error}
                </p>
            )}
        </div>
    );
}