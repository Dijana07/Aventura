export interface CreateDestinationRequest {
  tripId: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  notes?: string;
}