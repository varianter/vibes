using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class VacationAndAbsence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PlannedAbsence",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConsultantId = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    WeekNumber = table.Column<int>(type: "int", nullable: false),
                    ApplicableDays = table.Column<int>(type: "int", nullable: false),
                    Fraction = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlannedAbsence", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlannedAbsence_Consultant_ConsultantId",
                        column: x => x.ConsultantId,
                        principalTable: "Consultant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Vacation",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConsultantId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vacation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Vacation_Consultant_ConsultantId",
                        column: x => x.ConsultantId,
                        principalTable: "Consultant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlannedAbsence_ConsultantId",
                table: "PlannedAbsence",
                column: "ConsultantId");

            migrationBuilder.CreateIndex(
                name: "IX_Vacation_ConsultantId",
                table: "Vacation",
                column: "ConsultantId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlannedAbsence");

            migrationBuilder.DropTable(
                name: "Vacation");
        }
    }
}
