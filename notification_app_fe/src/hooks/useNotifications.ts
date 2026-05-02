import { useState, useEffect, useMemo, useCallback } from "react";
import type { Notification, NotificationFilter } from "../types/notification";
import { sortNotifications } from "../utils/sortNotifications";
import { MOCK_NOTIFICATIONS } from "../mocks/notifications";

const ITEMS_PER_PAGE = 5;

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  filter: NotificationFilter;
  setFilter: (f: NotificationFilter) => void;
  page: number;
  totalPages: number;
  goToPage: (p: number) => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // Swap with fetchNotifications() when the backend is available
        await new Promise((r) => setTimeout(r, 400));
        if (!cancelled) setAllNotifications(MOCK_NOTIFICATIONS);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const subset =
      filter === "all"
        ? allNotifications
        : allNotifications.filter((n) => n.type === filter);
    return sortNotifications(subset);
  }, [allNotifications, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const safePage = Math.min(page, totalPages);

  const notifications = useMemo(
    () =>
      filtered.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
      ),
    [filtered, safePage]
  );

  const handleFilterChange = useCallback((f: NotificationFilter) => {
    setFilter(f);
    setPage(1);
  }, []);

  const goToPage = useCallback((p: number) => setPage(p), []);

  return {
    notifications,
    loading,
    error,
    filter,
    setFilter: handleFilterChange,
    page: safePage,
    totalPages,
    goToPage,
  };
}
