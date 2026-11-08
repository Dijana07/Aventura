using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Trip
{
    public class DeleteChecklistItemRequest
    {
        public string ChecklistItemId { get; set; } = string.Empty;
        public string TripId { get; set; } = string.Empty;
    }
}
