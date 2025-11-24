import { ValidationView } from "@/views/app"; 
export const metadata = {
  title: "Validar Publicaciones",
  description: "Panel de revisión y aprobación de publicaciones pendientes.",
};

export default function ValidationPage() {
  return <ValidationView />;
}