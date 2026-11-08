using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Trip
{
    public class UpdateChecklistItemRequest
    {
        public string ChecklistItemId { get; set; } = string.Empty;
        public string TripId { get; set; } = string.Empty;
        public bool IsChecked { get; set; }

        public UpdateChecklistItemRequest() { }
    }
}
