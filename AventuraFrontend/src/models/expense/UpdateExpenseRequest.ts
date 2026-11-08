export interface UpdateExpenseRequest {
  expenseId: string;
  tripId: string;
  title?: string;
  date?: string;
  description?: string;
  amount?: number;
  category?: string;
}