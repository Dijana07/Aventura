using Common.DTOs;
using Common.Requests.Destination;
using Common.Requests.Trip;

namespace BackendSF.Validators
{
    public static class DestinationValidator
    {
        public static ValidationResultDto ValidateCreateDestinationRequest(CreateDestinationRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Create destination request is null.");

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

            return new ValidationResultDto(true, "Create destination request is valid.");
        }

        public static ValidationResultDto ValidateUpdateDestinationRequest(UpdateDestinationRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Update destination request is null.");

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

            return new ValidationResultDto(true, "Update destination request is valid.");
        }
    }
}
