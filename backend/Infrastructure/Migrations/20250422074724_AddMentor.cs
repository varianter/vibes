using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddMentor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MentorId",
                table: "Consultant",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Mentors",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ConsultantId = table.Column<int>(type: "int", nullable: false),
                    OrganizationUrlKey = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Mentors", x => x.Id);
                });

            migrationBuilder.UpdateData(
                table: "Consultant",
                keyColumn: "Id",
                keyValue: 1,
                column: "MentorId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Mentors_ConsultantId",
                table: "Mentors",
                column: "ConsultantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Mentors_ConsultantId_OrganizationUrlKey",
                table: "Mentors",
                columns: new[] { "ConsultantId", "OrganizationUrlKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Mentors");

            migrationBuilder.DropColumn(
                name: "MentorId",
                table: "Consultant");
        }
    }
}
