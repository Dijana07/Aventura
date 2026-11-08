export interface CreateActivityRequest {
  tripId: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  budget: number;
  notes?: string;
}