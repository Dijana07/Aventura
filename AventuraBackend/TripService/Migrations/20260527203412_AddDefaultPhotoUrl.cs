using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripService.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultPhotoUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhotoUrl",
                table: "TripPlans",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                defaultValue: "https://res.cloudinary.com/dskyn1svm/image/upload/v1779900412/Screenshot_663_-modified_zxou8a.png");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoUrl",
                table: "TripPlans");
        }
    }
}
