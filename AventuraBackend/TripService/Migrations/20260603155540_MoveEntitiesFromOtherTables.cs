using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripService.Migrations
{
    /// <inheritdoc />
    public partial class MoveEntitiesFromOtherTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChecklistItems_TripPlans_TripId",
                table: "ChecklistItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ShareTokens_TripPlans_TripId",
                table: "ShareTokens");

            migrationBuilder.DropIndex(
                name: "IX_ShareTokens_TripId",
                table: "ShareTokens");

            migrationBuilder.DropIndex(
                name: "IX_ChecklistItems_TripId",
                table: "ChecklistItems");

            migrationBuilder.DropColumn(
                name: "AllowedUserId",
                table: "ShareTokens");

            migrationBuilder.DropColumn(
                name: "TripId",
                table: "ShareTokens");

            migrationBuilder.DropColumn(
                name: "TripId",
                table: "ChecklistItems");

            migrationBuilder.AddColumn<string>(
                name: "AllowedUserEmail",
                table: "ShareTokens",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Activities",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TripId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StartDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    Budget = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    ActivityStatus = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Activities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Activities_TripPlans_TripId",
                        column: x => x.TripId,
                        principalTable: "TripPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Destinations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TripId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Destinations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Destinations_TripPlans_TripId",
                        column: x => x.TripId,
                        principalTable: "TripPlans",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ShareTokens_TripPlanId",
                table: "ShareTokens",
                column: "TripPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_ChecklistItems_TripPlanId",
                table: "ChecklistItems",
                column: "TripPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_Activities_TripId",
                table: "Activities",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_Destinations_TripId",
                table: "Destinations",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChecklistItems_TripPlans_TripPlanId",
                table: "ChecklistItems",
                column: "TripPlanId",
                principalTable: "TripPlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ShareTokens_TripPlans_TripPlanId",
                table: "ShareTokens",
                column: "TripPlanId",
                principalTable: "TripPlans",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChecklistItems_TripPlans_TripPlanId",
                table: "ChecklistItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ShareTokens_TripPlans_TripPlanId",
                table: "ShareTokens");

            migrationBuilder.DropTable(
                name: "Activities");

            migrationBuilder.DropTable(
                name: "Destinations");

            migrationBuilder.DropIndex(
                name: "IX_ShareTokens_TripPlanId",
                table: "ShareTokens");

            migrationBuilder.DropIndex(
                name: "IX_ChecklistItems_TripPlanId",
                table: "ChecklistItems");

            migrationBuilder.DropColumn(
                name: "AllowedUserEmail",
                table: "ShareTokens");

            migrationBuilder.AddColumn<Guid>(
                name: "AllowedUserId",
                table: "ShareTokens",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TripId",
                table: "ShareTokens",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "TripId",
                table: "ChecklistItems",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_ShareTokens_TripId",
                table: "ShareTokens",
                column: "TripId");

            migrationBuilder.CreateIndex(
                name: "IX_ChecklistItems_TripId",
                table: "ChecklistItems",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_ChecklistItems_TripPlans_TripId",
                table: "ChecklistItems",
                column: "TripId",
                principalTable: "TripPlans",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_ShareTokens_TripPlans_TripId",
                table: "ShareTokens",
                column: "TripId",
                principalTable: "TripPlans",
                principalColumn: "Id");
        }
    }
}
