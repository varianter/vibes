using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class changePrimaryKeyForStaffingAndPlannedAbsence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Staffing",
                table: "Staffing");

            migrationBuilder.DropIndex(
                name: "IX_Staffing_ProjectId",
                table: "Staffing");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlannedAbsence",
                table: "PlannedAbsence");

            migrationBuilder.DropIndex(
                name: "IX_PlannedAbsence_AbsenceId",
                table: "PlannedAbsence");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Staffing");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "PlannedAbsence");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Staffing",
                table: "Staffing",
                columns: new[] { "ProjectId", "ConsultantId", "Week" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlannedAbsence",
                table: "PlannedAbsence",
                columns: new[] { "AbsenceId", "ConsultantId", "Week" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Staffing",
                table: "Staffing");

            migrationBuilder.DropPrimaryKey(
                name: "PK_PlannedAbsence",
                table: "PlannedAbsence");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Staffing",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "PlannedAbsence",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Staffing",
                table: "Staffing",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_PlannedAbsence",
                table: "PlannedAbsence",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Staffing_ProjectId",
                table: "Staffing",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_PlannedAbsence_AbsenceId",
                table: "PlannedAbsence",
                column: "AbsenceId");
        }
    }
}
