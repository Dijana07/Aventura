using Common.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Trip
{
    public class UpdateTripRequest
    {
        public string TripId { get; set; } = string.Empty;
        public string? Title { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public decimal? Budget { get; set; }
        public string? Notes { get; set; }
        public IFormFile? Image { get; set; }
        public UploadedFileDto? FileDto { get; set; }
        public UpdateTripRequest() { }
    }
}
