using Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Responses
{
    public class TripResponse
    {
        public TripDto Trip { get; set; } = new TripDto();
        public bool CanEdit { get; set; }

        public TripResponse() { }
    }
}
