using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Destination
{
    public class DeleteDestinationRequest
    {
        public string DestinationId { get; set; } = string.Empty;
        public string TripId { get; set; } = string.Empty;
    }
}
