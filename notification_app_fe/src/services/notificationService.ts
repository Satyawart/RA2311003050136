import type { RawNotification, Notification } from "../types/notification";
import { logger } from "../logging_middleware/logger";

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
  logger.info("Notifications fetch started", { url: NOTIFICATIONS_URL });

  let response: Response;

  try {
    response = await fetch(NOTIFICATIONS_URL);
  } catch (err) {
    const networkError = "Network error — unable to reach the notification server.";
    logger.error("Notifications fetch failed", {
      url: NOTIFICATIONS_URL,
      reason: err instanceof Error ? err.message : "unknown",
    });
    throw new Error(networkError);
  }

  if (!response.ok) {
    const statusMsg = `Server responded with ${response.status} ${response.statusText}`;
    logger.error("Notifications fetch failed", {
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error(statusMsg);
  }

  const body: unknown = await response.json();
  const rawList: RawNotification[] = Array.isArray(body) ? body : [];

  logger.info("Notifications fetch succeeded", {
    count: rawList.length,
    hadValidBody: Array.isArray(body),
  });

  return rawList.map(parseNotification);
}
