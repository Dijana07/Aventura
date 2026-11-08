import { apiClient } from "../api/clientApi";
import type { ResultDto } from "@/models/common/ResultDto";
import type { CreateExpenseRequest } from "@/models/expense/CreateExpenseRequest";
import type { ExpenseDto } from "@/models/expense/ExpenseDto";
import type { UpdateExpenseRequest } from "@/models/expense/UpdateExpenseRequest";
import type { DeleteExpenseRequest } from "@/models/expense/DeleteExpenseRequest";

export const expenseService = {
  createExpense(expenseData: CreateExpenseRequest): Promise<ResultDto<ExpenseDto>> {
    return apiClient("/expense/create", {
      method: "POST",
      body: expenseData,
    });
  },

  updateExpense(request: UpdateExpenseRequest): Promise<ResultDto<ExpenseDto>> {     
    return apiClient("/expense/update", {
      method: "PUT",
      body: request,
    });
  },

  deleteExpense(request: DeleteExpenseRequest): Promise<ResultDto<boolean>> {
    return apiClient("/expense", {
      method: "DELETE",
      body: request,
    });
  },

  getAllExpensesByTripId(tripId: string): Promise<ResultDto<ExpenseDto[]>> {
    return apiClient(`/expense/all/${tripId}`, {
      method: "GET",
    });
  }
};