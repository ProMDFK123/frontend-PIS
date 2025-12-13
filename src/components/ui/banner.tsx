"use client";

import { BannerState } from "@/hooks/common/use-banner-notification";

interface Props {
  banner: BannerState;
  visible: boolean;
  onClose: () => void;
  onSuccessAction?: () => void;
}

export default function Banner({ banner, visible, onClose, onSuccessAction }: Props) {
  return (
    <div
      className={`fixed top-4 right-4 z-50 w-full max-w-sm px-4 transition-all duration-300
      ${visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}
    >
      <div
        className={`rounded-2xl border shadow-lg px-4 py-3 text-sm bg-[var(--card)] 
        ${banner.type === "success" ? "border-green-200" : "border-red-200"}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold">{banner.title}</h2>
            <p className="mt-1 text-xs">{banner.message}</p>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-[var(--muted-ink)] hover:text-[var(--ink)]"
          >
            ✕
          </button>
        </div>

        {banner.type === "success" && onSuccessAction && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={onSuccessAction}
              className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white"
            >
              Ver estado
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
