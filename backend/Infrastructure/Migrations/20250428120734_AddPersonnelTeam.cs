using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddPersonnelTeam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "PersonnelTeamByConsultants",
                columns: table => new
                {
                    ConsultantId = table.Column<int>(type: "int", nullable: false),
                    PersonnelTeamId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonnelTeamByConsultants", x => new { x.ConsultantId, x.PersonnelTeamId });
                });

            migrationBuilder.CreateTable(
                name: "PersonnelTeams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LeaderId = table.Column<int>(type: "int", nullable: false),
                    OrganizationUrlKey = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonnelTeams", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelTeams_LeaderId",
                table: "PersonnelTeams",
                column: "LeaderId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelTeams_LeaderId_OrganizationUrlKey",
                table: "PersonnelTeams",
                columns: new[] { "LeaderId", "OrganizationUrlKey" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PersonnelTeamByConsultants");

            migrationBuilder.DropTable(
                name: "PersonnelTeams");
        }
    }
}
