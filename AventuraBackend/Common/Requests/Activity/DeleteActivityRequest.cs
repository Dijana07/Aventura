using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Activity
{
    public class DeleteActivityRequest
    {
        public string ActivityId { get; set; } = string.Empty;
        public string TripId { get; set; } = string.Empty;
    }
}
