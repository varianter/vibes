using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RemovedOrganization : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Absence_Organization_OrganizationId",
                table: "Absence");

            migrationBuilder.DropForeignKey(
                name: "FK_Customer_Organization_OrganizationId",
                table: "Customer");

            migrationBuilder.DropForeignKey(
                name: "FK_Department_Organization_OrganizationId",
                table: "Department");

            migrationBuilder.DropTable(
                name: "Organization");

            migrationBuilder.DropIndex(
                name: "IX_Department_OrganizationId",
                table: "Department");

            migrationBuilder.DropIndex(
                name: "IX_Customer_OrganizationId",
                table: "Customer");

            migrationBuilder.DropIndex(
                name: "IX_Absence_OrganizationId",
                table: "Absence");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Department");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Customer");

            migrationBuilder.DropColumn(
                name: "OrganizationId",
                table: "Absence");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "Department",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "Customer",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "OrganizationId",
                table: "Absence",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Organization",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    HoursPerWorkday = table.Column<double>(type: "float", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Organization", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Department",
                keyColumn: "Id",
                keyValue: "trondheim",
                column: "OrganizationId",
                value: "variant-as");

            migrationBuilder.InsertData(
                table: "Organization",
                columns: new[] { "Id", "HoursPerWorkday", "Name" },
                values: new object[] { "variant-as", 7.5, "Variant AS" });

            migrationBuilder.CreateIndex(
                name: "IX_Department_OrganizationId",
                table: "Department",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Customer_OrganizationId",
                table: "Customer",
                column: "OrganizationId");

            migrationBuilder.CreateIndex(
                name: "IX_Absence_OrganizationId",
                table: "Absence",
                column: "OrganizationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Absence_Organization_OrganizationId",
                table: "Absence",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customer_Organization_OrganizationId",
                table: "Customer",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Department_Organization_OrganizationId",
                table: "Department",
                column: "OrganizationId",
                principalTable: "Organization",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
