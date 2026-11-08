using Common.DTOs;
using Common.Requests.Activity;
using Common.Requests.Destination;

namespace BackendSF.Validators
{
    public static class ActivityValidator
    {
        public static ValidationResultDto ValidateCreateActivityRequest(CreateActivityRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Create activity request is null.");

            if (string.IsNullOrWhiteSpace(request.Title))
                return new ValidationResultDto(false, "Title is required.");

            if (request.StartDate.Date < DateTime.UtcNow.Date)
                return new ValidationResultDto(false, "Start date cannot be in the past.");

            if (request.EndDate.Date < DateTime.UtcNow.Date)
                return new ValidationResultDto(false, "End date cannot be in the past.");

            if (request.StartDate > request.EndDate)
                return new ValidationResultDto(false, "Start date cannot be after end date.");

            if (string.IsNullOrWhiteSpace(request.Location))
                return new ValidationResultDto(false, "Location is required.");

            if (string.IsNullOrWhiteSpace(request.Description))
                return new ValidationResultDto(false, "Description is required.");

            if (request.Budget < 0)
                return new ValidationResultDto(false, "Budget cannot be negative.");

            return new ValidationResultDto(true, "Create activity request is valid.");
        }

        public static ValidationResultDto ValidateUpdateActivityRequest(UpdateActivityRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Update activity request is null.");

            if (request.Title != null && request.Title == string.Empty)
                return new ValidationResultDto(false, "Title cannot be empty.");

            if (request.StartDate != null && request.StartDate < DateTime.UtcNow.Date)
                return new ValidationResultDto(false, "Start date cannot be in the past.");

            if (request.EndDate != null && request.EndDate < DateTime.UtcNow.Date)
                return new ValidationResultDto(false, "End date cannot be in the past.");

            if (request.StartDate != null && request.EndDate != null && request.StartDate > request.EndDate)
                return new ValidationResultDto(false, "Start date cannot be after end date.");

            if (request.Location != null && request.Location == string.Empty)
                return new ValidationResultDto(false, "Location cannot be empty.");

            if (request.Description != null && request.Description == string.Empty)
                return new ValidationResultDto(false, "Description cannot be empty.");

            if (request.Budget != null && request.Budget < 0)
                return new ValidationResultDto(false, "Budget cannot be negative.");

            if (request.ActivityStatus != null && request.ActivityStatus == string.Empty)
                return new ValidationResultDto(false, "Activity status cannot be empty.");

            return new ValidationResultDto(true, "Update activity request is valid.");
        }
    }
}
