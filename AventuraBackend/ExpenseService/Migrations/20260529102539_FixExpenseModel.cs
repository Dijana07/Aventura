using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ExpenseService.Migrations
{
    /// <inheritdoc />
    public partial class FixExpenseModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DateTime",
                table: "Expenses");

            migrationBuilder.RenameColumn(
                name: "TripPlanId",
                table: "Expenses",
                newName: "UserId");

            migrationBuilder.AddColumn<DateOnly>(
                name: "Date",
                table: "Expenses",
                type: "date",
                nullable: false,
                defaultValue: new DateOnly(1, 1, 1));

            migrationBuilder.AddColumn<Guid>(
                name: "TripId",
                table: "Expenses",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Date",
                table: "Expenses");

            migrationBuilder.DropColumn(
                name: "TripId",
                table: "Expenses");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Expenses",
                newName: "TripPlanId");

            migrationBuilder.AddColumn<DateTime>(
                name: "DateTime",
                table: "Expenses",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }
    }
}
