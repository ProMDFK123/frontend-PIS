import { Metadata } from "next";
import { ApplicantDetailViewStudents } from "@/views/app";

interface ApplicantDetailPageProps {
  params: { id: string; postulantId: string };
}

export async function generateMetadata({ params }: ApplicantDetailPageProps): Promise<Metadata> {
  return {
    title: `Postulante`,
    description: `Información detallada del postulante ${params.postulantId}.`,
  };
}

export default function ApplicantDetailPage({ params }: ApplicantDetailPageProps) {
  const { id, postulantId } = params;

  return (
    <ApplicantDetailViewStudents
      id={id}
      postulantId={postulantId}
    />
  );
}