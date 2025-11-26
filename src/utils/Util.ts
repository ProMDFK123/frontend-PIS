// src/utils/Util.ts

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString("es-CL");
};

// Formatear RUT a xxxxxxxx-x
export function formatRut(input: string): string {
  // Eliminar cualquier cosa que no sea un digito, 'k' o 'K'.
  let clean = input.replace(/[^0-9kK]/g, "");

  if(clean.length === 0) return "";

  // Separar dígito verificador del cuerpo.
  let body = clean.slice(0,-1);
  let dv = clean.slice(-1).toUpperCase();

  return `${body}-${dv}`;
}