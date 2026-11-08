using ExpenseService.Enums;
using System.ComponentModel.DataAnnotations;

namespace ExpenseService.Models
{
    public class Expense
    {
        [Key]
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public Guid TripId { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; }
        public ExpenseCategory Category { get; set; }

        public Expense() { }
    }
}
