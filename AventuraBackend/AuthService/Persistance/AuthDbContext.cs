using AuthService.Models;
using Microsoft.EntityFrameworkCore;

namespace TripService.Persistance
{
    public class AuthDbContext : DbContext
    {
        public AuthDbContext(
            DbContextOptions<AuthDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
                .HasIndex(x => x.Email)
                .IsUnique();

            builder.Entity<User>()
                .Property(x => x.FirstName)
                .HasMaxLength(100);

            builder.Entity<User>()
                .Property(x => x.LastName)
                .HasMaxLength(100);

            builder.Entity<User>()
                .Property(x => x.Email)
                .HasMaxLength(200);

            builder.Entity<User>()
                .Property(x => x.Password)
                .HasMaxLength(500);

            builder.Entity<User>()
                .Property(x => x.PhotoUrl)
                .HasMaxLength(500)
                .HasDefaultValue("https://res.cloudinary.com/dskyn1svm/image/upload/v1779900412/Screenshot_663_-modified_zxou8a.png");
        }
    }
}
