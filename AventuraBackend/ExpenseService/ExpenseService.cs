using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Common.DTOs;
using Common.Interfaces;
using Common.Requests.Expense;
using ExpenseService.Enums;
using ExpenseService.Mappers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using TripService.Persistance;

namespace ExpenseService
{
    /// <summary>
    /// An instance of this class is created for each service instance by the Service Fabric runtime.
    /// </summary>
    internal sealed class ExpenseService : StatelessService, IExpenseService
    {
        private readonly ExpenseDbContext _dbContext;
        private readonly ITripPlanService _tripService;

        public ExpenseService(StatelessServiceContext context)
            : base(context)
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString =
                configuration.GetConnectionString("ExpenseDatabase");

            var options = new DbContextOptionsBuilder<ExpenseDbContext>()
            .UseSqlServer(connectionString)
                .Options;

            _tripService = ServiceProxy.Create<ITripPlanService>(
                new Uri("fabric:/Aventura/TripService"),
                new ServicePartitionKey(0));

            _dbContext = new ExpenseDbContext(options);
        }

        public async Task<ResultDto<ExpenseDto>> CreateExpenseAsync(Guid userId, string userEmail, bool isAdmin, CreateExpenseRequest request)
        {
            var canEdit = await _tripService.CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<ExpenseDto>
                {
                    Success = false,
                    Message = "User does not have permission to add expenses to this trip."
                };
            }
            var expense = request.ToEntity(userId);

            if (Enum.TryParse<ExpenseCategory>(request.Category, true, out var category))
            {
                expense.Category = category;
            }
            else
            {
                expense.Category = ExpenseCategory.OTHER;
            }

            _dbContext.Expenses.Add(expense);

            await _dbContext.SaveChangesAsync();
            await _tripService.RemoveTripCache(request.TripId);
            var response = expense.ToDto();

            return new ResultDto<ExpenseDto>
            {
                Success = true,
                Message = "Expense successfully created.",
                Data = response
            };
        }

        public async Task<ResultDto<bool>> DeleteExpenseAsync(Guid userId, string userEmail, bool isAdmin, DeleteExpenseRequest request)
        {
            var canEdit = await _tripService.CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "User does not have permission to delete expenses for this trip."
                };
            }
            if (!Guid.TryParse(request.ExpenseId, out var expenseId))
            {
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "Expense id is invalid. Deleting expense failed.",
                    Data = false
                };
            }
            int result = await _dbContext.Expenses.Where(t => t.Id == expenseId).ExecuteDeleteAsync();

            if (result == 0)
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "Failed to delete expense.",
                    Data = false
                };

            await _tripService.RemoveTripCache(request.TripId);
            return new ResultDto<bool>
            {
                Success = true,
                Message = "Expense deleted successfully.",
                Data = true
            };
        }

        public async Task<ResultDto<bool>> DeleteExpensesByTripIdAsync(Guid tripId)
        {
            var hasAny = await _dbContext.Expenses.AnyAsync(t => t.TripId == tripId);
            if (!hasAny)
                return new ResultDto<bool>
                {
                    Success = true,
                    Message = "Trip doesn't have expenses.",
                };

            int result = await _dbContext.Expenses.Where(t => t.TripId == tripId).ExecuteDeleteAsync();

            if (result == 0)
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "Failed to delete expenses.",
                    Data = false
                };

            return new ResultDto<bool>
            {
                Success = true,
                Message = "Expenses deleted successfully.",
                Data = true
            };
        }

        public async Task<ResultDto<bool>> DeleteExpensesByUserIdAsync(Guid userId)
        {
            var hasAny = await _dbContext.Expenses.AnyAsync(t => t.UserId == userId);
            if (!hasAny)
                return new ResultDto<bool>
                {
                    Success = true,
                    Message = "User doesn't have expenses.",
                };

            int result = await _dbContext.Expenses.Where(t => t.UserId == userId).ExecuteDeleteAsync();

            if (result == 0)
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "Failed to delete expenses.",
                    Data = false
                };

            return new ResultDto<bool>
            {
                Success = true,
                Message = "Expenses deleted successfully.",
                Data = true
            };
        }

        public async Task<ResultDto<List<ExpenseDto>>> GetAllByTripByIdAsync(Guid userId, string userEmail, bool isAdmin, Guid tripId)
        {
            var canEdit = await _tripService.CanEditAsync(userId, userEmail, isAdmin, tripId.ToString());
            var canView = await _tripService.CanViewAsync(userId, "canView", tripId);

            if (!canEdit && !canView)
            {
                return new ResultDto<List<ExpenseDto>>
                {
                    Success = false,
                    Message = "User does not have permission to retreive expenses for this trip."
                };
            }

            var result = await _dbContext.Expenses
                .Where(d => d.TripId == tripId)
                .Select(expense => expense.ToDto())
                .ToListAsync();

            return new ResultDto<List<ExpenseDto>>
            {
                Success = true,
                Message = "Expenses fetched successfully.",
                Data = result
            };
        }

        public async Task<ResultDto<decimal>> GetTotalExpensesByTripIdAsync(Guid tripId)
        {
            var result = await _dbContext.Expenses
                .Where(d => d.TripId == tripId)
                .Select(expense => expense.Amount)
                .ToListAsync();

            return new ResultDto<decimal>
            {
                Success = true,
                Message = "Total expenses fetched successfully.",
                Data = result.Any() ? result.Sum() : 0
            };
        }

        public async Task<ResultDto<ExpenseDto>> UpdateExpenseAsync(Guid userId, string userEmail, bool isAdmin, UpdateExpenseRequest request)
        {
            var canEdit = await _tripService.CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<ExpenseDto>
                {
                    Success = false,
                    Message = "User does not have permission to update expenses for this trip."
                };
            }
            if (!Guid.TryParse(request.ExpenseId, out var expenseId))
            {
                return new ResultDto<ExpenseDto>
                {
                    Success = false,
                    Message = "Expense id is invalid. Updating expense failed.",
                };
            }

            var expense = await _dbContext.Expenses.FirstOrDefaultAsync(t => t.Id == expenseId);

            if (expense == null)
            {
                return new ResultDto<ExpenseDto>
                {
                    Success = false,
                    Message = "Expense not found. Updating expense failed.",
                };
            }

            if (request.Title != null)
                expense.Title = request.Title;

            if (request.Date != null)
                expense.Date = request.Date.Value;

            if (request.Amount != null)
                expense.Amount = request.Amount.Value;

            if (request.Description != null)
                expense.Description = request.Description;

            if (request.Category != null && Enum.TryParse<ExpenseCategory>(request.Category, true, out var category))
            {
                expense.Category = category;
            }

            await _dbContext.SaveChangesAsync();
            await _tripService.RemoveTripCache(request.TripId);
            return new ResultDto<ExpenseDto>
            {
                Success = true,
                Message = "Expense updated successfully.",
                Data = expense.ToDto()
            };
        }

        /// <summary>
        /// Optional override to create listeners (e.g., TCP, HTTP) for this service replica to handle client or user requests.
        /// </summary>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }       
    }
}
