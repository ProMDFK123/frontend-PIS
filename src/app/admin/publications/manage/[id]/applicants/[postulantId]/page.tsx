import { Metadata } from "next";
import { ApplicantDetailView } from "@/views/app";

interface ApplicantDetailPageProps {
  params: { publicationId: string; postulantId: string };
}

export async function generateMetadata({ params }: ApplicantDetailPageProps): Promise<Metadata> {
  return {
    title: `Postulante ${params.postulantId}`,
    description: `Información detallada del postulante ${params.postulantId}.`,
  };
}

export default function ApplicantDetailPage({ params }: ApplicantDetailPageProps) {
  const { publicationId, postulantId } = params;

  return (
    <ApplicantDetailView
      id={postulantId}
      publicationId={publicationId}
    />
  );
}
