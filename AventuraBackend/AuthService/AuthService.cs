using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Security.Principal;
using System.Threading;
using System.Threading.Tasks;
using AuthService.Helpers;
using Common.DTOs;
using Common.Interfaces;
using Common.Requests.Auth;
using Common.Requests;
using Common.Responses;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using Microsoft.ServiceFabric.Services.Runtime;
using TripService.Persistance;
using AuthService.Mappers;
using CloudinaryDotNet;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet.Actions;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;

namespace AuthService
{
    /// <summary>
    /// An instance of this class is created for each service instance by the Service Fabric runtime.
    /// </summary>
    internal sealed class AuthService : StatelessService, IAuthService
    {
        private readonly AuthDbContext _dbContext;
        private JwtHandler _jwtHandler;
        private readonly Cloudinary _cloudinary;
        private readonly ITripPlanService _tripService;

        public AuthService(StatelessServiceContext context)
            : base(context)
        {
            var configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString =
                configuration.GetConnectionString("AuthDatabase");

            var options = new DbContextOptionsBuilder<AuthDbContext>()
                .UseSqlServer(connectionString)
                .Options;

            _dbContext = new AuthDbContext(options);
            _jwtHandler = new JwtHandler(configuration);

            var account = new Account(
               configuration["Cloudinary:CloudName"],
               configuration["Cloudinary:ApiKey"],
               configuration["Cloudinary:ApiSecret"]);

            _cloudinary = new Cloudinary(account);

            _tripService = ServiceProxy.Create<ITripPlanService>(
                new Uri("fabric:/Aventura/TripService"),
                new ServicePartitionKey(0));
        }

        public async Task<ResultDto<bool>> DeleteUserAsync(Guid userId)
        {
            var res = await _tripService.DeleteAllTripsForUserAsync(userId);
            if (!res.Success)
            {
                return new ResultDto<bool>
                {
                    Success = res.Success,
                    Message = "Failed to delete trips for user. User delete failed.",
                };
            }

            int result = await _dbContext.Users.Where(u => u.Id == userId).ExecuteDeleteAsync();
            return new ResultDto<bool>
            {
                Success = result > 0,
                Message = result > 0 ? "User deleted successfully." : "User delete failed.",
            };
        }

        public async Task<ResultDto<UserDto>> GetUserByIdAsync(Guid userId)
        {
            var user = await _dbContext.Users
                .Where(u => u.Id == userId)
                .Select(u => u.ToDto())
                .FirstOrDefaultAsync();

            return new ResultDto<UserDto>
            {
                Success = true,
                Message = "Fetched user successfully.",
                Data = user
            };
        }

        public async Task<ResultDto<List<UserDto>>> GetUsersAsync()
        {
            var users = await _dbContext.Users
                .Select(u => u.ToDto())
                .ToListAsync();

            return new ResultDto<List<UserDto>>
            {
                Success = true,
                Message = "Fetched users successfully.",
                Data = users
            };
        }

        public async Task<ResultDto<AuthResponse>> LoginAsync(LoginRequest request)
        {
            var user = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == request.Email);

            if (user == null)
            {
                return new ResultDto<AuthResponse>
                {
                    Success = false,
                    Message = "User does not exist."
                };
            }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
            {
                return new ResultDto<AuthResponse>
                {
                    Success = false,
                    Message = "Invalid password."
                };
            }

            var token = _jwtHandler.GenerateJwtToken(user);
            var response = new AuthResponse
            {
                User = user.ToDto(),
                Token = token
            };

            return new ResultDto<AuthResponse>
            {
                Success = true,
                Message = "Login successful.",
                Data = response
            };
        }

        public async Task<ResultDto<AuthResponse>> RegisterUserAsync(RegisterUserRequest request)
        {
            var existingUser = await _dbContext.Users.FirstOrDefaultAsync(x => x.Email == request.Email);

            if (existingUser != null)
            {
                return new ResultDto<AuthResponse>
                {
                    Success = false,
                    Message = "User with this email already exists."
                };
            }

            var user = request.ToEntity();

            _dbContext.Users.Add(user);

            await _dbContext.SaveChangesAsync();

            var token = _jwtHandler.GenerateJwtToken(user);
            var response = new AuthResponse
            {
                User = user.ToDto(),
                Token = token
            };

            return new ResultDto<AuthResponse>
            {
                Success = true,
                Message = "User successfully registered.",
                Data = response
            };
        }

        public async Task<ResultDto<UserDto>> UpdateUserAsync(UpdateUserRequest request)
        {
            if (!Guid.TryParse(request.UserId, out var userId))
            {
                return new ResultDto<UserDto>
                {
                    Success = false,
                    Message = "User id is invalid. Updating user failed.",
                };
            }

            var user = await _dbContext.Users.FirstOrDefaultAsync(t => t.Id == userId);


            if (user == null)
            {
                return new ResultDto<UserDto>
                {
                    Success = false,
                    Message = "User not found. Updating user failed.",
                };
            }

            if (request.FirstName != null)
                user.FirstName = request.FirstName;

            if (request.LastName != null)
                user.LastName = request.LastName;

            if (request.Password != null)
                user.Password = BCrypt.Net.BCrypt.HashPassword(request.Password);

            if (request.FileDto != null)
            {
                using var stream = new MemoryStream(request.FileDto.Data);

                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(request.FileDto.FileName, stream),
                    Folder = "aventura_photos",
                    PublicId = $"photo_{userId}",
                    Overwrite = true,
                    Invalidate = true
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                user.PhotoUrl = uploadResult.SecureUrl.ToString();
            }

            await _dbContext.SaveChangesAsync();

            return new ResultDto<UserDto>
            {
                Success = true,
                Message = "User updated successfully.",
                Data = user.ToDto()
            };
        }

        /// <summary>
        /// Optional override to create listeners (e.g., TCP, HTTP) for this service replica to handle client or user requests.
        /// </summary>
        /// <returns>A collection of listeners.</returns>
        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }
    }
}
