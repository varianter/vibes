using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCustomerTableIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Customer_OrganizationId_Name",
                table: "Customer");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_OrganizationId_Name_IsActive",
                table: "Customer",
                columns: new[] { "OrganizationId", "Name", "IsActive" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
