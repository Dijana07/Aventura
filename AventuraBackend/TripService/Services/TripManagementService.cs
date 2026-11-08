using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Common.DTOs;
using Common.Interfaces;
using Common.Requests.Trip;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Fabric;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripService.Enums;
using TripService.Helpers;
using TripService.Mappers;
using TripService.Models;
using TripService.Persistance;

namespace TripService.Services
{
    public class TripManagementService : ITripService
    {
        private readonly TripDbContext _dbContext;
        private readonly IExpenseService _expenseService;
        private readonly Cloudinary _cloudinary;
        private readonly string _frontendUrl;

        public TripManagementService(TripDbContext dbContext, Cloudinary cloudinary, IExpenseService expenseService, string frontendUrl)
        {
            _dbContext = dbContext;
            _expenseService = expenseService;
            _cloudinary = cloudinary;
            _frontendUrl = frontendUrl;
        }

        public async Task<ResultDto<ChecklistItemDto>> CreateChecklistItemAsync(Guid userId, CreateChecklistItemRequest request)
        {
            var item = request.ToEntity(userId);

            _dbContext.ChecklistItems.Add(item);

            await _dbContext.SaveChangesAsync();

            var response = item.ToDto();

            return new ResultDto<ChecklistItemDto>
            {
                Success = true,
                Message = "Checklist item successfully created.",
                Data = response
            };
        }

        public async Task<ResultDto<TripDto>> CreateTripAsync(Guid userId, CreateTripRequest request)
        {
            var trip = request.ToEntity(userId);

            _dbContext.TripPlans.Add(trip);

            await _dbContext.SaveChangesAsync();

            var response = trip.ToDto();

            return new ResultDto<TripDto>
            {
                Success = true,
                Message = "Trip successfully created.",
                Data = response
            };
        }

        public async Task<ResultDto<bool>> DeleteChecklistItemAsync(Guid checklistItemId)
        {          
            int result = await _dbContext.ChecklistItems.Where(t => t.Id == checklistItemId).ExecuteDeleteAsync();
            
            return new ResultDto<bool>
            {
                Success = result > 0,
                Message = result > 0
                    ? "Checklist item deleted successfully."
                    : "Failed to delete checklist item.",
                Data = result > 0
            };
        }

        public async Task<ResultDto<bool>> DeleteTripAsync(Guid tripId)
        {
            var exists = await _dbContext.TripPlans.AnyAsync(t => t.Id == tripId);
            if (!exists)
                return new ResultDto<bool>
                {
                    Success = true,
                    Message = "Trip doesn't exist.",
                };

            var expenseResult = await _expenseService.DeleteExpensesByTripIdAsync(tripId);

            if (!expenseResult.Success)
                return expenseResult;
            
            int result = await _dbContext.TripPlans.Where(t => t.Id == tripId).ExecuteDeleteAsync();
            
            return new ResultDto<bool>
            {
                Success = result > 0,
                Message = result > 0
                    ? "Trip deleted successfully."
                    : "Failed to delete trip.",
                Data = result > 0
            };
        }

        public async Task<ResultDto<bool>> DeleteAllTripsForUserAsync(Guid userId)
        {
            var hasAny = await _dbContext.TripPlans.AnyAsync(t => t.UserId == userId);
            if (!hasAny)
                return new ResultDto<bool>
                {
                    Success = true,
                    Message = "User doesn't have trips.",
                };

            var expenseResult = await _expenseService.DeleteExpensesByUserIdAsync(userId);

            if (!expenseResult.Success)
                return expenseResult;

            int result = await _dbContext.TripPlans.Where(t => t.UserId == userId).ExecuteDeleteAsync();

            return new ResultDto<bool>
            {
                Success = result > 0,
                Message = result > 0
                    ? "Trips for user deleted successfully."
                    : "Failed to delete trips for user.",
                Data = result > 0
            };
        }


        public async Task<ResultDto<List<TripPreviewDto>>> GetAllTripsAsync()
        {
            var previewDtos = await _dbContext.TripPlans
                .Select(trip => trip.ToPreviewDto())
                .ToListAsync();

            return new ResultDto<List<TripPreviewDto>>
            {
                Success = true,
                Message = "Trips fetched successfully.",
                Data = previewDtos
            };
        }

        public async Task<ResultDto<List<TripPreviewDto>>> GetAllTripsForUserAsync(Guid userId)
        {
            var previewDtos = await _dbContext.TripPlans
                .Where(t => t.UserId == userId)
                .Select(trip => trip.ToPreviewDto())
                .ToListAsync();

            return new ResultDto<List<TripPreviewDto>>
            {
                Success = true,
                Message = "Trips fetched successfully.",
                Data = previewDtos
            };
        }

        public async Task<ResultDto<List<TripPreviewDto>>> GetLastThreeTripsForUserAsync(Guid userId)
        {
            var previewDtos = await _dbContext.TripPlans
                .Where(t => t.UserId == userId)
                .OrderByDescending(t => t.CreatedAt)
                .Take(3)
                .Select(trip => trip.ToPreviewDto())
                .ToListAsync();

            return new ResultDto<List<TripPreviewDto>>
            {
                Success = true,
                Message = "Trips fetched successfully.",
                Data = previewDtos
            };
        }

