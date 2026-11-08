import type { ActivityStatus } from "@/enums/ActivityStatus";

export interface ActivityDto {
  id: string;
  title: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  description: string;
  budget: number;
  activityStatus: ActivityStatus;
  notes?: string;
}