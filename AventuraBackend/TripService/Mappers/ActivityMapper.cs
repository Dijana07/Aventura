using Common.DTOs;
using Common.Requests.Activity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TripService.Enums;
using TripService.Models;

namespace TripService.Mappers
{
    public static class ActivityMapper
    {
        public static ActivityDto ToDto(
            this Activity activity)
        {
            return new ActivityDto
            {
                Id = activity.Id.ToString(),
                Title = activity.Title,
                StartDateTime = activity.StartDateTime,
                EndDateTime = activity.EndDateTime,
                Location = activity.Location,
                Description = activity.Description,
                Budget = activity.Budget,
                ActivityStatus = activity.ActivityStatus.ToString(),
                Notes = activity.Notes
            };
        }

        public static Activity ToEntity(
            this CreateActivityRequest request,
            Guid userId)
        {
            return new Activity
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                TripId = Guid.Parse(request.TripId),
                Title = request.Title,
                StartDateTime = request.StartDate,
                EndDateTime = request.EndDate,
                Location = request.Location,
                Description = request.Description,
                Budget = request.Budget,
                ActivityStatus = ActivityStatus.PLANNED,
                Notes = request.Notes
            };
        }
    }
}
