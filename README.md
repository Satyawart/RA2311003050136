# Notification Dashboard

A React + TypeScript notification dashboard built with Material UI. Supports priority-based sorting, filtering, pagination, structured logging, and read/unread state management.

## Tech Stack

- React 19 / TypeScript / Vite 8
- Material UI v9
- Custom structured logging middleware

## Features

- Priority sorting (Placement > Result > Event)
- Type-based filtering
- Paginated view (5 per page)
- Read/unread state with click-to-dismiss
- Graceful API fallback with user-friendly messaging
- Structured logging across service and hook layers
- Strict Mode safe (no duplicate API calls)

## Screenshots

### Dashboard — All Notifications

![Dashboard All View](screenshots/dashboard_all_view.png)

### Read / Unread Contrast

![Read Unread Contrast](screenshots/read_unread_contrast.png)

### Filtered View — Placement

![Filtered Placement View](screenshots/filtered_placement_view.png)

## Project Structure

```
src/
├── types/notification.ts
├── services/notificationService.ts
├── utils/
│   ├── sortNotifications.ts
│   └── formatTimestamp.ts
├── mocks/notifications.ts
├── logging_middleware/logger.ts
├── hooks/useNotifications.ts
├── components/NotificationCard.tsx
└── pages/NotificationsPage.tsx
```

## Getting Started

```bash
cd notification_app_fe
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)
