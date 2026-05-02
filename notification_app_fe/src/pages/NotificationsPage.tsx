import { useEffect, useRef } from "react";
import {
  Container,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Pagination,
  Stack,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCard } from "../components/NotificationCard";
import type { NotificationFilter } from "../types/notification";

const FILTER_OPTIONS: { value: NotificationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "placement", label: "Placement" },
  { value: "result", label: "Result" },
  { value: "event", label: "Event" },
];

export default function NotificationsPage() {
  const {
    notifications,
    loading,
    error,
    usingFallback,
    filteredCount,
    filter,
    setFilter,
    page,
    totalPages,
    goToPage,
  } = useNotifications();

  const isInitialRender = useRef(true);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [filter]);

  const hasNotifications = notifications.length > 0;
  const isFilterEmpty = !loading && filteredCount === 0 && filter !== "all";

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Stack spacing={3}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Notifications
        </Typography>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_e, val) => {
            if (val !== null) setFilter(val as NotificationFilter);
          }}
          size="small"
        >
          {FILTER_OPTIONS.map((opt) => (
            <ToggleButton key={opt.value} value={opt.value}>
              {opt.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && usingFallback && hasNotifications && (
          <Alert severity="info">
            We couldn't load the latest notifications. Showing recent updates
            instead.
          </Alert>
        )}

        {!loading && error && !hasNotifications && !isFilterEmpty && (
          <Alert severity="error">
            Something went wrong. Please try again later.
          </Alert>
        )}

        {!loading && isFilterEmpty && (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
            No notifications found for this filter.
          </Typography>
        )}

        {!loading && !hasNotifications && !isFilterEmpty && !error && (
          <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
            No notifications available.
          </Typography>
        )}

        {!loading && hasNotifications && (
          <Stack spacing={2}>
            {notifications.map((n) => (
              <NotificationCard key={n.id} notification={n} />
            ))}
          </Stack>
        )}

        {!loading && totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_e, p) => goToPage(p)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Stack>
    </Container>
  );
}

