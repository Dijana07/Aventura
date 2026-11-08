using System.ComponentModel.DataAnnotations;

namespace TripService.Models
{
    public class Destination
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid TripId { get; set; }
        public Trip Trip { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Location { get; set; } = string.Empty;
        public string? Notes { get; set; }

        public Destination() { }
    }
}
