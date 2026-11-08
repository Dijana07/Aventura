using System.ComponentModel.DataAnnotations;

namespace TripService.Models
{
    public class ChecklistItem
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public Guid TripPlanId { get; set; }
        public Trip Trip { get; set; }
        public bool IsChecked { get; set; } = false;

        public ChecklistItem() { }
    }
}
