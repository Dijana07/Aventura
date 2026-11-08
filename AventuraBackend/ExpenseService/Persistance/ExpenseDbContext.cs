using ExpenseService.Models;
using Microsoft.EntityFrameworkCore;

namespace TripService.Persistance
{
    public class ExpenseDbContext : DbContext
    {
        public ExpenseDbContext(DbContextOptions<ExpenseDbContext> options)
            : base(options)
        {
        }

        public DbSet<Expense> Expenses => Set<Expense>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Expense>()
                .Property(x => x.Amount)
                .HasPrecision(18, 2);
        }
    }
}
