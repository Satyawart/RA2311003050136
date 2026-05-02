import type { Notification } from "../types/notification";

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "placement",
    message: "Google has scheduled on-campus placements for May 15, 2026.",
    timestamp: new Date("2026-05-02T08:00:00Z"),
  },
  {
    id: "n2",
    type: "result",
    message: "Semester 6 results have been published on the portal.",
    timestamp: new Date("2026-05-01T14:30:00Z"),
  },
  {
    id: "n3",
    type: "event",
    message: "Annual Tech Fest registrations are now open.",
    timestamp: new Date("2026-04-30T09:00:00Z"),
  },
  {
    id: "n4",
    type: "placement",
    message: "Microsoft shortlisted candidates for the final interview round.",
    timestamp: new Date("2026-05-01T16:00:00Z"),
  },
  {
    id: "n5",
    type: "result",
    message: "Internal assessment marks for Data Structures are available.",
    timestamp: new Date("2026-04-29T11:00:00Z"),
  },
  {
    id: "n6",
    type: "event",
    message: "Workshop on Cloud Computing — May 10, Auditorium B.",
    timestamp: new Date("2026-05-02T06:00:00Z"),
  },
  {
    id: "n7",
    type: "placement",
    message: "Amazon internship applications close on May 8.",
    timestamp: new Date("2026-04-28T10:00:00Z"),
  },
  {
    id: "n8",
    type: "result",
    message: "Revaluation results for Semester 5 are out.",
    timestamp: new Date("2026-04-27T13:00:00Z"),
  },
  {
    id: "n9",
    type: "event",
    message: "Hackathon 2026 — Team registration deadline: May 5.",
    timestamp: new Date("2026-04-26T18:00:00Z"),
  },
  {
    id: "n10",
    type: "placement",
    message: "Infosys PPO offers released — check your email.",
    timestamp: new Date("2026-04-25T09:30:00Z"),
  },
  {
    id: "n11",
    type: "event",
    message: "Guest lecture on AI Ethics by Dr. Priya Sharma — May 12.",
    timestamp: new Date("2026-05-01T07:45:00Z"),
  },
  {
    id: "n12",
    type: "result",
    message: "Lab exam results for Operating Systems posted.",
    timestamp: new Date("2026-04-30T15:20:00Z"),
  },
];
