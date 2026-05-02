import { memo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
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

const PRIORITY_STYLES: Record<NotificationType, SxProps<Theme>> = {
  placement: {
    borderLeft: "4px solid",
    borderLeftColor: "primary.main",
    bgcolor: "rgba(63, 81, 181, 0.04)",
  },
  result: {
    borderLeft: "3px solid",
    borderLeftColor: "success.main",
    bgcolor: "rgba(76, 175, 80, 0.03)",
  },
  event: {
    borderLeft: "2px solid",
    borderLeftColor: "divider",
  },
};

interface NotificationCardProps {
  notification: Notification;
}

function NotificationCardInner({ notification }: NotificationCardProps) {
  const config = TYPE_CONFIG[notification.type];
  const prioritySx = PRIORITY_STYLES[notification.type];

  return (
    <Card
      variant="outlined"
      sx={{
        transition: "box-shadow 0.2s, transform 0.15s",
        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },
        ...prioritySx,
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

