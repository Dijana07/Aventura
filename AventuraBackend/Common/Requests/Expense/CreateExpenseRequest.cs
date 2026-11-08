using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Expense
{
    public class CreateExpenseRequest
    {
        public string TripId { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public DateTime DateTime { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Category { get; set; } = string.Empty;

        public CreateExpenseRequest() { }
    }
}
