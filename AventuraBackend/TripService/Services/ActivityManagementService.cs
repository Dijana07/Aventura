using Common.DTOs;
using Common.Interfaces;
using Common.Requests.Activity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripService.Enums;
using TripService.Mappers;
using TripService.Persistance;

namespace TripService.Services
{
    public class ActivityManagementService : IActivityService
    {
        private readonly TripDbContext _dbContext;
        private readonly IExpenseService _expenseService;

        public ActivityManagementService(TripDbContext dbContext, IExpenseService expenseService)
        {
            _dbContext = dbContext;
            _expenseService = expenseService;
        }

        public async Task<ResultDto<ActivityDto>> CreateActivityAsync(Guid userId, CreateActivityRequest request)
        {
            var trip = await _dbContext.TripPlans
                .Where(t => t.Id.ToString() == request.TripId)
                .Select(t => new { t.StartDate, t.EndDate})
                .FirstOrDefaultAsync();

            if (request.StartDate < trip!.StartDate || request.EndDate > trip!.EndDate)
            {
                return new ResultDto<ActivityDto>
                {
                    Success = true,
                    Message = "Activity dates cannot go beyond trip dates.",
                };
            }

            var activity = request.ToEntity(userId);

            _dbContext.Activities.Add(activity);

            await _dbContext.SaveChangesAsync();

            var response = activity.ToDto();

            return new ResultDto<ActivityDto>
            {
                Success = true,
                Message = "Activity successfully created.",
                Data = response
            };
        }

        public async Task<ResultDto<bool>> DeleteActivityAsync(Guid activityId)
        {
            int result = await _dbContext.Activities.Where(t => t.Id == activityId).ExecuteDeleteAsync();
            
            if (result == 0)
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "Failed to delete activity.",
                    Data = false
                };

            return new ResultDto<bool>
            {
                Success = true,
                Message = "Activity deleted successfully.",
                Data = true
            };
        }
     

        public async Task<ResultDto<List<ActivityDto>>> GetAllByTripByIdAsync(Guid tripId)
        {
            var result = await _dbContext.Activities
                .Where(d => d.TripId == tripId)
                .Select(activity => activity.ToDto())
                .ToListAsync();
            
            return new ResultDto<List<ActivityDto>>
            {
                Success = true,
                Message = "Activities fetched successfully.",
                Data = result
            };
        }

        public async Task<ResultDto<decimal>> GetTotalExpensesByTripIdAsync(Guid tripId)
        {
            var expenses = await _expenseService.GetTotalExpensesByTripIdAsync(tripId);
            decimal totalExpenses = expenses.Success ? expenses.Data : 0;

            var activitiesExpenses = await _dbContext.Activities
                .Where(a => a.TripId == tripId && a.ActivityStatus != ActivityStatus.CANCELLED)
                .SumAsync(a => (decimal?)a.Budget) ?? 0;

            totalExpenses += activitiesExpenses;
            return new ResultDto<decimal>
            {
                Success = true,
                Message = "Total expenses fetched successfully.",
                Data = totalExpenses
            };
        }

        public async Task<ResultDto<ActivityDto>> UpdateActivityAsync(UpdateActivityRequest request)
        {
            var trip = await _dbContext.TripPlans
                .Where(t => t.Id.ToString() == request.TripId)
                .Select(t => new { t.StartDate, t.EndDate })
                .FirstOrDefaultAsync();

            if (request.StartDate < trip!.StartDate || request.EndDate > trip!.EndDate)
            {
                return new ResultDto<ActivityDto>
                {
                    Success = true,
                    Message = "Activity dates cannot go beyond trip dates.",
                };
            }

            if (!Guid.TryParse(request.ActivityId, out var activityId))
            {
                return new ResultDto<ActivityDto>
                {
                    Success = false,
                    Message = "Activity id is invalid. Updating activity failed.",
                };
            }

            var activity = await _dbContext.Activities.FirstOrDefaultAsync(t => t.Id == activityId);
           
            if (activity == null)
            {
                return new ResultDto<ActivityDto>
                {
                    Success = false,
                    Message = "Activity not found. Updating activity failed.",
                };
            }

            if (request.Title != null)
                activity.Title = request.Title;

            if (request.StartDate != null)
                activity.StartDateTime = request.StartDate.Value;

            if (request.EndDate != null)
                activity.EndDateTime = request.EndDate.Value;

            if (request.Location != null)
                activity.Location = request.Location;

            if (request.Notes != null)
                activity.Notes = request.Notes;

            if (request.Description != null)
                activity.Description = request.Description;

            if (request.Budget != null)
                activity.Budget = (decimal)request.Budget;

            if (request.ActivityStatus != null && Enum.TryParse<ActivityStatus>(request.ActivityStatus, true, out var status))
            {
                activity.ActivityStatus = status;
            }

            await _dbContext.SaveChangesAsync();

            return new ResultDto<ActivityDto>
            {
                Success = true,
                Message = "Activity updated successfully.",
                Data = activity.ToDto()
            };
        }
    }
}
