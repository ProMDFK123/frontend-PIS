"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui";
import Image from "next/image";
import { PostulantDetailForAdmin } from "@/models/responses";

export function ApplicantCard({ postulant }: { postulant: PostulantDetailForAdmin }) {
  const hasCV = !!postulant.curriculumVitae;

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center py-6 space-y-4">

        {/* FOTO */}
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <Image
            src="/default-user.png"
            width={128}
            height={128}
            alt="Foto postulante"
            className="object-cover"
            unoptimized
          />
        </div>

        {/* NOMBRE */}
        <p className="text-lg font-semibold text-[var(--ink)]">
          {postulant.studentName}
        </p>

        {/* BOTON DESCARGAR CV */}
        <Button
          className={`w-full font-bold ${
            hasCV
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          disabled={!hasCV}
          onClick={() => hasCV && window.open(postulant.curriculumVitae!, "_blank")}
        >
          {hasCV ? "Descargar CV" : "Sin CV disponible"}
        </Button>

      </CardContent>
    </Card>
  );
}