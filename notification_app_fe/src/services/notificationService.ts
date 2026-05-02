import type { RawNotification, Notification } from "../types/notification";

const NOTIFICATIONS_URL =
  "http://20.207.122.201/evaluation-service/notifications";

function parseNotification(raw: RawNotification): Notification {
  const parsed = new Date(raw.timestamp);
  return {
    id: raw.id,
    type: raw.type,
    message: raw.message,
    timestamp: isNaN(parsed.getTime()) ? new Date(0) : parsed,
  };
}

export async function fetchNotifications(): Promise<Notification[]> {
  let response: Response;

  try {
    response = await fetch(NOTIFICATIONS_URL);
  } catch {
    throw new Error("Network error — unable to reach the notification server.");
  }

  if (!response.ok) {
    throw new Error(
      `Server responded with ${response.status} ${response.statusText}`
    );
  }

  const body: unknown = await response.json();

  const rawList: RawNotification[] = Array.isArray(body) ? body : [];

  return rawList.map(parseNotification);
}
