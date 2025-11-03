"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";


interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [expComment, setExpComment] = useState("");
  const [relComment, setRelComment] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({ exp: "", rel: "", rate: "" });

  const handleSubmit = () => {
    const newErrors = { exp: "", rel: "", rate: "" };
    let valid = true;

    if (!expComment.trim()) {
      newErrors.exp = "Por favor escribe el desempeño del estudiante.";
      valid = false;
    }

    if (!relComment.trim()) {
      newErrors.rel = "Por favor escribe cómo fue tu la forma de trabajo del estudiante.";
      valid = false;
    }

    if (rating === 0) {
      newErrors.rate = "Debes puntuar antes de enviar.";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      // Simular envío o llamada al backend
      console.log({ expComment, relComment, rating });

      // Reiniciar campos y cerrar modal
      setExpComment("");
      setRelComment("");
      setRating(0);
      setErrors({ exp: "", rel: "", rate: "" });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-[#5C4B7D] text-white rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold mb-4">
            ¡Gracias por trabajar con nosotros!
          </DialogTitle>
        </DialogHeader>

        <div className="bg-white text-black rounded-xl p-4">
          <p className="text-sm text-center mb-4">
            Nos gustaría saber tu experiencia con el trabajo realizado.
          </p>

          {/* Campo 1 */}
          <div className="mb-3">
            <label className="text-sm font-semibold">¿Como fue el desempeño del estudiante en el trabajo hecho?</label>
            <Textarea
              value={expComment}
              onChange={(e) => setExpComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="mt-1"
            />
            {errors.exp && <p className="text-red-500 text-xs mt-1">{errors.exp}</p>}
          </div>

          {/* Campo 2 */}
          <div className="mb-3">
            <label className="text-sm font-semibold">¿Como fue la forma de trabajo del estudiante? </label>
            <Textarea
              value={relComment}
              onChange={(e) => setRelComment(e.target.value)}
              placeholder="Escribe tu comentario..."
              className="mt-1"
            />
            {errors.rel && <p className="text-red-500 text-xs mt-1">{errors.rel}</p>}
          </div>

          {/* Puntuación */}
          <div className="flex flex-col items-center mb-4">
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 cursor-pointer ${
                    star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                  }`}
                  onClick={() => setRating(star)} 
                />
              ))}
            </div>
            Evaluar (1-6 estrellas)
            {errors.rate && <p className="text-red-500 text-xs mt-1">{errors.rate}</p>}
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-[#5C4B7D] hover:bg-[#48396a] text-white rounded-lg"
          >
            Enviar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
