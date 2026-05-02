import type { Notification } from "../types/notification";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export async function fetchNotifications(): Promise<Notification[]> {
  const response = await fetch(`${API_BASE}/notifications`);

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications (${response.status})`);
  }

  const data: Notification[] = await response.json();
  return data;
}
