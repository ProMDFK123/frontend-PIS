"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import FeedbackModal from "@/app/jobs/reviews/employer/evaluation";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export default function JobsHistory() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFinish = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const trabajos = [
    { id: 1, titulo: "Paseador de perros", estado: "Activo", categoria: "Oferta de trabajo" },
    { id: 2, titulo: "Venta PS4", estado: "Activo", categoria: "Compra y venta" },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      {/* Contenido */}
      <main className="max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-2xl font-semibold text-center mb-8">
          Historial de trabajos asignados
        </h1>

        <div className="grid sm:grid-cols-2 gap-6">
          {trabajos.map((trabajo) => (
            <Card
              key={trabajo.id}
              className="rounded-2xl border-[var(--border)] shadow-md hover:shadow-lg transition"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <Badge className="bg-[var(--secondary)] text-[var(--ink)]">
                    {trabajo.estado}
                  </Badge>
                  <Badge className="bg-[var(--chip)] text-[var(--primary)]">
                    {trabajo.categoria}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-lg font-semibold">
                  {trabajo.titulo}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <Button variant="outline" className="text-[var(--primary)] hover:bg-[var(--chip)]">
                  Ver detalle
                </Button>
                <Button
                  onClick={handleFinish}
                  className="bg-[#5C4B7D] hover:bg-[#48396a] text-white rounded-lg"
                >
                  Finalizar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <FeedbackModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}