using Common.DTOs;
using Common.Requests.Auth;
using Common.Requests;
using Common.Responses;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common.Requests.Trip;

namespace Common.Interfaces
{
    public interface ITripService
    {
        // ------------- planovi --------------
        Task<ResultDto<List<TripPreviewDto>>> GetAllTripsAsync(); // za admina // preview plana
        Task<ResultDto<List<TripPreviewDto>>> GetAllTripsForUserAsync(Guid userId); // preview plana
        Task<ResultDto<List<TripPreviewDto>>> GetLastThreeTripsForUserAsync(Guid userId); // preview plana
        Task<ResultDto<TripDto>> GetTripByIdAsync(Guid tripId); // detaljni prikaz
        Task<ResultDto<TripDto>> CreateTripAsync(Guid userId, CreateTripRequest request);
        Task<ResultDto<TripDto>> UpdateTripAsync(UpdateTripRequest request);
        Task<ResultDto<bool>> DeleteTripAsync(Guid tripId);
        Task<ResultDto<bool>> DeleteAllTripsForUserAsync(Guid userId);
        // ------------------------------------

        // ------------ checklist -------------
        Task<ResultDto<ChecklistItemDto>> CreateChecklistItemAsync(Guid userId, CreateChecklistItemRequest request);
        Task<ResultDto<ChecklistItemDto>> UpdateChecklistItemAsync(UpdateChecklistItemRequest request);
        Task<ResultDto<bool>> DeleteChecklistItemAsync(Guid checklistItemId);
        // ------------------------------------

        // ----------- share token ------------
        Task<ResultDto<ShareTokenDto>> GetOrCreateShareTokenAsync(CreateShareTokenRequest request);
        // ------------------------------------
    }
}
