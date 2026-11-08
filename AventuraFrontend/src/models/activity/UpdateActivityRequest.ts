export interface UpdateActivityRequest {
  activityId: string;
  tripId: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  description?: string;
  budget?: number;
  activityStatus?: string;
  notes?: string;
}