using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ConstraintsToCustomerName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Customer_OrganizationId",
                table: "Customer");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Customer",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_OrganizationId_Name",
                table: "Customer",
                columns: new[] { "OrganizationId", "Name" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Customer_OrganizationId_Name",
                table: "Customer");

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Customer",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_OrganizationId",
                table: "Customer",
                column: "OrganizationId");
        }
    }
}
