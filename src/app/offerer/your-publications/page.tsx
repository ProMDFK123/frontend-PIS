import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "@/auth.config";
import { cookies } from "next/headers";
import YourPublicationsClient from "../../../views/app/offerer/your-publication/YourPublicationsClient";

export default async function TusPublicacionesPage() {
  const session = await getServerSession(authConfig as any);
  const cookieStore: any = await cookies();
  const tokenCookie = cookieStore.get?.("token")?.value;

  // Logs mínimos para depuración (temporal)
  // eslint-disable-next-line no-console
  console.log("[guard]/your-publications session:", Boolean(session));
  // eslint-disable-next-line no-console
  console.log("[guard]/your-publications tokenCookie:", Boolean(tokenCookie));

  if (!session && !tokenCookie) {
    const returnTo = encodeURIComponent("/offerer/your-publications");
    const msg = encodeURIComponent("No tienes autorización para realizar esta acción. Por favor inicia sesión.");
    redirect(`/auth/login?returnTo=${returnTo}&msg=${msg}`);
  }

  return <YourPublicationsClient />;
}

