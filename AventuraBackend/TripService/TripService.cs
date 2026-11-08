using Azure;
using Azure.Core;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Common.DTOs;
using Common.Interfaces;
using Common.Requests.Activity;
using Common.Requests.Destination;
using Common.Requests.Trip;
using Common.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.ServiceFabric.Data.Collections;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using System.Fabric;
using TripService.Enums;
using TripService.Helpers;
using TripService.Models;
using TripService.Persistance;
using TripService.Services;

namespace TripService
{
    /// <summary>
    /// An instance of this class is created for each service replica by the Service Fabric runtime.
    /// </summary>
    internal sealed class TripService : StatefulService, ITripPlanService
    {
        private readonly TripDbContext _dbContext;
        private readonly ITripService _tripService;
        private readonly IDestinationService _destinationService;
        private readonly IActivityService _activityService;
        private readonly IExpenseService _expenseService;
        private readonly Cloudinary _cloudinary;
        private readonly string _frontendUrl;
        private const string TripDetailsCacheName = "TripDetailsCache";

        public TripService(StatefulServiceContext context)
            : base(context)
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString =
                configuration.GetConnectionString("TripDatabase");

            var options = new DbContextOptionsBuilder<TripDbContext>()
                .UseSqlServer(connectionString)
                .Options;

            _dbContext = new TripDbContext(options);

            _expenseService = ServiceProxy.Create<IExpenseService>(
                new Uri("fabric:/Aventura/ExpenseService"));

            var account = new Account(
                configuration["Cloudinary:CloudName"],
                configuration["Cloudinary:ApiKey"],
                configuration["Cloudinary:ApiSecret"]);

            _cloudinary = new Cloudinary(account);

            _frontendUrl = configuration["FrontendUrl"];

            _tripService = new TripManagementService(_dbContext, _cloudinary, _expenseService, _frontendUrl);
            _destinationService = new DestinationManagementService(_dbContext);
            _activityService = new ActivityManagementService(_dbContext, _expenseService);
        }

