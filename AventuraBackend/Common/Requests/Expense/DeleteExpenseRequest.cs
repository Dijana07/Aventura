using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Requests.Expense
{
    public class DeleteExpenseRequest
    {
        public string ExpenseId { get; set; } = string.Empty;
        public string TripId { get; set; } = string.Empty;
    }
}
