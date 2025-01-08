using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddForecast : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Customer_OrganizationId_Name",
                table: "Customer");

            migrationBuilder.CreateTable(
                name: "Forecasts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConsultantId = table.Column<int>(type: "int", nullable: false),
                    MonthYear = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OriginalValue = table.Column<int>(type: "int", nullable: false),
                    AdjustedValue = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Forecasts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Forecasts_Consultant_ConsultantId",
                        column: x => x.ConsultantId,
                        principalTable: "Consultant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Customer_OrganizationId_Name_IsActive",
                table: "Customer",
                columns: new[] { "OrganizationId", "Name", "IsActive" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Forecasts_ConsultantId",
                table: "Forecasts",
                column: "ConsultantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Forecasts");

            migrationBuilder.DropIndex(
                name: "IX_Customer_OrganizationId_Name_IsActive",
                table: "Customer");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_OrganizationId_Name",
                table: "Customer",
                columns: new[] { "OrganizationId", "Name" },
                unique: true);
        }
    }
}
