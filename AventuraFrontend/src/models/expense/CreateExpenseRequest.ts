export interface CreateExpenseRequest {
  tripId: string;
  title: string;
  dateTime: string;
  description: string;
  amount: number;
  category: string;
}