using Common.DTOs;
using Common.Requests;
using Common.Requests.Auth;
using System.Fabric;
using System.Text.RegularExpressions;

namespace BackendSF.Validators
{
    public static class AuthValidator
    {
        private const string EmailPattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
        private const string PasswordPattern = @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"; // min 8, jedno veliko, jedno malo, jedan broj

        public static ValidationResultDto ValidateLoginRequest(LoginRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Login request is null.");

            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                return new ValidationResultDto(false, "Fields are missing in login request.");

            if (!Regex.IsMatch(request.Email, EmailPattern))
            {
                return new ValidationResultDto(false, "Invalid email format.");
            }

            return new ValidationResultDto(true, "Login request is valid.");
        }

        public static ValidationResultDto ValidateRegisterRequest(RegisterUserRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Register request is null.");

            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.FirstName) || string.IsNullOrWhiteSpace(request.LastName))
                return new ValidationResultDto(false, "Fields are missing in register request.");

            if (!Regex.IsMatch(request.Email, EmailPattern))
            {
                return new ValidationResultDto(false, "Invalid email format.");
            }

            if (!Regex.IsMatch(request.Password, PasswordPattern))
            {
                return new ValidationResultDto(false,
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.");
            }

            return new ValidationResultDto(true, "Register request is valid.");
        }

        public static ValidationResultDto ValidateUpdateRequest(UpdateUserRequest request)
        {
            if (request == null)
                return new ValidationResultDto(false, "Update request is null.");

            if (request.FirstName != null && request.FirstName == string.Empty)
                return new ValidationResultDto(false, "New first name cannot be empty.");

            if (request.LastName != null && request.LastName == string.Empty)
                return new ValidationResultDto(false, "New last name cannot be empty.");

            if (request.Password != null && request.Password == string.Empty)
                return new ValidationResultDto(false, "New password cannot be empty.");

            if (request.Password != null && !Regex.IsMatch(request.Password, PasswordPattern))
            {
                return new ValidationResultDto(false,
                    "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number.");
            }

            return new ValidationResultDto(true, "Update request is valid.");
        }
    }
}
