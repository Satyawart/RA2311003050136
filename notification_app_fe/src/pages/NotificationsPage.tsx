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
    filter,
    setFilter,
    page,
    totalPages,
    goToPage,
  } = useNotifications();

  const hasNotifications = notifications.length > 0;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600 }} gutterBottom>
        Notifications
      </Typography>

      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={(_e, val) => {
          if (val !== null) setFilter(val as NotificationFilter);
        }}
        size="small"
        sx={{ mb: 3 }}
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
        <Alert severity="info" sx={{ mb: 2 }}>
          Unable to fetch latest notifications. Showing recent updates.
        </Alert>
      )}

      {!loading && error && !hasNotifications && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Something went wrong. Please try again later.
        </Alert>
      )}

      {!loading && !error && !hasNotifications && (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          No notifications found.
        </Typography>
      )}

      <Stack spacing={2}>
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} />
        ))}
      </Stack>

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_e, p) => goToPage(p)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}
    </Container>
  );
}

