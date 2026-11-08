using Common.DTOs;
using Common.Requests.Activity;
using Common.Requests.Destination;
using Common.Requests.Trip;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface ITripPlanService : IService
    {
        // ------------- planovi ---------------
        Task<ResultDto<List<TripPreviewDto>>> GetAllTripsAsync(); // za admina // preview plana
        Task<ResultDto<List<TripPreviewDto>>> GetAllTripsForUserAsync(Guid userId); // preview plana
        Task<ResultDto<List<TripPreviewDto>>> GetLastThreeTripsForUserAsync(Guid userId); // preview plana
        Task<ResultDto<TripDto>> GetTripByIdAsync(Guid userId, string userEmail, bool isAdmin, Guid tripId); // detaljni prikaz
        Task<ResultDto<TripDto>> GetTripByTokenAsync(Guid userId, string userEmail, bool isAdmin, string token);
        Task<ResultDto<TripDto>> CreateTripAsync(Guid userId, CreateTripRequest request);
        Task<ResultDto<TripDto>> UpdateTripAsync(Guid userId, string userEmail, bool isAdmin, UpdateTripRequest request);
        Task<ResultDto<bool>> DeleteTripAsync(Guid userId, string userEmail, bool isAdmin, Guid tripId);
        Task<ResultDto<bool>> DeleteAllTripsForUserAsync(Guid userId);

        // -------------------------------------

        // ------------ checklist --------------
        Task<ResultDto<ChecklistItemDto>> CreateChecklistItemAsync(Guid userId, string userEmail, bool isAdmin, CreateChecklistItemRequest request);
        Task<ResultDto<ChecklistItemDto>> UpdateChecklistItemAsync(Guid userId, string userEmail, bool isAdmin, UpdateChecklistItemRequest request);
        Task<ResultDto<bool>> DeleteChecklistItemAsync(Guid userId, string userEmail, bool isAdmin, DeleteChecklistItemRequest request);
        // -------------------------------------

        // ----------- share token -------------
        Task<ResultDto<ShareTokenDto>> GetOrCreateShareTokenAsync(CreateShareTokenRequest request);
        // -------------------------------------

        // ------------ destinacije ------------
        Task<ResultDto<DestinationDto>> CreateDestinationAsync(Guid userId, string userEmail, bool isAdmin, CreateDestinationRequest request);
        Task<ResultDto<DestinationDto>> UpdateDestinationAsync(Guid userId, string userEmail, bool isAdmin, UpdateDestinationRequest request);
        Task<ResultDto<bool>> DeleteDestinationAsync(Guid userId, string userEmail, bool isAdmin, DeleteDestinationRequest request);
        // -------------------------------------

        // ----------- aktivnosti --------------
        Task<ResultDto<decimal>> GetTotalExpensesByTripIdAsync(Guid userId, string userEmail, bool isAdmin, Guid tripId);
        Task<ResultDto<ActivityDto>> CreateActivityAsync(Guid userId, string userEmail, bool isAdmin, CreateActivityRequest request);
        Task<ResultDto<ActivityDto>> UpdateActivityAsync(Guid userId, string userEmail, bool isAdmin, UpdateActivityRequest request);
        Task<ResultDto<bool>> DeleteActivityAsync(Guid userId, string userEmail, bool isAdmin, DeleteActivityRequest request);
        // -------------------------------------

        // ------------ helpers ----------------
        Task<bool> CanEditAsync(Guid userId, string userEmail, bool isAdmin, string tripId);
        Task<bool> CanViewAsync(Guid userId, string token, Guid tripId);
        Task RemoveTripCache(string tripId);
        // -------------------------------------
    }
}
