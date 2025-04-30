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
                name: "PersonnelTeams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LeaderId = table.Column<int>(type: "int", nullable: false),
                    OrganizationUrlKey = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PersonnelTeams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PersonnelTeams_Consultant_LeaderId",
                        column: x => x.LeaderId,
                        principalTable: "Consultant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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
                    table.ForeignKey(
                        name: "FK_PersonnelTeamByConsultants_Consultant_ConsultantId",
                        column: x => x.ConsultantId,
                        principalTable: "Consultant",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PersonnelTeamByConsultants_PersonnelTeams_PersonnelTeamId",
                        column: x => x.PersonnelTeamId,
                        principalTable: "PersonnelTeams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelTeamByConsultants_ConsultantId",
                table: "PersonnelTeamByConsultants",
                column: "ConsultantId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelTeamByConsultants_PersonnelTeamId",
                table: "PersonnelTeamByConsultants",
                column: "PersonnelTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelTeams_LeaderId",
                table: "PersonnelTeams",
                column: "LeaderId",
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
