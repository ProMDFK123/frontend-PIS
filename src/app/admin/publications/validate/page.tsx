import { ValidationView } from "public/src/views/app"; 
export const metadata = {
  title: "Validación de Ofertas - Admin",
  description: "Panel de revisión y aprobación de publicaciones pendientes.",
};

export default function ValidationPage() {
  return <ValidationView />;
}