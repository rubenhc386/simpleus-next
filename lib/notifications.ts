type NotificationType = "warning" | "info" | "success";

export type NotificationPayload = {
  title: string;
  message: string;
  type?: NotificationType;
  primaryAction?: {
    label: string;
    href?: string;
  };
  expiresAt?: number;
};

const STORAGE_KEY = "global_notification";

export function setGlobalNotification(payload: NotificationPayload) {
  if (typeof window === "undefined") return;

  const data: NotificationPayload = {
    ...payload,
    expiresAt: Date.now() + 1000 * 60 * 5, // 5 minutos
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getGlobalNotification(): NotificationPayload | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed: NotificationPayload = JSON.parse(raw);

    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearGlobalNotification() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}