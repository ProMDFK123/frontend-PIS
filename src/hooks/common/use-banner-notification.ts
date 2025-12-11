"use client";

import { useEffect, useState } from "react";

export type BannerState = {
  title: string;
  message: string;
  type: "success" | "error";
};

export const useBannerNotification = () => {
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!banner) return;

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setBanner(null), 200);
    }, 3500);

    return () => clearTimeout(timer);
  }, [banner]);

  function closeBanner() {
    setVisible(false);
    setTimeout(() => setBanner(null), 200);
  }

  function showBanner(newBanner: BannerState) {
    setBanner(newBanner);
  }

  return {
    banner,
    visible,
    showBanner,
    closeBanner,
  };
};
