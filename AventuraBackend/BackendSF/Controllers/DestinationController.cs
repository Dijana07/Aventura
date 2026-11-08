using AuthService.Enums;
using BackendSF.Validators;
using Common.DTOs;
using Common.Interfaces;
using Common.Requests.Destination;
using Common.Requests.Trip;
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
    public class DestinationController : ControllerBase
    {
        private readonly ITripPlanService _tripService;

        public DestinationController()
        {
            _tripService = ServiceProxy.Create<ITripPlanService>(
                new Uri("fabric:/Aventura/TripService"),
                new ServicePartitionKey(0));
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<ResultDto<DestinationDto>>> CreateDestination([FromBody] CreateDestinationRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();

            var validationResult = DestinationValidator.ValidateCreateDestinationRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<DestinationDto>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var createResult = await _tripService.CreateDestinationAsync(userId, userEmail, isAdmin, request);

            if (!createResult.Success)
            {
                return BadRequest(createResult);
            }

            return Ok(createResult);
        }       

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateDestination([FromBody] UpdateDestinationRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var validationResult = DestinationValidator.ValidateUpdateDestinationRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<DestinationDto>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.UpdateDestinationAsync(userId, userEmail, isAdmin, request);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteDestination([FromBody] DeleteDestinationRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _tripService.DeleteDestinationAsync(userId, userEmail, isAdmin, request);

            return Ok(result);
        }
    }
}
