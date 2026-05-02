export type NotificationType = "placement" | "result" | "event";

export interface RawNotification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export type NotificationFilter = NotificationType | "all";
