using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Database.Migrations
{
    /// <inheritdoc />
    public partial class RenameProjectToEngagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Staffing_Project_ProjectId",
                table: "Staffing");

            migrationBuilder.AddColumn<int>(
                name: "EngagementId",
                table: "Staffing",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Staffing_EngagementId",
                table: "Staffing",
                column: "EngagementId");

            migrationBuilder.AddForeignKey(
                name: "FK_Staffing_Project_EngagementId",
                table: "Staffing",
                column: "EngagementId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Staffing_Project_EngagementId",
                table: "Staffing");

            migrationBuilder.DropIndex(
                name: "IX_Staffing_EngagementId",
                table: "Staffing");

            migrationBuilder.DropColumn(
                name: "EngagementId",
                table: "Staffing");

            migrationBuilder.AddForeignKey(
                name: "FK_Staffing_Project_ProjectId",
                table: "Staffing",
                column: "ProjectId",
                principalTable: "Project",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
