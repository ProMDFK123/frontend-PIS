import { useState, ChangeEvent } from "react";

type ValidationRules<T> = {
    [K in keyof T]?: (value: T[K], formData?: T) => string | null;
}

export function useFormValidation<T extends Record<string, any>>(initialData: T, validationRules: ValidationRules<T>) {
    const [formData, setFormData] = useState<T>(initialData);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string | null>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

    const validateField = (fieldName: keyof T, value: any): string | null => {
        const validator = validationRules[fieldName];
        if (!validator) return null;
        return validator(value, formData);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const fieldName = name as keyof T;

        setFormData((prev) => ({ ...prev, [fieldName]: value }));

        if (touched[fieldName]) {
            const error = validateField(fieldName, value);
            setErrors((prev) => ({ ...prev, [fieldName]: error || undefined}));
        }
    };

    const handleBlur = (fieldName: keyof T) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
        const error = validateField(fieldName, formData[fieldName]);
        setErrors((prev) => ({ ...prev, [fieldName]: error || undefined }));
    };

    const validateAll = (): boolean => {
        const newErrors: Partial<Record<keyof T, string>> = {};
        const newTouched: Partial<Record<keyof T, boolean>> = {};

        (Object.keys(formData) as Array<keyof T>).forEach((key) => {
            newTouched[key] = true;
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
            }   
        });
        setErrors(newErrors);
        setTouched(newTouched);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData(initialData);
        setErrors({});
        setTouched({});
    };
    const updateFormData = (updates: Partial<T>) => {
        setFormData((prev) => ({ ...prev, ...updates }));
    };

    return {
        formData,
        errors,
        touched,
        handleChange,
        handleBlur,
        validateAll,
        resetForm,
        updateFormData,
    };
}