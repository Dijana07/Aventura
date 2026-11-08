using System.ComponentModel.DataAnnotations;
using TripService.Enums;

namespace TripService.Models
{
    public class ShareToken
    {
        [Key]
        public Guid Id { get; set; }
        public string Token { get; set; } = string.Empty;
        public Guid TripPlanId { get; set; }
        public Trip Trip { get; set; }
        public string? AllowedUserEmail { get; set; }
        public TokenAccessType AccessType { get; set; }

        public ShareToken() { }

    }
}
