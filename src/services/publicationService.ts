/**no eesta bien conectado, pero es un ejemplo a un flujo a seguir */



/**
 * Este archivo actúa como un puente entre el frontend y la API del backend
 * para todo lo relacionado con las "Publicaciones".
 * Define los tipos de datos (interfaces) y los métodos (funciones) 
 * para interactuar con los endpoints de la API.
 */

// Importa la instancia de Axios preconfigurada desde un archivo local.
// Este archivo 'Service.ts' (o 'api.ts') es donde se define la 'baseURL'
// (ej: "http://localhost:5000") y se interceptan las peticiones para
// añadir headers, como los tokens de autenticación (JWT).
import api from "./Service";

/**
 * Define la "forma" (el contrato) de los datos que el formulario de creación
 * debe recopilar del usuario.
 * Es el tipo de dato que espera la función 'create'.
 */
export interface CreatePublicationData {
  /** El título principal de la publicación. Requerido. */
  title: string;

  /** La descripción detallada de la oferta o producto. Requerida. */
  description: string;

  /** La categoría (ej: "Oferta de trabajo", "Compra y venta"). Requerida. */
  category: string;

  /** Fecha de inicio de la publicación (en formato string, ej: "2025-11-03"). Requerida. */
  startDate: string;

  /** Fecha de término de la publicación (en formato string, ej: "2025-11-03"). Requerida. */
  endDate: string;

  /** La remuneración (opcional). El '?' significa que este campo puede ser 'string' o 'undefined'. */
  remuneration?: string;

  /** * El archivo de imagen (opcional). 
   * El tipo 'File' es el objeto estándar que usa el navegador
   * para representar un archivo que el usuario ha seleccionado desde su disco.
   */
  image?: File;
}

/**
 * Define la "forma" (el contrato) de los datos que el backend
 * devuelve como respuesta después de que una publicación se crea exitosamente.
 */
export interface PublicationResponse {
  /** El ID único de la publicación, generado por la base de datos. */
  id: number;

  /** El título de la publicación (útil para confirmar la creación). */
  title: string;

  /** La descripción de la publicación (útil para confirmar). */
  description: string;

  // Agregar otros campos que el backend devuelva (ej: status, createdAt, etc.)
}

/**
 * Objeto que agrupa todos los métodos del servicio relacionados con las publicaciones.
 * Esto se exporta para que los componentes (páginas .tsx) puedan importarlo y usarlo.
 * Ej: import { publicationService } from '@/services/publicationService';
 */
export const publicationService = {

  /**
   * Envía una nueva publicación al backend, incluyendo un posible archivo de imagen.
   * * @param data Un objeto que cumple con la interfaz CreatePublicationData.
   * @returns Una Promesa (Promise) que, si tiene éxito, se resuelve con los 
   * datos de la publicación creada (un objeto PublicationResponse).
   */
  async create(data: CreatePublicationData): Promise<PublicationResponse> {
    
    // 1. Crear un objeto 'FormData'.
    // Es OBLIGATORIO usar FormData en lugar de JSON cuando se envían archivos (como data.image).
    // FormData construye una petición especial de tipo "multipart/form-data".
    const formData = new FormData();

    // 2. Adjuntar todos los campos de texto al FormData.
    // Se usa '.append(clave, valor)'.
    // La 'clave' (ej: "title") debe coincidir EXACTAMENTE con el nombre
    // que la API de .NET espera leer. (Usualmente definido con [FromForm(Name = "title")]).
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("startDate", data.startDate);
    formData.append("endDate", data.endDate);

    // 3. Adjuntar campos opcionales SÓLO si existen (no son undefined).
    // Si 'data.remuneration' tiene un valor, se añade a la petición.
    if (data.remuneration) {
      formData.append("remuneration", data.remuneration);
    }
    
    // Si 'data.image' (el archivo) existe, se añade a la petición.
    if (data.image) {
      formData.append("image", data.image);
    }

    // 4. Realizar la llamada a la API usando la instancia 'api' (Axios).
    // 'await' pausa la ejecución de esta función hasta que el servidor responda.
    // 'api.post' realiza una petición HTTP POST.
    // '<PublicationResponse>' es una ayuda de TypeScript para que sepa
    // que 'response.data' será de tipo PublicationResponse.
    const response = await api.post<PublicationResponse>(
      
      // El endpoint de la API al que se llamará.
      // (Se concatena con la baseURL, ej: "http://localhost:5000/api/publications")
      "/api/publications", 
      
      // El cuerpo (payload) de la petición. En este caso, es el objeto FormData.
      formData, 
      
      // Opciones de configuración para esta petición específica.
      {
        headers: {
          // Este encabezado es CRUCIAL. Le dice al servidor (y a Axios)
          // que NO estamos enviando 'application/json', sino 'multipart/form-data'.
          // Sin esto, el backend no sabrá cómo leer el archivo y los datos.
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // 5. Devolver solo los datos de la respuesta.
    // Una respuesta de Axios (variable 'response') es un objeto grande
    // que incluye 'status', 'headers', 'config', etc.
    // Los datos JSON reales devueltos por el backend están en la propiedad 'response.data'.
    return response.data;
  },

  // ... aquí podrías agregar otros métodos del servicio ...
  //
  // async getAll(): Promise<PublicationResponse[]> {
  //   const response = await api.get("/api/publications");
  //   return response.data;
  // },
  //
  // async getById(id: number): Promise<PublicationResponse> {
  //   const response = await api.get(`/api/publications/${id}`);
  //   return response.data;
  // }
};