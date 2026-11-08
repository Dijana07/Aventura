import type { ActivityDto } from "../activity/ActivityDto";
import type { DestinationDto } from "../destination/DestinationDto";
import type { ChecklistItemDto } from "../trip/ChecklistItemDto";

export interface TripDto {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  budget: number;
  notes?: string;
  createdAt: string;
  photoUrl: string;
  totalExpenses: number;

  destinations: DestinationDto[];
  activities: ActivityDto[];
  checklistItems: ChecklistItemDto[];

  canEdit: boolean;
}