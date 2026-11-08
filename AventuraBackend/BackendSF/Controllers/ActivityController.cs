using AuthService.Enums;
using BackendSF.Validators;
using Common.DTOs;
using Common.Interfaces;
using Common.Requests.Activity;
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
    public class ActivityController : ControllerBase
    {
        private readonly ITripPlanService _tripService;

        public ActivityController()
        {
            _tripService = ServiceProxy.Create<ITripPlanService>(
                new Uri("fabric:/Aventura/TripService"),
                new ServicePartitionKey(0));
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<ResultDto<ActivityDto>>> CreateActivity([FromBody] CreateActivityRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();

            var validationResult = ActivityValidator.ValidateCreateActivityRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<ActivityDto>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }

            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var createResult = await _tripService.CreateActivityAsync(userId, userEmail, isAdmin, request);

            if (!createResult.Success)
            {
                return BadRequest(createResult);
            }

            return Ok(createResult);
        }        

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateActivity([FromBody] UpdateActivityRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var validationResult = ActivityValidator.ValidateUpdateActivityRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<ActivityDto>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.UpdateActivityAsync(userId, userEmail, isAdmin, request);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteActivity([FromBody] DeleteActivityRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.DeleteActivityAsync(userId, userEmail, isAdmin, request);

            return Ok(result);
        }

        [Authorize]
        [HttpGet("totalExpenses/{tripId}")]
        public async Task<IActionResult> GetTotalExpensesByTripId(string tripId)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            if (!Guid.TryParse(tripId, out var tripGuid))
            {
                return Unauthorized("Invalid trip id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.GetTotalExpensesByTripIdAsync(userId, userEmail, isAdmin, tripGuid);

            return Ok(result);
        }
    }
}
