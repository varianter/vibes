using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class TransferredVacationDays : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TransferredVacationDays",
                table: "Consultant",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Consultant",
                keyColumn: "Id",
                keyValue: 1,
                column: "TransferredVacationDays",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TransferredVacationDays",
                table: "Consultant");
        }
    }
}
