# Bolsa FEUCN - Frontend
Frontend del proyecto Bolsa FECN, desarrollado con Next.js 14, React 18 y TypeScript, utilizando Tailwind CSS para estilos y Axios para la comunicación con el backend.
La aplicación sigue una arquitectura modular, organizada por componentes, vistas, servicios y hooks personalizados, asegurando escalabilidad y mantenibilidad.

## 🚀 Tecnologías utilizadas
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Axios
- ESLint / Prettier
- Node.js 20+
- Visual Studio Code

## 🛠️ Configuración inicial
### 1️⃣ Clonar el repositorio
```bash
git clone github.com/ProMDFK123/frontend-PIS
```
### 2️⃣ Instalar dependencias
```bash
npm install
```
### 3️⃣ Ejecutar en modo desarrollo
```bash
npm run dev
```
Luego abre http://localhost:3000 para ver la aplicación en tu navegador.

## ⚙️ Variables de entorno
Crea un archivo .env.local en la raíz del proyecto con el siguiente contenido:
```ini
NEXT_PUBLIC_API_URL=http://localhost:5185
```

## 🌐 Configuración de Axios
Archivo: src/services/api.ts
```ts
// src/services/Service.ts
import axios from "axios";
import Cookies from "js-cookie";
import { buildLoginUrl } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5185/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (typeof window !== "undefined" && status === 401) {
      const currentPath = window.location.pathname + window.location.search;
      window.location.href = buildLoginUrl(currentPath, "login_required");
    }

    return Promise.reject(error);
  }
);

export default api;
```

## 🧠 Autor
Estudiantes de Proyecto Integrador Software II - 2025  
Proyecto académico - Universidad Católica del Norte  
Facultad de Ingeniería y Ciencias Geológicas
