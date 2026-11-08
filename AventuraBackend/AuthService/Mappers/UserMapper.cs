using AuthService.Enums;
using AuthService.Models;
using Common.DTOs;
using Common.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthService.Mappers
{
    public static class UserMapper
    {
        public static UserDto ToDto(
            this User user)
        {
            return new UserDto
            {
                Id = user.Id.ToString(),
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                UserRole = user.UserRole.ToString(),
                PhotoUrl = user.PhotoUrl
            };
        }

        public static User ToEntity(
            this RegisterUserRequest request)
        {
            return new User
            {
                Id = Guid.NewGuid(),
                FirstName = request.FirstName.Trim(),
                LastName = request.LastName.Trim(),
                Email = request.Email.Trim(),
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                UserRole = UserRole.USER
            };
        }
    }
}