        public async Task<ResultDto<ShareTokenDto>> GetOrCreateShareTokenAsync(CreateShareTokenRequest request)
        {
            if (!Enum.TryParse<TokenAccessType>(request.AccessType, true, out var access))
            {
                return new ResultDto<ShareTokenDto>
                {
                    Success = false,
                    Message = "Invalid access type."
                };
            }

            if(!Guid.TryParse(request.TripId, out var tripId))
            {
                return new ResultDto<ShareTokenDto>
                {
                    Success = false,
                    Message = "Invalid trip id."
                };
            }
            ShareToken? token;
            if (access == TokenAccessType.VIEW)
                token = await _dbContext.ShareTokens.FirstOrDefaultAsync(t => t.TripPlanId == tripId && t.AccessType == TokenAccessType.VIEW);
            else
                token = await _dbContext.ShareTokens.FirstOrDefaultAsync(t => t.TripPlanId == tripId && t.AccessType == TokenAccessType.EDIT && t.AllowedUserEmail == request.AllowedUserEmail);

            if (token == null)
            {
                token = new ShareToken
                {
                    Id = Guid.NewGuid(),
                    AccessType = access,
                    AllowedUserEmail = request.AllowedUserEmail,
                    TripPlanId = tripId,
                    Token = Guid.NewGuid().ToString()
                };
                _dbContext.ShareTokens.Add(token);
                await _dbContext.SaveChangesAsync();
            }

            var link = $"{_frontendUrl}/share/{token.Token}";
            var qrBase64 = QrCodeHelper.GenerateQrBase64(link);

            return new ResultDto<ShareTokenDto>
            {
                Success = true,
                Message = "Share token fetched successfully.",
                Data = new ShareTokenDto
                {
                    Link = link,
                    QrCodeBase64 = qrBase64
                }
            };
        }

        public async Task<ResultDto<TripDto>> GetTripByIdAsync(Guid tripId)
        {
            var expenses = await _expenseService.GetTotalExpensesByTripIdAsync(tripId);
            decimal totalExpenses = expenses.Success ? expenses.Data : 0;
            _dbContext.ChangeTracker.Clear();
            var trip = await _dbContext.TripPlans
                .Include(t => t.Destinations)
                .Include(t => t.Activities)
                .Include(t => t.ChecklistItems)
                .FirstOrDefaultAsync(t => t.Id == tripId);

            if (trip is null)
                return new ResultDto<TripDto>
                {
                    Success = false,
                    Message = "Trip doesn't exist. Fetching failed.",
                    Data = null
                };

            totalExpenses += trip.Activities.Where(a => a.ActivityStatus != ActivityStatus.CANCELLED). Sum(a => a.Budget);
            var tripDto = trip.ToDto(totalExpenses);

            return new ResultDto<TripDto>
            {
                Success = true,
                Message = "Trip details fetched successfully.",
                Data = tripDto
            };
        }

        public async Task<ResultDto<ChecklistItemDto>> UpdateChecklistItemAsync(UpdateChecklistItemRequest request)
        {
            if (!Guid.TryParse(request.ChecklistItemId, out var checklistItemId))
            {
                return new ResultDto<ChecklistItemDto>
                {
                    Success = false,
                    Message = "Checklist utem id is invalid. Updating checklist item failed.",
                };
            }

            var checklistItem = await _dbContext.ChecklistItems.FirstOrDefaultAsync(t => t.Id == checklistItemId);
            
            if (checklistItem == null)
            {
                return new ResultDto<ChecklistItemDto>
                {
                    Success = false,
                    Message = "Checklist item not found. Updating checklist item failed.",
                };
            }

            checklistItem.IsChecked = request.IsChecked;

            await _dbContext.SaveChangesAsync();

            return new ResultDto<ChecklistItemDto>
            {
                Success = true,
                Message = "Checklist item updated successfully.",
                Data = checklistItem.ToDto()
            };
        }       

        public async Task<ResultDto<TripDto>> UpdateTripAsync(UpdateTripRequest request)
        {
            if (!Guid.TryParse(request.TripId, out var tripId))
            {
                return new ResultDto<TripDto>
                {
                    Success = false,
                    Message = "Trip id is invalid. Updating trip failed.",
                };
            }

            var trip = await _dbContext.TripPlans.FirstOrDefaultAsync(t => t.Id == tripId);
            
            if (trip == null)
            {
                return new ResultDto<TripDto>
                {
                    Success = false,
                    Message = "Trip not found. Updating trip failed.",
                };
            }

            if (request.Title != null)
                trip.Title = request.Title;

            if (request.StartDate != null)
                trip.StartDate = request.StartDate.Value;

            if (request.EndDate != null)
                trip.EndDate = request.EndDate.Value;

            if (request.Budget != null)
                trip.Budget = request.Budget.Value;

            if (request.Notes != null)
                trip.Notes = request.Notes;

            if (request.FileDto != null)
            {
                using var stream = new MemoryStream(request.FileDto.Data);

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(request.FileDto.FileName, stream),
                    Folder = "aventura_photos",
                    PublicId = $"photo_trip_{tripId}",
                    Overwrite = true,
                    Invalidate = true
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                trip.PhotoUrl = uploadResult.SecureUrl.ToString();
            }

            await _dbContext.SaveChangesAsync();

            return new ResultDto<TripDto>
            {
                Success = true,
                Message = "Trip updated successfully.",
                Data = trip.ToDto()
            };
        }
    }
}
