export interface UpdateDestinationRequest {
  destinationId: string;
  tripId: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  notes?: string;
}