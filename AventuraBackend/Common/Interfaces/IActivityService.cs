using Common.DTOs;
using Common.Requests.Activity;
using Common.Requests.Destination;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IActivityService
    {
        Task<ResultDto<List<ActivityDto>>> GetAllByTripByIdAsync(Guid tripId);
        Task<ResultDto<decimal>> GetTotalExpensesByTripIdAsync(Guid tripId);
        Task<ResultDto<ActivityDto>> CreateActivityAsync(Guid userId, CreateActivityRequest request);
        Task<ResultDto<ActivityDto>> UpdateActivityAsync(UpdateActivityRequest request);
        Task<ResultDto<bool>> DeleteActivityAsync(Guid activityId);
    }
}
