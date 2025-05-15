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
            migrationBuilder.AddColumn<int>(
                name: "PersonnelTeamId",
                table: "Consultant",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PersonnelTeams",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrganizationUrlKey = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LeaderId = table.Column<int>(type: "int", nullable: false)
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

            migrationBuilder.UpdateData(
                table: "Consultant",
                keyColumn: "Id",
                keyValue: 1,
                column: "PersonnelTeamId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_Consultant_PersonnelTeamId",
                table: "Consultant",
                column: "PersonnelTeamId");

            migrationBuilder.CreateIndex(
                name: "IX_PersonnelTeams_LeaderId",
                table: "PersonnelTeams",
                column: "LeaderId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Consultant_PersonnelTeams_PersonnelTeamId",
                table: "Consultant",
                column: "PersonnelTeamId",
                principalTable: "PersonnelTeams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultant_PersonnelTeams_PersonnelTeamId",
                table: "Consultant");

            migrationBuilder.DropTable(
                name: "PersonnelTeams");

            migrationBuilder.DropIndex(
                name: "IX_Consultant_PersonnelTeamId",
                table: "Consultant");

            migrationBuilder.DropColumn(
                name: "PersonnelTeamId",
                table: "Consultant");
        }
    }
}
