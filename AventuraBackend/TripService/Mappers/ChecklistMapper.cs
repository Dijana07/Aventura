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
    public static class ChecklistItemMapper
    {
        public static ChecklistItemDto ToDto(
            this ChecklistItem item)
        {
            return new ChecklistItemDto
            {
                Id = item.Id.ToString(),
                Title = item.Title,
                IsChecked = item.IsChecked
            };
        }

        public static ChecklistItem ToEntity(
            this CreateChecklistItemRequest request,
            Guid userId)
        {
            return new ChecklistItem
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TripPlanId = Guid.Parse(request.TripId),
                Title = request.Title,
                IsChecked = false
            };
        }
    }
}
