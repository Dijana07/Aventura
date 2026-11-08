export interface CreateTripRequest {
  title: string;
  startDate: string;
  endDate: string;
  budget: number;
  notes?: string;
}