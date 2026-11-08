using Common.DTOs;
using Common.Requests.Destination;
using Common.Requests.Trip;
using Common.Responses;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IDestinationService
    {
        Task<ResultDto<List<DestinationDto>>> GetAllByTripByIdAsync(Guid tripId);
        Task<ResultDto<DestinationDto>> CreateDestinationAsync(Guid userId, CreateDestinationRequest request);
        Task<ResultDto<DestinationDto>> UpdateDestinationAsync(UpdateDestinationRequest request);
        Task<ResultDto<bool>> DeleteDestinationAsync(Guid destinationId);
    }
}
