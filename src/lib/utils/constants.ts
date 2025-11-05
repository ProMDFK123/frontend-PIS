/**
 * Constantes de la aplicación
 * Centraliza valores que se usan en múltiples lugares
 */

export const PUBLICATION_CATEGORIES = [
  'Compra y venta',
  'Oferta de trabajo',
] as const;

export type PublicationCategory = typeof PUBLICATION_CATEGORIES[number];

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
} as const;

export const FORM_MESSAGES = {
  SUCCESS: '¡Publicación creada exitosamente!',
  ERROR: 'Error al enviar la publicación',
  NETWORK_ERROR: 'No se pudo conectar con el servidor. Verifica tu conexión.',
  GENERIC_ERROR: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
} as const;