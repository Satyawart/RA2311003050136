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
        const fetchedNotifications = await fetchNotifications();
        if (!cancelled) {
          const usingFallback = fetchedNotifications.length === 0;
          if (usingFallback) {
            logger.warn("Empty response from API, falling back to mock data", {
              mockCount: MOCK_NOTIFICATIONS.length,
            });
          } else {
            logger.info("Notifications loaded into state", {
              count: fetchedNotifications.length,
            });
          }
          setAllNotifications(usingFallback ? MOCK_NOTIFICATIONS : fetchedNotifications);
        }
      } catch (err) {
        if (!cancelled) {
          const errorMessage = err instanceof Error ? err.message : "Unknown error";
          logger.error("useNotifications: fetch failed, using mock fallback", {
            error: errorMessage,
            mockCount: MOCK_NOTIFICATIONS.length,
          });
          setError(errorMessage);
          setAllNotifications(MOCK_NOTIFICATIONS);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Stage 1: Sort once when raw data changes (not on filter/page change)
  const sorted = useMemo(
    () => sortNotifications(allNotifications),
    [allNotifications]
  );

  // Stage 2: Filter the pre-sorted list (skips re-sort on filter change)
  const filtered = useMemo(
    () =>
      filter === "all" ? sorted : sorted.filter((n) => n.type === filter),
    [sorted, filter]
  );

  // Stage 3: Derive pagination metadata from filtered list
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE)),
    [filtered.length]
  );

  const safePage = Math.min(page, totalPages);

  // Stage 4: Slice the current page (only recalculates on page or filter change)
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
    filter,
    setFilter: handleFilterChange,
    page: safePage,
    totalPages,
    goToPage,
  };
}

