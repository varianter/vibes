using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class AddWeek : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TmpWeek",
                table: "Staffing",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Week",
                table: "PlannedAbsence",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.Sql(
                "UPDATE Staffing SET TmpWeek = Staffing.Year*100 + Staffing.Week"
            );
            
            migrationBuilder.Sql(
                "UPDATE PlannedAbsence SET Week = PlannedAbsence.Year*100 + PlannedAbsence.WeekNumber"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TmpWeek",
                table: "Staffing");

            migrationBuilder.DropColumn(
                name: "Week",
                table: "PlannedAbsence");
        }
    }
}
