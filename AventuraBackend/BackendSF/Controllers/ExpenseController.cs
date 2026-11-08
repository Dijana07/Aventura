using AuthService.Enums;
using BackendSF.Validators;
using Common.DTOs;
using Common.Interfaces;
using Common.Requests.Expense;
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
    public class ExpenseController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpenseController()
        {
            _expenseService = ServiceProxy.Create<IExpenseService>(
                new Uri("fabric:/Aventura/ExpenseService"));
        }

        [Authorize]
        [HttpPost("create")]
        public async Task<ActionResult<ResultDto<ExpenseDto>>> CreateExpense([FromBody] CreateExpenseRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();

            var validationResult = ExpenseValidator.ValidateCreateExpenseRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<ExpenseDto>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var createResult = await _expenseService.CreateExpenseAsync(userId, userEmail, isAdmin, request);

            if (!createResult.Success)
            {
                return BadRequest(createResult);
            }

            return Ok(createResult);
        }

        [HttpGet("all/{tripId}")]
        public async Task<IActionResult> GetAllExpensesByTripId(string tripId)
        {
            if (!Guid.TryParse(tripId, out var tripGuid))
            {
                return Unauthorized("Invalid trip id.");
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
                return Ok(await _expenseService.GetAllByTripByIdAsync(Guid.Empty, "canView", false, tripGuid));

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _expenseService.GetAllByTripByIdAsync(userId, userEmail, isAdmin, tripGuid);

            return Ok(result);
        }

        [Authorize]
        [HttpPut("update")]
        public async Task<IActionResult> UpdateExpense([FromBody] UpdateExpenseRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var validationResult = ExpenseValidator.ValidateUpdateExpenseRequest(request);

            if (!validationResult.IsValid)
            {
                return BadRequest(new ResultDto<ExpenseDto>
                {
                    Success = false,
                    Message = validationResult.Message,
                    Data = null
                });
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _expenseService.UpdateExpenseAsync(userId, userEmail, isAdmin, request);

            return Ok(result);
        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> DeleteExpense([FromBody] DeleteExpenseRequest request)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user id.");
            }

            var userRoleClaim = User.FindFirst(ClaimTypes.Role)?.Value;
            bool isAdmin = userRoleClaim == UserRole.ADMIN.ToString();
            var userEmail = User.FindFirst(ClaimTypes.Email)?.Value ?? "";
            var result = await _expenseService.DeleteExpenseAsync(userId, userEmail, isAdmin, request);

            return Ok(result);
        }
    }
}
