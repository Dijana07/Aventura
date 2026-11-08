using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Destination
{
    public class UpdateDestinationRequest
    {
        public string DestinationId { get; set; } = string.Empty;
        public string TripId { get; set; } = string.Empty;
        public string? Title { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Location { get; set; }
        public string? Notes { get; set; }

        public UpdateDestinationRequest() { }
    }
}
