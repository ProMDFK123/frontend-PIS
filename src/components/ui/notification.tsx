import React from "react";
import type { NotificationState } from "@/hooks/common/use-notification";

interface NotificationBannerProps {
  data: NotificationState | null;
  isVisible: boolean;
  onClose: () => void;
}

export function NotificationBanner({ data, isVisible, onClose }: NotificationBannerProps) {
  if (!data) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-full max-w-sm px-4 transition-all duration-500 ease-out transform
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}`}
    >
      <div
        className="rounded-2xl border border-black shadow-xl px-4 py-3 text-sm bg-white"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-bold text-black">
              {data.title}
            </h2>
            <p className="mt-1 text-gray-600 text-xs md:text-sm leading-relaxed">
              {data.message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition-colors"
            aria-label="Cerrar notificación"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}