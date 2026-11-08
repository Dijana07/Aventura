
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Expense
{
    public class UpdateExpenseRequest
    {
        public string ExpenseId { get; set; } = string.Empty;
        public string TripId { get; set; } = string.Empty;
        public string? Title { get; set; }
        public DateTime? Date { get; set; }
        public string? Description { get; set; }
        public decimal? Amount { get; set; }
        public string? Category { get; set; }

        public UpdateExpenseRequest() { }
    }
}
