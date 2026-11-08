using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs
{
    public class TripDto
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public decimal Budget { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public string PhotoUrl { get; set; } = string.Empty;
        public decimal TotalExpenses { get; set; }

        public List<DestinationDto> Destinations { get; set; } = [];
        public List<ActivityDto> Activities { get; set; } = [];
        public List<ChecklistItemDto> ChecklistItems { get; set; } = [];
        public bool CanEdit { get; set; } = true;

        public TripDto() { }
    }
}
