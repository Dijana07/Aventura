using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Trip
{
    public class CreateChecklistItemRequest
    {
        public string TripId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;

        public CreateChecklistItemRequest() { }
    }
}
