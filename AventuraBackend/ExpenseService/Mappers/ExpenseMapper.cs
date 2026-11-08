using Common.DTOs;
using Common.Requests.Expense;
using ExpenseService.Enums;
using ExpenseService.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpenseService.Mappers
{
    public static class ExpenseMapper
    {
        public static ExpenseDto ToDto(
            this Expense expense)
        {
            return new ExpenseDto
            {
                Id = expense.Id.ToString(),
                Title = expense.Title,
                Date = expense.Date,
                Description = expense.Description,
                Amount = expense.Amount,
                CreatedAt = expense.CreatedAt,
                Category = expense.Category.ToString()
            };
        }

        public static Expense ToEntity(
            this CreateExpenseRequest request,
            Guid userId)
        {
            return new Expense
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TripId = Guid.Parse(request.TripId),
                Title = request.Title,
                Date = request.DateTime,
                Description = request.Description,
                Amount = request.Amount,
                CreatedAt = DateTime.UtcNow,
                Category = Enum.Parse<ExpenseCategory>(
                    request.Category)
            };
        }
    }
}
