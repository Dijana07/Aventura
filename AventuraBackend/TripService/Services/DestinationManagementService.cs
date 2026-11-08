using Common.DTOs;
using Common.Interfaces;
using Common.Requests.Destination;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripService.Mappers;
using TripService.Models;
using TripService.Persistance;

namespace TripService.Services
{
    public class DestinationManagementService : IDestinationService
    {
        private readonly TripDbContext _dbContext;

        public DestinationManagementService(TripDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<ResultDto<DestinationDto>> CreateDestinationAsync(Guid userId, CreateDestinationRequest request)
        {
            var trip = await _dbContext.TripPlans
                .Where(t => t.Id.ToString() == request.TripId)
                .Select(t => new { t.StartDate, t.EndDate })
                .FirstOrDefaultAsync();

            if (request.StartDate < trip!.StartDate || request.EndDate > trip!.EndDate)
            {
                return new ResultDto<DestinationDto>
                {
                    Success = true,
                    Message = "Destination dates cannot go beyond trip dates.",
                };
            }

            var destination = request.ToEntity(userId);

            _dbContext.Destinations.Add(destination);

            await _dbContext.SaveChangesAsync();

            var response = destination.ToDto();

            return new ResultDto<DestinationDto>
            {
                Success = true,
                Message = "Destination successfully created.",
                Data = response
            };
        }

        public async Task<ResultDto<bool>> DeleteDestinationAsync(Guid destinationId)
        {
            int result = await _dbContext.Destinations.Where(t => t.Id == destinationId).ExecuteDeleteAsync();
            
            if (result == 0)
                return new ResultDto<bool>
                {
                    Success = false,
                    Message = "Failed to delete destination.",
                    Data = false
                };

            return new ResultDto<bool>
            {
                Success = true,
                Message = "Destination deleted successfully.",
                Data = true
            };
        }
       

        public async Task<ResultDto<List<DestinationDto>>> GetAllByTripByIdAsync(Guid tripId)
        {
            var result  = await _dbContext.Destinations
                .Where(d => d.TripId == tripId)
                .Select(dest => dest.ToDto())
                .ToListAsync();
            
            return new ResultDto<List<DestinationDto>>
            {
                Success = true,
                Message = "Destinations fetched successfully.",
                Data = result
            };
        }

        public async Task<ResultDto<DestinationDto>> UpdateDestinationAsync(UpdateDestinationRequest request)
        {
            var trip = await _dbContext.TripPlans
                .Where(t => t.Id.ToString() == request.TripId)
                .Select(t => new { t.StartDate, t.EndDate })
                .FirstOrDefaultAsync();

            if (request.StartDate < trip!.StartDate || request.EndDate > trip!.EndDate)
            {
                return new ResultDto<DestinationDto>
                {
                    Success = true,
                    Message = "Destination dates cannot go beyond trip dates.",
                };
            }

            if (!Guid.TryParse(request.DestinationId, out var destinationId))
            {
                return new ResultDto<DestinationDto>
                {
                    Success = false,
                    Message = "Destination id is invalid. Updating destination failed.",
                };
            }

            var destination = await _dbContext.Destinations.FirstOrDefaultAsync(t => t.Id == destinationId);
           
            if (destination == null)
            {
                return new ResultDto<DestinationDto>
                {
                    Success = false,
                    Message = "Destination not found. Updating destination failed.",
                };
            }

            if (request.Title != null)
                destination.Title = request.Title;

            if (request.StartDate != null)
                destination.StartDate = request.StartDate.Value;

            if (request.EndDate != null)
                destination.EndDate = request.EndDate.Value;

            if (request.Location != null)
                destination.Location = request.Location;

            if (request.Notes != null)
                destination.Notes = request.Notes;

            await _dbContext.SaveChangesAsync();

            return new ResultDto<DestinationDto>
            {
                Success = true,
                Message = "Trip updated successfully.",
                Data = destination.ToDto()
            };
        }
    }
}
