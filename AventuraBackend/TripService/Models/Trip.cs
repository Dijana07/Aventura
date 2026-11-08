using System.ComponentModel.DataAnnotations;

namespace TripService.Models
{
    public class Trip
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public string PhotoUrl { get; set; } = "https://res.cloudinary.com/dskyn1svm/image/upload/v1779913423/Screenshot_685_-modified_zqn3j9.png";
        public ICollection<ChecklistItem> ChecklistItems { get; set; }
            = new List<ChecklistItem>();
        public ICollection<ShareToken> ShareTokens { get; set; }
            = new List<ShareToken>();
        public ICollection<Destination> Destinations { get; set; }
        = new List<Destination>();
        public ICollection<Activity> Activities { get; set; }
            = new List<Activity>();

        public Trip() { }
    }
}
