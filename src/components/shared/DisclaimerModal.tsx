"use client";

import { Heart, FileCheck, Ban, Share2 } from "lucide-react";
import { X } from "lucide-react";

interface DisclaimerModalProps {
  isOpen: boolean;
  isChecked: boolean;
  onCheckChange: (checked: boolean) => void;
  onAccept: () => void;
  onReject: () => void;
}

export function DisclaimerModal({
  isOpen,
  isChecked,
  onCheckChange,
  onAccept,
  onReject,
}: DisclaimerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[var(--pop)] to-[#F472B6] px-4 sm:px-6 py-5 sm:py-6 flex items-center justify-between">
          <h2 className="text-lg sm:text-2xl font-extrabold text-white">
            Normas y buen uso
          </h2>
          <button
            onClick={onReject}
            className="p-2 hover:bg-white/20 rounded-lg transition flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <p className="text-[var(--muted-ink)] mb-5 sm:mb-6 text-sm sm:text-base">
            Antes de continuar, acepta nuestras normas de comunidad responsable:
          </p>

          <div className="grid gap-3 sm:gap-4 mb-5 sm:mb-6">
            {[
              {
                icon: Heart,
                text: "Respeto y empatía siempre.",
                color: "bg-blue-400",
              },
              {
                icon: FileCheck,
                text: "Publica información real y útil.",
                color: "bg-emerald-400",
              },
              {
                icon: Ban,
                text: "No compartas datos personales de terceros.",
                color: "bg-red-400",
              },
              {
                icon: Share2,
                text: "Comparte oportunidades con tu comunidad.",
                color: "bg-amber-400",
              },
            ].map((rule, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200"
              >
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${rule.color} flex items-center justify-center flex-shrink-0`}
                >
                  <rule.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <p className="text-[var(--ink)] font-medium text-sm sm:text-base">
                  {rule.text}
                </p>
              </div>
            ))}
          </div>

          {/* Checkbox */}
          <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200 mb-5 sm:mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                id="accept-disclaimer"
                checked={isChecked}
                onChange={(e) => onCheckChange(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-blue-300 bg-white checked:bg-[var(--primary)] checked:border-[var(--primary)] accent-[var(--primary)]"
              />
              <span className="text-[var(--ink)] font-medium text-sm sm:text-base">
                Acepto las normas de buen uso
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={onReject}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-gray-300 text-[var(--ink)] font-semibold hover:bg-gray-50 transition text-sm sm:text-base"
            >
              Rechazar
            </button>
            <button
              onClick={onAccept}
              disabled={!isChecked}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition text-sm sm:text-base ${
                isChecked
                  ? "bg-gradient-to-r from-[var(--pop)] to-[#F472B6] text-white hover:shadow-lg cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60"
              }`}
            >
              Aceptar y continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}