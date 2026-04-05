"use client";

import { useEffect, useState } from "react";
import NoticeBanner from "@/components/ui/notice-banner";

type NotificationType = "warning" | "info" | "success";

type NotificationPayload = {
  title: string;
  message: string;
  type?: NotificationType;
  primaryAction?: {
    label: string;
    href?: string;
  };
};

export default function GlobalNotificationBanner() {
  const [notification, setNotification] =
    useState<NotificationPayload | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("global_notification");

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setNotification(parsed);
      } catch (error) {
        console.error("Error leyendo global_notification:", error);
      }

      localStorage.removeItem("global_notification");
    }
  }, []);

  if (!notification) return null;

  return (
    <NoticeBanner
      type={notification.type || "info"}
      title={notification.title}
      message={notification.message}
      primaryAction={notification.primaryAction}
      onClose={() => setNotification(null)}
    />
  );
}