        public async Task<ResultDto<ActivityDto>> CreateActivityAsync(Guid userId, string userEmail, bool isAdmin, CreateActivityRequest request)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<ActivityDto>
                {
                    Success = false,
                    Message = "User does not have permission to add activity to this trip."
                };
            }
            var result = await _activityService.CreateActivityAsync(userId, request);
            if (result.Success)
                await RemoveTripCache(request.TripId);

            return result;
        }

        public async Task<ResultDto<ChecklistItemDto>> CreateChecklistItemAsync(Guid userId, string userEmail, bool isAdmin, CreateChecklistItemRequest request)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<ChecklistItemDto>
                {
                    Success = false,
                    Message = "User does not have permission to add checklist item to this trip."
                };
            }
            var result = await _tripService.CreateChecklistItemAsync(userId, request);
            if (result.Success)
                await RemoveTripCache(request.TripId);

            return result;
        }

        public async Task<ResultDto<DestinationDto>> CreateDestinationAsync(Guid userId, string userEmail, bool isAdmin, CreateDestinationRequest request)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<DestinationDto>
                {
                    Success = false,
                    Message = "User does not have permission to add destination to this trip."
                };
            }
            var result = await _destinationService.CreateDestinationAsync(userId, request);
            if (result.Success)
                await RemoveTripCache(request.TripId);

            return result;
        }

        public async Task<ResultDto<TripDto>> CreateTripAsync(Guid userId, CreateTripRequest request)
        {
            return await _tripService.CreateTripAsync(userId, request);
        }


        public async Task<ResultDto<bool>> DeleteActivityAsync(Guid userId, string userEmail, bool isAdmin, DeleteActivityRequest request)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "User does not have permission to delete activities for this trip."
                };
            }
            if(!Guid.TryParse(request.ActivityId, out Guid activityGuid))
            {
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "Invalid activity ID format."
                };
            }
            var result = await _activityService.DeleteActivityAsync(activityGuid);
            if (result.Success)
                await RemoveTripCache(request.TripId);

            return result;
        }

        public async Task<ResultDto<bool>> DeleteChecklistItemAsync(Guid userId, string userEmail, bool isAdmin, DeleteChecklistItemRequest request)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "User does not have permission to delete checklist items for this trip."
                };
            }
            if (!Guid.TryParse(request.ChecklistItemId, out Guid checklistItemGuid))
            {
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "Invalid checklist item ID format."
                };
            }
            var result = await _tripService.DeleteChecklistItemAsync(checklistItemGuid);
            if (result.Success)
                await RemoveTripCache(request.TripId);

            return result;
        }

        public async Task<ResultDto<bool>> DeleteDestinationAsync(Guid userId, string userEmail, bool isAdmin, DeleteDestinationRequest request)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "User does not have permission to delete destinations for this trip."
                };
            }
            if (!Guid.TryParse(request.DestinationId, out Guid destinationGuid))
            {
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "Invalid destination ID format."
                };
            }
            var result = await _destinationService.DeleteDestinationAsync(destinationGuid);
            if (result.Success)
                await RemoveTripCache(request.TripId);

            return result;
        }

        public async Task<ResultDto<bool>> DeleteTripAsync(Guid userId, string userEmail, bool isAdmin, Guid tripId)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, tripId.ToString());
            if (!canEdit)
            {
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "User does not have permission to delete this trip."
                };
            }
            var result = await _tripService.DeleteTripAsync(tripId);
            if (result.Success)
                await RemoveTripCache(tripId.ToString());

            return result;
        }

        public async Task<ResultDto<bool>> DeleteAllTripsForUserAsync(Guid userId)
        {
            return await _tripService.DeleteAllTripsForUserAsync(userId);
        }

        public async Task<ResultDto<List<TripPreviewDto>>> GetAllTripsAsync()
        {
            return await _tripService.GetAllTripsAsync();
        }

        public async Task<ResultDto<List<TripPreviewDto>>> GetAllTripsForUserAsync(Guid userId)
        {
            return await _tripService.GetAllTripsForUserAsync(userId);  
        }

        public async Task<ResultDto<List<TripPreviewDto>>> GetLastThreeTripsForUserAsync(Guid userId)
        {
            return await _tripService.GetAllTripsForUserAsync(userId);
        }

        public async Task<ResultDto<ShareTokenDto>> GetOrCreateShareTokenAsync(CreateShareTokenRequest request)
        {
            return await _tripService.GetOrCreateShareTokenAsync(request);
        }

        public async Task<ResultDto<decimal>> GetTotalExpensesByTripIdAsync(Guid userId, string userEmail, bool isAdmin, Guid tripId)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, tripId.ToString());
            if (!canEdit)
            {
                return new ResultDto<decimal>
                {
                    Success = false,
                    Message = "User does not have permission to get expenses for this trip."
                };
            }
            return await _activityService.GetTotalExpensesByTripIdAsync(tripId);
        }

        public async Task<ResultDto<TripDto>> GetTripByIdAsync(Guid userId, string userEmail, bool isAdmin, Guid tripId)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, tripId.ToString());
            if (!canEdit)
            {
                return new ResultDto<TripDto>
                {
                    Success = false,
                    Message = "User does not have permission to retrieve this trip."
                };
            }


            var cache = await StateManager.GetOrAddAsync<IReliableDictionary<Guid, TripDto>>(TripDetailsCacheName);
            using var tx = StateManager.CreateTransaction();
            var cachedTrip = await cache.TryGetValueAsync(tx, tripId);

            if (cachedTrip.HasValue)
            {
                cachedTrip.Value.CanEdit = canEdit;
                return new ResultDto<TripDto>
                {
                    Success = true,
                    Message = "Trip details fetched successfully.",
                    Data = cachedTrip.Value
                };
            }

            var trip = await _tripService.GetTripByIdAsync(tripId);
            if (trip.Data != null)
                trip.Data.CanEdit = canEdit;

            if (trip.Data != null)
            {
                await cache.SetAsync(tx, tripId, trip.Data);
                await tx.CommitAsync();
            }

            return trip;
        }

        public async Task<ResultDto<TripDto>> GetTripByTokenAsync(Guid userId, string userEmail, bool isAdmin, string token)
        {
            var tripId = await _dbContext.ShareTokens
                .Where(st => st.Token == token)
                .Select(st => new { st.TripPlanId })
                .FirstOrDefaultAsync();

            if (tripId == null)
            {
                return new ResultDto<TripDto>
                {
                    Success = false,
                    Message = "Invalid share token."
                };
            }

            if (await CanViewAsync(userId, token, tripId.TripPlanId))
            {                         
                var tripDetails = await _tripService.GetTripByIdAsync(tripId.TripPlanId);
                if (tripDetails.Data != null)
                    tripDetails.Data.CanEdit = false;
                return tripDetails;
            }

            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, tripId.TripPlanId.ToString());
            if (!canEdit)
            {
                return new ResultDto<TripDto>
                {
                    Success = false,
                    Message = "User does not have permission to retrieve this trip."
                };
            }    
            var trip = await _tripService.GetTripByIdAsync(tripId.TripPlanId);
            if (trip.Data != null)
                trip.Data.CanEdit = canEdit;
            return trip;
        }

        public async Task<ResultDto<ActivityDto>> UpdateActivityAsync(Guid userId, string userEmail, bool isAdmin, UpdateActivityRequest request)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<ActivityDto>
                {
                    Success = false,
                    Message = "User does not have permission to update activities for this trip."
                };
            }
            var result = await _activityService.UpdateActivityAsync(request);
            if (result.Success)
                await RemoveTripCache(request.TripId);

            return result;
        }

        public async Task<ResultDto<ChecklistItemDto>> UpdateChecklistItemAsync(Guid userId, string userEmail, bool isAdmin, UpdateChecklistItemRequest request)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<ChecklistItemDto>
                {
                    Success = false,
                    Message = "User does not have permission to update checklist items for this trip."
                };
            }
            var result = await _tripService.UpdateChecklistItemAsync(request);
            if (result.Success)
                await RemoveTripCache(request.TripId);

            return result;
        }

        public async Task<ResultDto<DestinationDto>> UpdateDestinationAsync(Guid userId, string userEmail, bool isAdmin, UpdateDestinationRequest request)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<DestinationDto>
                {
                    Success = false,
                    Message = "User does not have permission to update destinations for this trip."
                };
            }
            var result = await _destinationService.UpdateDestinationAsync(request);
            if (result.Success)
                await RemoveTripCache(request.TripId);

            return result;
        }

        public async Task<ResultDto<TripDto>> UpdateTripAsync(Guid userId, string userEmail, bool isAdmin, UpdateTripRequest request)
        {
            var canEdit = await CanEditAsync(userId, userEmail, isAdmin, request.TripId);
            if (!canEdit)
            {
                return new ResultDto<TripDto>
                {
                    Success = false,
                    Message = "User does not have permission to update this trip."
                };
            }
            var result = await _tripService.UpdateTripAsync(request);
            if (result.Success)
                await RemoveTripCache(request.TripId);

            return result;
        }


        public async Task<bool> CanEditAsync(Guid userId, string userEmail, bool isAdmin, string tripId)
        {
            if (isAdmin)
                return true;

            if(!Guid.TryParse(tripId, out Guid tripGuid))
                return false;

            var trip = await _dbContext.TripPlans
                .Where(t => t.Id == tripGuid)
                .Select(t => new { t.UserId })
                .FirstOrDefaultAsync();

            if (trip == null)
                return false;

            if (trip.UserId == userId)
                return true;

            return await _dbContext.ShareTokens.AnyAsync(st =>
                st.TripPlanId == tripGuid &&
                st.AllowedUserEmail == userEmail &&
                st.AccessType == TokenAccessType.EDIT);
        }

        public async Task<bool> CanViewAsync(Guid userId, string token, Guid tripId)
        {         
            if (token == "canView")
                return await _dbContext.ShareTokens.AnyAsync(st =>             
                    st.TripPlanId == tripId &&
                    st.AccessType == TokenAccessType.VIEW);

            return await _dbContext.ShareTokens.AnyAsync(st =>
                st.Token == token &&
                st.TripPlanId == tripId &&
                st.AccessType == TokenAccessType.VIEW);
        }

        public async Task RemoveTripCache(string tripId)
        {
            if (!Guid.TryParse(tripId, out Guid tripGuid))
                return;

            var cache = await StateManager.GetOrAddAsync<IReliableDictionary<Guid, TripDto>>(TripDetailsCacheName);
            using var tx = StateManager.CreateTransaction();
            await cache.TryRemoveAsync(tx, tripGuid);

            await tx.CommitAsync();
        }

        /// <summary>
        /// Optional override to create listeners (e.g., HTTP, Service Remoting, WCF, etc.) for this service replica to handle client or user requests.
        /// </summary>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceReplicaListener>CreateServiceReplicaListeners()
        {
            return this.CreateServiceRemotingReplicaListeners();
        }
    }
}
