import { useState, useCallback } from "react";

export type NotificationType = "success" | "error";

export interface NotificationState {
  title: string;
  message: string;
  type: NotificationType;
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const show = useCallback((title: string, message: string, type: NotificationType = "success") => {
    setNotification({ title, message, type });
    setIsVisible(true);
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setNotification(null), 200);
  }, []);

  return {
    notification,
    isVisible,
    show,
    close,
  };
}