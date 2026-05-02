import type { Notification, NotificationType } from "../types/notification";

const TYPE_PRIORITY: Record<NotificationType, number> = {
  placement: 0,
  result: 1,
  event: 2,
};

export function sortNotifications(notifications: Notification[]): Notification[] {
  return [...notifications].sort((a, b) => {
    const priorityDiff = TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type];
    if (priorityDiff !== 0) return priorityDiff;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });
}
