using Common.DTOs;
using Common.Requests.Expense;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IExpenseService : IService
    {
        Task<ResultDto<List<ExpenseDto>>> GetAllByTripByIdAsync(Guid userId, string userEmail, bool isAdmin, Guid tripId);
        Task<ResultDto<decimal>> GetTotalExpensesByTripIdAsync(Guid tripId);
        Task<ResultDto<ExpenseDto>> CreateExpenseAsync(Guid userId, string userEmail, bool isAdmin, CreateExpenseRequest request);
        Task<ResultDto<ExpenseDto>> UpdateExpenseAsync(Guid userId, string userEmail, bool isAdmin, UpdateExpenseRequest request);
        Task<ResultDto<bool>> DeleteExpenseAsync(Guid userId, string userEmail, bool isAdmin, DeleteExpenseRequest request);
        Task<ResultDto<bool>> DeleteExpensesByTripIdAsync(Guid tripId);
        Task<ResultDto<bool>> DeleteExpensesByUserIdAsync(Guid userId);
    }
}
