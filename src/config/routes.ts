// ============================================
// src/config/routes.ts
// ============================================

/**
 * Configuración centralizada de rutas de la aplicación
 * 
 * Ventajas:
 * - Un solo lugar para definir todas las rutas
 * - Type-safe: si cambias una ruta, TypeScript te avisa donde se usa
 * - Autocomplete en el IDE
 * - Fácil refactorizar rutas
 * - Evita typos en URLs
 */

export const ROUTES = {
  // ==========================================
  // Rutas Públicas
  // ==========================================
  HOME: '/',

  // ==========================================
  // Autenticación
  // ==========================================
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/olvide-password',
  },

  // ==========================================
  // Publicaciones
  // ==========================================
  PUBLICATIONS: {
    LIST: '/publicaciones',
    NEW: '/publicaciones/nueva',
    DETAIL: (id: number | string) => `/publicaciones/${id}`,
  },
} as const;

// ==========================================
// Validación de Rutas
// ==========================================

/**
 * Rutas que requieren autenticación
 */
export const PROTECTED_ROUTES = [
  ROUTES.PUBLICATIONS.NEW,
] as const;

export function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.some(route => path.startsWith(route));
}