import { useState, useEffect, useMemo, useCallback } from "react";
import type { Notification, NotificationFilter } from "../types/notification";
import { fetchNotifications } from "../services/notificationService";
import { sortNotifications } from "../utils/sortNotifications";
import { MOCK_NOTIFICATIONS } from "../mocks/notifications";
import { logger } from "../logging_middleware/logger";

const ITEMS_PER_PAGE = 5;

interface UseNotificationsReturn {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
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
  const [usingFallback, setUsingFallback] = useState(false);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      setUsingFallback(false);

      try {
        const fetchedNotifications = await fetchNotifications();
        if (cancelled) return;

        if (fetchedNotifications.length === 0) {
          logger.warn("Empty response from API, falling back to mock data", {
            mockCount: MOCK_NOTIFICATIONS.length,
          });
          setUsingFallback(true);
          setAllNotifications(MOCK_NOTIFICATIONS);
        } else {
          logger.info("Notifications loaded into state", {
            count: fetchedNotifications.length,
          });
          setAllNotifications(fetchedNotifications);
        }
      } catch (err) {
        if (cancelled) return;

        const reason = err instanceof Error ? err.message : "Unknown error";
        logger.error("Fetch failed, activating mock fallback", {
          error: reason,
          mockCount: MOCK_NOTIFICATIONS.length,
        });

        setUsingFallback(true);
        setAllNotifications(MOCK_NOTIFICATIONS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(
    () => sortNotifications(allNotifications),
    [allNotifications]
  );

  const filtered = useMemo(
    () =>
      filter === "all" ? sorted : sorted.filter((n) => n.type === filter),
    [sorted, filter]
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE)),
    [filtered.length]
  );

  const safePage = Math.min(page, totalPages);

  const pageItems = useMemo(
    () =>
      filtered.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
      ),
    [filtered, safePage]
  );

  const handleFilterChange = useCallback((f: NotificationFilter) => {
    logger.info("Filter changed", { from: filter, to: f });
    setFilter(f);
    setPage(1);
  }, [filter]);

  const goToPage = useCallback((p: number) => setPage(p), []);

  return {
    notifications: pageItems,
    loading,
    error,
    usingFallback,
    filter,
    setFilter: handleFilterChange,
    page: safePage,
    totalPages,
    goToPage,
  };
}
