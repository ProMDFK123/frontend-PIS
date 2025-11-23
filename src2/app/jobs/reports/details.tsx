"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "src/components/ui/dialog";
import { Button } from "src/components/ui/Button";
import { Card } from "src/components/ui/card";
import { Trash2 } from "lucide-react";

interface EvaluacionTrabajoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function EvaluacionTrabajoModal({
  open,
  onClose,
}: EvaluacionTrabajoModalProps) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      rol: "Oferente",
      nombre: "Sophia C.",
      estrellas: 2,
      comentario:
        "Me dijeron que el perro sería tranquilo pero fue todo lo contrario.",
      eliminada: false,
    },
    {
      id: 2,
      rol: "Estudiante",
      nombre: "Pedropiedra",
      estrellas: 3,
      comentario:
        "Llegó a la hora pero tenía descuidada su presentación personal.",
      eliminada: false,
    },
  ]);

  const eliminarReseña = (id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, eliminada: true } : r
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl border border-gray-300 shadow-lg">
        <DialogHeader className="flex justify-between items-center pb-4">
          <DialogTitle className="text-center text-lg font-semibold w-full">
            Evaluación de Trabajo
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2 pb-4">
          {/* Columna Izquierda */}
          <Card className="p-4 border border-gray-300 rounded-lg text-center">
            <div className="flex flex-col items-center">
              <Image
                src="/public/dog.jpg"
                alt="Perro"
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
              <h2 className="text-lg font-semibold mt-3">
                Necesito cuidador de perro
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Necesito quien pueda cuidar de mi perro de 3PM a 5PM, y que
                pueda sacarlo a dar una vuelta por el Parque Brasil.
              </p>
              <div className="text-sm text-gray-700 mt-3">
                <p>
                  <strong>Fecha:</strong> 08/05/2025
                </p>
                <p>
                  <strong>Pago:</strong> $5000
                </p>
                <p>
                  <strong>Oferente:</strong> Sophia Campos
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Terminó sin problemas
              </p>
            </div>
          </Card>

          {/* Columna Derecha */}
          <div className="flex flex-col gap-4">
            {reviews.map((r) => (
              <Card
                key={r.id}
                className={`p-4 border ${
                  r.eliminada
                    ? "bg-gray-100 border-gray-300 text-gray-400"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold">
                    {r.rol} — {r.nombre}
                  </h3>
                  {!r.eliminada && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => eliminarReseña(r.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>

                {r.eliminada ? (
                  <p className="italic text-gray-500 mt-1">
                    Reseña eliminada permanentemente.
                  </p>
                ) : (
                  <>
                    <div className="flex text-yellow-400 text-sm mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < r.estrellas ? "★" : "☆"}</span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mt-2">
                      {r.comentario}
                    </p>
                  </>
                )}
              </Card>
            ))}

            <Card className="p-3 border border-gray-200 text-sm text-gray-700">
              <div className="flex flex-col gap-2">
                <p>
                  ✅ ¿Se presentó a trabajar en la hora acordada?
                </p>
                <p>
                  ✅ ¿Tuvo buena presentación personal a la hora de asistir y
                  realizar el trabajo?
                </p>
              </div>
            </Card>
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-end sticky bottom-0 bg-white pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}