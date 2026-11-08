using Common.DTOs;
using Common.Requests.Trip;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripService.Models;

namespace TripService.Mappers
{
    public static class TripMapper
    {
        public static TripDto ToDto(
            this Trip trip,
            decimal totalExpenses = 0,
            bool canEdit = true)
        {
            return new TripDto
            {
                Id = trip.Id.ToString(),
                Title = trip.Title,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate,
                Budget = trip.Budget,
                Notes = trip.Notes,
                CreatedAt = trip.CreatedAt,
                PhotoUrl = trip.PhotoUrl,
                TotalExpenses = totalExpenses,
                CanEdit = canEdit,

                Destinations = trip.Destinations
                    .Select(x => x.ToDto())
                    .ToList(),

                Activities = trip.Activities
                    .Select(x => x.ToDto())
                    .ToList(),

                ChecklistItems = trip.ChecklistItems
                    .Select(x => x.ToDto())
                    .ToList()
            };
        }

        public static TripPreviewDto ToPreviewDto(
        this Trip trip)
        {
            return new TripPreviewDto
            {
                Id = trip.Id.ToString(),
                Title = trip.Title,
                PhotoUrl = trip.PhotoUrl,
                StartDate = trip.StartDate,
                EndDate = trip.EndDate
            };
        }

        public static Trip ToEntity(
            this CreateTripRequest request,
            Guid userId)
        {
            return new Trip
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Title = request.Title,
                StartDate = request.StartDate,
                EndDate = request.EndDate,
                Budget = request.Budget,
                Notes = request.Notes,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}
