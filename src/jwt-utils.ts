import NextAuth from "next-auth";

// 2. Importa solo la configuración, sin generar handlers en el config file
import { authConfig } from "@/auth.config"; 

// 3. Genera y exporta handlers, auth, signIn, etc.
// Esto rompe el ciclo porque el archivo auth.config.ts ya no llama a NextAuth.
export const { 
    handlers, 
    auth, 
    signIn, 
    signOut 
} = NextAuth(authConfig);