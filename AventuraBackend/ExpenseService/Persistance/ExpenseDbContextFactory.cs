using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TripService.Persistance
{
    public class ExpenseDbContextFactory
        : IDesignTimeDbContextFactory<ExpenseDbContext>
    {
        public ExpenseDbContext CreateDbContext(string[] args)
        {
            IConfiguration config = new ConfigurationBuilder()
                 .AddJsonFile("appsettings.json")
                 .Build();

            var connectionString = config.GetConnectionString("ExpenseDatabase");

            var optionsBuilder =
                new DbContextOptionsBuilder<ExpenseDbContext>();

            optionsBuilder.UseSqlServer(connectionString);

            return new ExpenseDbContext(optionsBuilder.Options);
        }
    }
}
