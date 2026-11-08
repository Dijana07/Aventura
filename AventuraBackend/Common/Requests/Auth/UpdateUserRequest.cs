using Common.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Auth
{
    public class UpdateUserRequest
    {
        public string UserId { get; set; } = string.Empty;
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Password { get; set; }
        public IFormFile? Image { get; set; }
        public UploadedFileDto? FileDto { get; set; }
        public UpdateUserRequest() { }
    }
}
