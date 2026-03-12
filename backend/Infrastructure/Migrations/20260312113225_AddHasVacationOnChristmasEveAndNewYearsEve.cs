using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHasVacationOnChristmasEveAndNewYearsEve : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasVacationOnChristmasEveAndNewYearsEve",
                table: "Organization",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Organization",
                keyColumn: "Id",
                keyValue: "variant-as",
                columns: new[] { "HasVacationInChristmas", "HasVacationOnChristmasEveAndNewYearsEve" },
                values: new object[] { false, true });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasVacationOnChristmasEveAndNewYearsEve",
                table: "Organization");

            migrationBuilder.UpdateData(
                table: "Organization",
                keyColumn: "Id",
                keyValue: "variant-as",
                column: "HasVacationInChristmas",
                value: true);
        }
    }
}
