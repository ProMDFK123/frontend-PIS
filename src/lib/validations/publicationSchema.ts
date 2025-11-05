/**
 * Esquemas de validación para publicaciones
 * Usa Zod para validar datos del formulario
 */

import { z } from 'zod';
import { FILE_UPLOAD } from '@/lib/utils/constants';

export const publicationFormSchema = z.object({
  title: z
    .string()
    .min(1, 'El título es requerido')
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),

  description: z
    .string()
    .min(1, 'La descripción es requerida')
    .min(20, 'La descripción debe tener al menos 20 caracteres')
    .max(5000, 'La descripción no puede exceder 5000 caracteres'),

  category: z
    .string()
    .min(1, 'Selecciona una categoría'),

  startDate: z
    .string()
    .min(1, 'La fecha de inicio es requerida')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Fecha de inicio inválida',
    }),

  endDate: z
    .string()
    .min(1, 'La fecha de término es requerida')
    .refine((date) => !isNaN(Date.parse(date)), {
      message: 'Fecha de término inválida',
    }),

  remuneration: z.string().optional(),

  image: z
    .instanceof(File)
    .refine((file) => file.size <= FILE_UPLOAD.MAX_SIZE, {
      message: `La imagen no debe superar ${FILE_UPLOAD.MAX_SIZE / 1024 / 1024}MB`,
    })
    .refine((file) => FILE_UPLOAD.ALLOWED_TYPES.includes(file.type), {
      message: 'Formato de imagen no válido',
    })
    .nullable()
    .optional(),
}).refine((data) => {
  const start = new Date(data.startDate);
  const end = new Date(data.endDate);
  return start < end;
}, {
  message: 'La fecha de término debe ser posterior a la de inicio',
  path: ['endDate'],
});

export type PublicationFormSchema = z.infer<typeof publicationFormSchema>;