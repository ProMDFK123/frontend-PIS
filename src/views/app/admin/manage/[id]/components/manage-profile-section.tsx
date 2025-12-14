"use client";

import React from "react";
import { Star } from "lucide-react";
import { AdminDetail } from "@/models/responses";

interface ManageProfileSectionProps {
  detail: AdminDetail;
}

export function ManageProfileSection({ detail }: ManageProfileSectionProps) {
  const rating = (detail as any).rating || 0; 

  return (
    <section className="w-full bg-white p-6 rounded-xl shadow-lg border border-[var(--border)]">
      <h2 className="text-2xl font-bold text-black mb-6 text-center">
        Perfil del Contacto
      </h2>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
          {detail.companyName ? detail.companyName[0] : "U"}
        </div>

        <div className="flex flex-col items-center">
            <p className="font-semibold text-lg text-[var(--ink)] break-words px-2">
            {detail.companyName || "Usuario UCN"}
            </p>

            <div className="flex items-center justify-center gap-0.5 mt-2">
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
                <span className="text-xs text-gray-400 ml-2 font-medium">
                    ({rating}/6)
                </span>
            </div>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--border)] text-[var(--ink)] text-sm space-y-4">

        {detail.contactInfo && (
            <div className="flex flex-col">
              <span className="font-semibold mb-1">Información de contacto:</span>
              <span className="break-all">{detail.contactInfo}</span>
          </div>
        )}
        
        {detail.aboutMe && (
          <div className="flex flex-col">
            <span className="font-semibold mb-1">Acerca de mí:</span>
            <span className="break-words">{detail.aboutMe}</span>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--border)]"></div>

    </section>
  );
}