import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/auth.config";
import { cookies } from "next/headers";
import YourPublicationsClient from "@/views/app/admin/your-publications";

export default async function TusPublicacionesPage() {
  const session = await getServerSession(authConfig as any);
  const cookieStore: any = await cookies();
  const tokenCookie = cookieStore.get?.("token")?.value;

  if (!session && !tokenCookie) {
    const returnTo = encodeURIComponent("/admin/your-publications");
    const msg = encodeURIComponent("No tienes autorización para realizar esta acción. Por favor inicia sesión.");
    redirect(`/auth/login?returnTo=${returnTo}&msg=${msg}`);
  }

  return <YourPublicationsClient />;
}
