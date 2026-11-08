using AuthService.Enums;
using BackendSF.Validators;
using Common.DTOs;
using Common.Interfaces;
using Common.Requests;
using Common.Requests.Auth;
using Common.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.Security.Claims;

namespace BackendSF.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController()
        {
            _authService = ServiceProxy.Create<IAuthService>(
                new Uri("fabric:/Aventura/AuthService"));
        }

        [HttpPost("register")]
        public async Task<ActionResult<ResultDto<AuthResponse>>> Register([FromBody] RegisterUserRequest request)
        {
            var validationResult = AuthValidator.ValidateRegisterRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<AuthResponse>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }

            var registerResult = await _authService.RegisterUserAsync(request);

            if (!registerResult.Success)
            {
                return BadRequest(registerResult);
            }

            return Ok(registerResult);
        }

        [HttpPost("login")]
        public async Task<ActionResult<ResultDto<AuthResponse>>> Login([FromBody] LoginRequest request)
        {
            var validationResult = AuthValidator.ValidateLoginRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<AuthResponse>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }

            var loginResult = await _authService.LoginAsync(request);

            if (!loginResult.Success)
            {
                return BadRequest(loginResult);
            }

            return Ok(loginResult);
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<ActionResult<ResultDto<UserDto>>> UpdateUser([FromForm] UpdateUserRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();

            if (request.UserId == userIdClaim || isAdmin)
            {
                var validationResult = AuthValidator.ValidateUpdateRequest(request);

                if (!validationResult.IsValid)
                {
                    return BadRequest(new ResultDto<UserDto>
                    {
                        Success = false,
                        Message = validationResult.Message,
                        Data = null
                    });
                }

                if (request.Image != null)
                {
                    using var ms = new MemoryStream();
                    await request.Image.CopyToAsync(ms);

                    request.FileDto = new UploadedFileDto
                    {
                        Data = ms.ToArray(),
                        FileName = request.Image.FileName,
                        ContentType = request.Image.ContentType
                    };

                    request.Image = null;
                }

                var updateResult = await _authService.UpdateUserAsync(request);

                if (!updateResult.Success)
                {
                    return BadRequest(updateResult);
                }

                return Ok(updateResult);
            }

            return Unauthorized("You cannot update others profile if you're not admin.");
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers()
        {
            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();

            if (!isAdmin)
            {
                return Unauthorized();
            }

            var result = await _authService.GetUsersAsync();

            return Ok(result);
        }

        [Authorize]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById(string userId)
        {
            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();

            if (!isAdmin)
            {
                return Unauthorized();
            }

            if (!Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("Invalid user id.");
            }

            var result = await _authService.GetUserByIdAsync(userGuid);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("myProfile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var result = await _authService.GetUserByIdAsync(userId);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            if (!Guid.TryParse(userId, out var userGuid))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();

            if (!isAdmin)
            {
                return Unauthorized();
            }

            var result = await _authService.DeleteUserAsync(userGuid);

            return Ok(result);
        }
    }
}
