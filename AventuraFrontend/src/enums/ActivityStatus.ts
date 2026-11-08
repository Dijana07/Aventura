export const ActivityStatus = {
  PLANNED: "PLANNED",
  RESERVED: "RESERVED",
  DONE: "DONE",
  CANCELLED: "CANCELLED",
} as const;

export type ActivityStatus =
  (typeof ActivityStatus)[keyof typeof ActivityStatus];