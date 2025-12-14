"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui";
import Image from "next/image";
import { Star } from "lucide-react";
import { PostulantDetailForAdmin } from "@/models/responses";

export function ApplicantCard({ postulant }: { postulant: PostulantDetailForAdmin }) {
  const hasCV = !!postulant.curriculumVitae;
  const rating = (postulant as any).rating || 0;
  const imageSrc = postulant.profilePicture && postulant.profilePicture.trim() !== ""
    ? postulant.profilePicture
    : "/default-user.svg";

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center py-6 space-y-4">

        {/* FOTO */}
        <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm relative">
          <Image
            src={imageSrc}
            width={128}
            height={128}
            alt={`Foto de ${postulant.studentName}`}
            className="object-cover w-full h-full"
            unoptimized
          />
        </div>

        <div className="flex flex-col items-center gap-2 w-full">
            <p className="text-lg font-semibold text-[var(--ink)] text-center leading-tight">
              {postulant.studentName}
            </p>

            <div className="flex items-center justify-center gap-0.5">
                {[1, 2, 3, 4, 5, 6].map((index) => (
                    <Star
                        key={index}
                        size={16}
                        className={`${
                            index <= rating 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "fill-gray-200 text-gray-200"
                        }`}
                    />
                ))}
                <span className="text-xs text-gray-400 ml-1 font-medium">
                    ({rating}/6)
                </span>
            </div>
        </div>

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