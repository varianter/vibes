using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddEstimatedHourPrice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EstimatedHourPrice",
                table: "Consultant",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Consultant",
                keyColumn: "Id",
                keyValue: 1,
                column: "EstimatedHourPrice",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EstimatedHourPrice",
                table: "Consultant");
        }
    }
}
