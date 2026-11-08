using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Trip
{
    public class CreateShareTokenRequest
    {
        public string TripId { get; set; } = string.Empty;
        public string? AllowedUserEmail { get; set; }
        public string AccessType { get; set; } = string.Empty;

        public CreateShareTokenRequest() { }
    }
}
