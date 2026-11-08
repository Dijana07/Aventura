using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;
using TripService.Models;

namespace TripService.Persistance
{
    public class TripDbContext : DbContext
    {
        public TripDbContext(DbContextOptions<TripDbContext> options)
            : base(options)
        {
        }

        public DbSet<Trip> TripPlans => Set<Trip>();
        public DbSet<ChecklistItem> ChecklistItems => Set<ChecklistItem>();
        public DbSet<ShareToken> ShareTokens => Set<ShareToken>();
        public DbSet<Destination> Destinations => Set<Destination>();
        public DbSet<Activity> Activities => Set<Activity>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<ShareToken>()
                .HasIndex(x => x.Token)
                .IsUnique();

            builder.Entity<Trip>()
                .HasMany(x => x.ChecklistItems);

            builder.Entity<ChecklistItem>()
                .HasOne(c => c.Trip)
                .WithMany(t => t.ChecklistItems)
                .HasForeignKey(c => c.TripPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Trip>()
                .HasMany(x => x.ShareTokens);

            builder.Entity<ShareToken>()
                .HasOne(s => s.Trip)
                .WithMany(t => t.ShareTokens)
                .HasForeignKey(s => s.TripPlanId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Trip>()
                .Property(x => x.Budget)
                .HasPrecision(18, 2);

            builder.Entity<Trip>()
                .Property(x => x.PhotoUrl)
                .HasMaxLength(500)
                .HasDefaultValue("https://res.cloudinary.com/dskyn1svm/image/upload/v1779900412/Screenshot_663_-modified_zxou8a.png"); ;

            builder.Entity<Destination>()
                .Property(x => x.Title)
                .HasMaxLength(200);

            builder.Entity<Destination>()
                .Property(x => x.Location)
                .HasMaxLength(300);

            builder.Entity<Activity>()
               .Property(x => x.Title)
               .HasMaxLength(200);

            builder.Entity<Activity>()
                .Property(x => x.Location)
                .HasMaxLength(300);

            builder.Entity<Activity>()
                .Property(x => x.Description)
                .HasMaxLength(2000);

            builder.Entity<Activity>()
                .Property(x => x.Budget)
            .HasPrecision(18, 2);

            builder.Entity<Destination>()
                .HasOne(d => d.Trip)
                .WithMany(t => t.Destinations)
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Activity>()
                .HasOne(d => d.Trip)
                .WithMany(t => t.Activities)
                .HasForeignKey(d => d.TripId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
