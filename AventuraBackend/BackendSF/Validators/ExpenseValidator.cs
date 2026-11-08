using Common.DTOs;
using Common.Requests.Expense;

namespace BackendSF.Validators
{
    public static class ExpenseValidator
    {
        public static ValidationResultDto ValidateCreateExpenseRequest(CreateExpenseRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Create expense request is null.");

            if (string.IsNullOrWhiteSpace(request.Title))
                return new ValidationResultDto(false, "Title is required.");

            if (string.IsNullOrWhiteSpace(request.Description))
                return new ValidationResultDto(false, "Description is required.");

            if (string.IsNullOrWhiteSpace(request.Category))
                return new ValidationResultDto(false, "Category is required.");

            if (request.Amount < 0)
                return new ValidationResultDto(false, "Amount cannot be negative.");

            return new ValidationResultDto(true, "Create expense request is valid.");
        }

        public static ValidationResultDto ValidateUpdateExpenseRequest(UpdateExpenseRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Update expense request is null.");

            if (request.Title != null && request.Title == string.Empty)
                return new ValidationResultDto(false, "Title cannot be empty.");

            if (request.Category != null && request.Category == string.Empty)
                return new ValidationResultDto(false, "Category cannot be empty.");

            if (request.Description != null && request.Description == string.Empty)
                return new ValidationResultDto(false, "Description cannot be empty.");

            if (request.Amount != null && request.Amount < 0)
                return new ValidationResultDto(false, "Amount cannot be negative.");

            return new ValidationResultDto(true, "Update expense request is valid.");
        }
    }
}
