import React from "react";
import ApplicantsOffererView from "@/views/app/offerer/your-publications/[id]/applicants";

interface PageProps {
  params: {
    id: string;
  };
}

export default function ApplicantsPage({ params }: PageProps) {
  const { id } = params;
  // Y se lo pasa al Client Component para que gestione su propia carga.
  return <ApplicantsOffererView id={id} />;
}
