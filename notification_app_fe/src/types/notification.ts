export type NotificationType = "placement" | "result" | "event";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
}

export type NotificationFilter = NotificationType | "all";
