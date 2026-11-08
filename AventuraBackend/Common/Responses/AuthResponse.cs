using Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Responses
{
    public class AuthResponse
    {
        public UserDto? User { get; set; }
        public string Token { get; set; } = string.Empty;

        public AuthResponse() { }
    }
}
