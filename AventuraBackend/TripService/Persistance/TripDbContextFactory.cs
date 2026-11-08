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
    public class TripDbContextFactory
        : IDesignTimeDbContextFactory<TripDbContext>
    {
        public TripDbContext CreateDbContext(string[] args)
        {
            IConfiguration config = new ConfigurationBuilder()
                 .AddJsonFile("appsettings.json")
                 .Build();

            var connectionString = config.GetConnectionString("TripDatabase");

            var optionsBuilder =
                new DbContextOptionsBuilder<TripDbContext>();

            optionsBuilder.UseSqlServer(connectionString);

            return new TripDbContext(optionsBuilder.Options);
        }
    }
}
