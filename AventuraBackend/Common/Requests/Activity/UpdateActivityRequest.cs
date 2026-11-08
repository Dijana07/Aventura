using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Activity
{
    public class UpdateActivityRequest
    {
        public string ActivityId { get; set; } = string.Empty;
        public string TripId { get; set; } = string.Empty;
        public string? Title { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Location { get; set; }
        public string? Description { get; set; }
        public decimal? Budget { get; set; }
        public string? ActivityStatus { get; set; }
        public string? Notes { get; set; }

        public UpdateActivityRequest() { }
    }
}
