// src/app/students/your-publications/[id]/page.tsx (CORREGIDO)
import { Metadata } from "next";
import { StudentYourPublicationDetailView } from "@/views/app"; // Importación corregida

interface PublicationDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PublicationDetailPageProps): Promise<Metadata> {
  return {
    title: `Publicación ${params.id}`,
    description: `Detalle de tu publicación con ID ${params.id}.`,
  };
}

export default function PublicationDetailPage({ params }: PublicationDetailPageProps) {
  const { id } = params;

  return (
    <StudentYourPublicationDetailView // Componente corregido
      id={id}
    />
  );
}