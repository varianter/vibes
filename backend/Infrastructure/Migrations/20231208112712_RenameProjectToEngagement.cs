using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
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

            migrationBuilder.RenameColumn(
                name: "ProjectId",
                table: "Staffing",
                newName: "EngagementId");

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

            migrationBuilder.RenameColumn(
                name: "EngagementId",
                table: "Staffing",
                newName: "ProjectId");

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
