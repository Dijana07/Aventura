using Common.DTOs;
using Common.Requests;
using Common.Requests.Auth;
using Common.Responses;
using Microsoft.ServiceFabric.Services.Remoting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Interfaces
{
    public interface IAuthService : IService
    {
        Task<ResultDto<AuthResponse>> RegisterUserAsync(RegisterUserRequest request);
        Task<ResultDto<AuthResponse>> LoginAsync(LoginRequest request);

        Task<ResultDto<UserDto>> GetUserByIdAsync(Guid userId);
        Task<ResultDto<UserDto>> UpdateUserAsync(UpdateUserRequest request);
        // dostupno samo adminu 
        Task<ResultDto<bool>> DeleteUserAsync(Guid userId);
        Task<ResultDto<List<UserDto>>> GetUsersAsync();
    }
}
