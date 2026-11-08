using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TripService.Migrations
{
    /// <inheritdoc />
    public partial class FixModelsReferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ChecklistItems_TripPlans_TripPlanId",
                table: "ChecklistItems");

            migrationBuilder.DropForeignKey(
                name: "FK_ShareTokens_TripPlans_TripPlanId",
                table: "ShareTokens");

            migrationBuilder.DropIndex(
                name: "IX_ShareTokens_TripPlanId",
                table: "ShareTokens");

            migrationBuilder.DropIndex(
                name: "IX_ChecklistItems_TripPlanId",
                table: "ChecklistItems");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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
                name: "TripId",
                table: "ShareTokens");

            migrationBuilder.DropColumn(
                name: "TripId",
                table: "ChecklistItems");

            migrationBuilder.CreateIndex(
                name: "IX_ShareTokens_TripPlanId",
                table: "ShareTokens",
                column: "TripPlanId");

            migrationBuilder.CreateIndex(
                name: "IX_ChecklistItems_TripPlanId",
                table: "ChecklistItems",
                column: "TripPlanId");

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
    }
}
