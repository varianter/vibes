using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedHolidayModelAndFloatToDoubleCastFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "HoursPerWorkday",
                table: "Organization",
                type: "float",
                nullable: false,
                oldClrType: typeof(float),
                oldType: "real");

            migrationBuilder.UpdateData(
                table: "Organization",
                keyColumn: "Id",
                keyValue: "variant-as",
                column: "HoursPerWorkday",
                value: 7.5);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<float>(
                name: "HoursPerWorkday",
                table: "Organization",
                type: "real",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.UpdateData(
                table: "Organization",
                keyColumn: "Id",
                keyValue: "variant-as",
                column: "HoursPerWorkday",
                value: 7.5f);
        }
    }
}
