
 import { useRouter } from 'next/navigation';
 import { 
     Plus, 
     LayoutList, 
     User, 
     LogOut, 
     LayoutDashboard
 } from "lucide-react";
 import { getServerSession } from 'next-auth';
 import { redirect } from 'next/navigation';
 import { authConfig } from '@/auth.config';
 import { cookies } from 'next/headers';
 import { OffererView } from '@/views/app';
 
 /**
  * Vista de Menú Principal (Dashboard) para el Oferente.
  * Permite navegar a las distintas funcionalidades: Crear publicación, Ver mis publicaciones, Perfil.
  */

 export default async function OffererPage() {
   // Verificación de sesión (NextAuth o Cookie Token)
   const session = await getServerSession(authConfig as any);
   const cookieStore: any = await cookies();
   const tokenCookie = cookieStore.get?.("token")?.value;

   if (!session && !tokenCookie) {
     const returnTo = encodeURIComponent('/offerer');
     const msg = encodeURIComponent('Debes iniciar sesión para acceder al panel.');
     redirect(`/auth/login?returnTo=${returnTo}&msg=${msg}`);
   }
 
   return <OffererView />;
 }