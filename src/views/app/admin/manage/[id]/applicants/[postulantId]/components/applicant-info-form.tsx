"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PostulantDetailForAdmin } from "@/models/responses";

export function ApplicantInfoForm({
  postulant,
}: {
  postulant: PostulantDetailForAdmin;
}) {
  return (
    <Card className="w-full">
      <CardContent className="grid grid-cols-1 gap-4 py-6">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Nombre</Label>
            <Input value={postulant.studentName} readOnly />
          </div>

          <div>
            <Label>Email</Label>
            <Input value={postulant.email} readOnly />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Teléfono</Label>
            <Input value={postulant.phoneNumber} readOnly />
          </div>

          <div>
            <Label>Estado</Label>
            <Input value={postulant.status} readOnly />
          </div>
        </div>

        <div>
          <Label>Discapacidad</Label>
          <Input value={postulant.disability ?? "No informado"} readOnly />
        </div>

        <div>
          <Label>Carta de Motivación</Label>
          <Textarea
            className="min-h-[150px]"
            value={postulant.motivationLetter ?? "Sin carta de motivación"}
            readOnly
          />
        </div>
      </CardContent>
    </Card>
  );
}
