import { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import EventIcon from "@mui/icons-material/Event";
import type { Notification, NotificationType } from "../types/notification";
import { formatTimestamp } from "../utils/formatTimestamp";

const TYPE_CONFIG: Record<
  NotificationType,
  { label: string; color: "primary" | "success" | "secondary"; icon: React.ReactElement }
> = {
  placement: {
    label: "Placement",
    color: "primary",
    icon: <WorkOutlinedIcon fontSize="small" />,
  },
  result: {
    label: "Result",
    color: "success",
    icon: <AssignmentTurnedInIcon fontSize="small" />,
  },
  event: {
    label: "Event",
    color: "secondary",
    icon: <EventIcon fontSize="small" />,
  },
};

interface NotificationCardProps {
  notification: Notification;
}

function NotificationCardInner({ notification }: NotificationCardProps) {
  const config = TYPE_CONFIG[notification.type];

  return (
    <Card
      variant="outlined"
      sx={{
        transition: "box-shadow 0.2s, transform 0.15s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Chip
            icon={config.icon}
            label={config.label}
            color={config.color}
            size="small"
            variant="outlined"
          />
          <Typography variant="caption" color="text.secondary">
            {formatTimestamp(notification.timestamp)}
          </Typography>
        </Stack>
        <Typography variant="body1">{notification.message}</Typography>
      </CardContent>
    </Card>
  );
}

export const NotificationCard = memo(NotificationCardInner);
