using Common.DTOs;
using Common.Requests.Trip;
using System.Text.RegularExpressions;

namespace BackendSF.Validators
{
    public static class TripValidator
    {
        private const string EmailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";

        public static ValidationResultDto ValidateCreateTripRequest(CreateTripRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Create trip request is null.");

            if (string.IsNullOrWhiteSpace(request.Title))
                return new ValidationResultDto(false, "Title is required.");

            if (request.StartDate.Date < DateTime.UtcNow.Date)
                return new ValidationResultDto(false, "Start date cannot be in the past.");

            if (request.EndDate.Date < DateTime.UtcNow.Date)
                return new ValidationResultDto(false, "End date cannot be in the past.");

            if (request.StartDate > request.EndDate)
                return new ValidationResultDto(false, "Start date cannot be after end date.");

            if (request.Budget < 0)
                return new ValidationResultDto(false, "Budget cannot be negative.");

            return new ValidationResultDto(true, "Create trip request is valid.");
        }

        public static ValidationResultDto ValidateUpdateTripRequest(UpdateTripRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Update trip request is null.");

            if (request.Title != null && request.Title == string.Empty)
                return new ValidationResultDto(false, "Title cannot be empty.");

            if (request.StartDate != null && request.StartDate < DateTime.UtcNow.Date)
                return new ValidationResultDto(false, "Start date cannot be in the past.");

            if (request.EndDate != null && request.EndDate < DateTime.UtcNow.Date)
                return new ValidationResultDto(false, "End date cannot be in the past.");

            if (request.StartDate != null && request.EndDate != null && request.StartDate > request.EndDate)
                return new ValidationResultDto(false, "Start date cannot be after end date.");

            if (request.Budget != null && request.Budget < 0)
                return new ValidationResultDto(false, "Budget cannot be negative.");

            return new ValidationResultDto(true, "Update trip request is valid.");
        }

        public static ValidationResultDto ValidateCreateChecklistItemRequest(CreateChecklistItemRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Create checklist item request is null.");

            if (string.IsNullOrWhiteSpace(request.Title))
                return new ValidationResultDto(false, "Title is required.");           

            return new ValidationResultDto(true, "Create checklist item request is valid.");
        }

        public static ValidationResultDto ValidateUpdateChecklistItemRequest(UpdateChecklistItemRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Update checklist item request is null.");

            return new ValidationResultDto(true, "Update checklist item request is valid.");
        }

        public static ValidationResultDto ValidateCreateShareTokenRequest(CreateShareTokenRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Create share token request is null.");

            if (string.IsNullOrEmpty(request.AccessType))
                return new ValidationResultDto(false, "Access type is required.");

            if (request.AllowedUserEmail != null && request.AllowedUserEmail == string.Empty)
                return new ValidationResultDto(false, "Allowed user email is required.");

            if (request.AllowedUserEmail != null && !Regex.IsMatch(request.AllowedUserEmail, EmailPattern))
            {
                return new ValidationResultDto(false, "Invalid email format.");
            }

            return new ValidationResultDto(true, "Create share token request is valid.");
        }
    }
}
