import type { CreateExpenseRequest } from "@/models/expense/CreateExpenseRequest";
import type { UpdateExpenseRequest } from "@/models/expense/UpdateExpenseRequest";

export function validateCreateExpense(request: CreateExpenseRequest): string | null {
  if (!request.title.trim())
    return "Title is required.";

  if (!request.description.trim())
    return "Description is required.";

  if (!request.category.trim())
    return "Category is required.";

  if (request.amount < 0)
    return "Amount cannot be negative.";

  return null;
}

export function validateUpdateExpense(request: UpdateExpenseRequest): string | null {
  if (request.title !== undefined && !request.title.trim())
    return "Title cannot be empty.";

  if (request.description !== undefined && !request.description.trim())
    return "Description cannot be empty.";

  if (request.category !== undefined && !request.category.trim())
    return "Category cannot be empty.";

  if (request.amount !== undefined && request.amount < 0)
    return "Amount cannot be negative.";

  return null;
}