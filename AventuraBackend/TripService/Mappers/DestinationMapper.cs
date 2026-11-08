using Common.DTOs;
using Common.Requests.Destination;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripService.Models;

namespace TripService.Mappers
{
    public static class DestinationMapper
    {
        public static DestinationDto ToDto(
            this Destination destination)
        {
            return new DestinationDto
            {
                Id = destination.Id.ToString(),
                Title = destination.Title,
                StartDate = destination.StartDate,
                EndDate = destination.EndDate,
                Location = destination.Location,
                Notes = destination.Notes
            };
        }

        public static Destination ToEntity(
            this CreateDestinationRequest request,
            Guid userId)
        {
            return new Destination
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TripId = Guid.Parse(request.TripId),
                Title = request.Title,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Location = request.Location,
                Notes = request.Notes
            };
        }
    }
}
