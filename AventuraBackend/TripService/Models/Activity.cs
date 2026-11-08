using System.ComponentModel.DataAnnotations;
using TripService.Enums;

namespace TripService.Models
{
    public class Activity
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid TripId { get; set; }
        public Trip Trip { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Budget { get; set; }
        public ActivityStatus ActivityStatus { get; set; }
        public string? Notes { get; set; }

        public Activity() { }
    }
}
