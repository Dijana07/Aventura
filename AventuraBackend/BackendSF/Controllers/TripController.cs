using AuthService.Enums;
using BackendSF.Validators;
using Common.DTOs;
using Common.Interfaces;
using Common.Requests;
using Common.Requests.Trip;
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
    public class TripController : ControllerBase
    {
        private readonly ITripPlanService _tripService;

        public TripController()
        {
            _tripService = ServiceProxy.Create<ITripPlanService>(
                new Uri("fabric:/Aventura/TripService"),
                new ServicePartitionKey(0));
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<ResultDto<TripDto>>> CreateTrip([FromBody] CreateTripRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var validationResult = TripValidator.ValidateCreateTripRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<TripDto>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }

            var createResult = await _tripService.CreateTripAsync(userId, request);

            if (!createResult.Success)
            {
                return BadRequest(createResult);
            }

            return Ok(createResult);
        }

        [Authorize]
        [HttpGet("all")]
        public async Task<IActionResult> GetAllTrips()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var result = await _tripService.GetAllTripsForUserAsync(userId);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("lastThree")]
        public async Task<IActionResult> GetLastThreeTrips()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var result = await _tripService.GetLastThreeTripsForUserAsync(userId);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("admin/all")]
        public async Task<IActionResult> GetAllTripsForAdmin()
        {
            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();

            if (!isAdmin)
            {
                return Unauthorized();
            }

            var result = await _tripService.GetAllTripsAsync();

            return Ok(result);
        }

        [Authorize]
        [HttpGet("{tripId}")]
        public async Task<IActionResult> GetTripById(string tripId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            if (!Guid.TryParse(tripId, out var tripGuid))
            {
                return Conflict("Invalid trip id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.GetTripByIdAsync(userId, userEmail, isAdmin, tripGuid);

            return Ok(result);
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateTrip([FromForm] UpdateTripRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var validationResult = TripValidator.ValidateUpdateTripRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<TripDto>
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

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.UpdateTripAsync(userId, userEmail, isAdmin, request);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete("{tripId}")]
        public async Task<IActionResult> DeleteTrip(string tripId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            if (!Guid.TryParse(tripId, out var tripGuid))
            {
                return Conflict("Invalid trip id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.DeleteTripAsync(userId, userEmail, isAdmin, tripGuid);

            return Ok(result);
        }

        [Authorize]
        [HttpPost("checklist/create")]
        public async Task<ActionResult<ResultDto<ChecklistItemDto>>> CreateChecklistItem([FromBody] CreateChecklistItemRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();

            var validationResult = TripValidator.ValidateCreateChecklistItemRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<ChecklistItemDto>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var createResult = await _tripService.CreateChecklistItemAsync(userId, userEmail, isAdmin, request);

            if (!createResult.Success)
            {
                return BadRequest(createResult);
            }

            return Ok(createResult);
        }

        [Authorize]
        [HttpPut("checklist/update")]
        public async Task<IActionResult> UpdateChecklistItem([FromBody] UpdateChecklistItemRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var validationResult = TripValidator.ValidateUpdateChecklistItemRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<ChecklistItemDto>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.UpdateChecklistItemAsync(userId, userEmail, isAdmin, request);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete("checklist")]
        public async Task<IActionResult> DeleteChecklistItem([FromBody] DeleteChecklistItemRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.DeleteChecklistItemAsync(userId, userEmail, isAdmin, request);

            return Ok(result);
        }

        [Authorize]
        [HttpPost("token/create")]
        public async Task<ActionResult<ResultDto<ChecklistItemDto>>> CreateShareToken([FromBody] CreateShareTokenRequest request)
        {
            var validationResult = TripValidator.ValidateCreateShareTokenRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<ChecklistItemDto>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }
            var createResult = await _tripService.GetOrCreateShareTokenAsync(request);

            if (!createResult.Success)
            {
                return BadRequest(createResult);
            }

            return Ok(createResult);
        }

        [HttpGet("share/{token}")]
        public async Task<IActionResult> GetTripByToken(string token)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim == null)
                return Ok(await _tripService.GetTripByTokenAsync(Guid.Empty, "canView", false, token));

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.GetTripByTokenAsync(userId, userEmail, isAdmin, token);

            return Ok(result);
        }
    }
}
