export interface UpdateTripRequest {
  tripId: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  notes?: string;
  image?: File;
}